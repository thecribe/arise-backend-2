/**
 * -----------------------------------------------------------------------------
 * File: declarations.service.js
 *
 * Description:
 * Provides declaration definitions for an applicant application.
 * -----------------------------------------------------------------------------
 */

import { AUDIT_ACTIONS } from "../../common/constants/audit-actions.js";
import { AUDIT_ENTITY_TYPES } from "../../common/constants/audit-entity-types.js";
import { ConflictError } from "../../common/errors/conflict-error.js";
import { NotFoundError } from "../../common/errors/not-found-error.js";
import { sequelize } from "../../config/database.js";
import {
  createApplicationSection,
  findApplicationSection,
} from "../applicant-application/applicant-application.repository.js";
import { recordAuditAction } from "../audit/record-audit-action.js";

import { findApplicantApplicationById } from "../users/user.repository.js";
import {
  findDeclarationsByApplicationId,
  findDeclaration,
  createDeclaration,
  updateDeclaration,
  updateApplicationSectionStatus,
} from "./declarations.repository.js";

import declarationSections from "./fields/eachsection.js";

const APPLICATION_SECTION_STATUSES = [
  "locked",
  "in_progress",
  "submitted",
  "rejected",
  "approved",
];

export const syncDeclarationSection = async (applicationId, options = {}) => {
  const existingSection = await findApplicationSection(
    applicationId,
    "declarations",
    options,
  );

  if (existingSection) {
    return existingSection;
  }

  return createApplicationSection(
    {
      application_id: applicationId,
      section_id: "declarations",
      status: "in_progress",
    },
    options,
  );
};
/**
 * -----------------------------------------------------------------------------
 * Get Applicant Declarations
 * -----------------------------------------------------------------------------
 *
 * Declaration definitions are stored in a file rather than the database.
 *
 * The application ID is used to ensure that the requested application exists.
 * -----------------------------------------------------------------------------
 */

const getDeclarations = async (applicationId) => {
  if (!applicationId) {
    throw new Error("Application ID is required.");
  }

  const application = await findApplicantApplicationById(applicationId);

  if (!application) {
    throw new NotFoundError("Applicant application not found.");
  }

  await syncDeclarationSection(applicationId);

  return declarationSections;
};

const getDeclarationValues = async (applicationId) => {
  if (!applicationId) {
    throw new Error("Application ID is required.");
  }

  const application = await findApplicantApplicationById(applicationId);

  if (!application) {
    throw new NotFoundError("Applicant application not found.");
  }

  const declarations = await findDeclarationsByApplicationId(applicationId);

  return declarations.reduce((result, declaration) => {
    result[declaration.section_id] = declaration.values;

    return result;
  }, {});
};

const saveDeclaration = async ({
  applicationId,
  sectionId,
  values,
  changedBy,
  auditContext,
}) => {
  return sequelize.transaction(async (transaction) => {
    /**
     * -------------------------------------------------------------------------
     * Confirm application exists.
     * -------------------------------------------------------------------------
     */
    const application = await findApplicantApplicationById(applicationId, {
      transaction,
    });

    if (!application) {
      throw new NotFoundError("Applicant application not found.");
    }

    /**
     * -------------------------------------------------------------------------
     * Confirm declaration section exists.
     * -------------------------------------------------------------------------
     */
    const section = declarationSections[sectionId];

    if (!section) {
      throw new NotFoundError("Declaration section not found.");
    }

    /**
     * -------------------------------------------------------------------------
     * Validate submitted values.
     * -------------------------------------------------------------------------
     */

    if (!values || typeof values !== "object" || Array.isArray(values)) {
      throw new Error("Declaration values must be a valid object.");
    }

    /**
     * -------------------------------------------------------------------------
     * Get existing declaration.
     * -------------------------------------------------------------------------
     */
    const existingDeclaration = await findDeclaration(
      application.id,
      sectionId,
      {
        transaction,
      },
    );

    /**
     * -------------------------------------------------------------------------
     * Create declaration.
     * -------------------------------------------------------------------------
     */
    if (!existingDeclaration) {
      const declaration = await createDeclaration(
        {
          applicationId: application.id,
          sectionId,
          values,
        },
        {
          transaction,
        },
      );

      if (!declaration) {
        throw new ConflictError("Declaration could not be created.");
      }

      /**
       * -----------------------------------------------------------------------
       * Record declaration creation audit.
       * -----------------------------------------------------------------------
       */
      await recordAuditAction({
        auditContext,
        action: AUDIT_ACTIONS.APPLICANT_DECLARATION_CREATED,
        entityType: AUDIT_ENTITY_TYPES.APPLICANT_DECLARATION,
        entityId: declaration.id,
        applicationId: application.id,
        previousData: null,
        newData: {
          sectionId,
          values,
        },
        metadata: {
          applicationId: application.id,
          sectionId,
          changedBy,
        },
        options: {
          transaction,
        },
      });

      return {
        id: declaration.id,
        applicationId: declaration.application_id,
        sectionId: declaration.section_id,
        values: declaration.values,
        createdAt: declaration.created_at
          ? declaration.created_at.toISOString()
          : null,
        updatedAt: declaration.updated_at
          ? declaration.updated_at.toISOString()
          : null,
      };
    }

    /**
     * -------------------------------------------------------------------------
     * Capture previous values before updating.
     * -------------------------------------------------------------------------
     */
    const previousValues = existingDeclaration.values;

    /**
     * -------------------------------------------------------------------------
     * Prevent unnecessary updates.
     * -------------------------------------------------------------------------
     */
    if (JSON.stringify(previousValues) === JSON.stringify(values)) {
      throw new ConflictError(
        "Declaration already contains the submitted values.",
      );
    }

    /**
     * -------------------------------------------------------------------------
     * Update existing declaration.
     * -------------------------------------------------------------------------
     */
    const updatedDeclaration = await updateDeclaration(
      existingDeclaration,
      values,
      {
        transaction,
      },
    );

    if (!updatedDeclaration) {
      throw new ConflictError("Declaration could not be updated.");
    }

    /**
     * -------------------------------------------------------------------------
     * Record declaration update audit.
     * -------------------------------------------------------------------------
     */
    await recordAuditAction({
      auditContext,
      action: AUDIT_ACTIONS.APPLICANT_DECLARATION_UPDATED,
      entityType: AUDIT_ENTITY_TYPES.APPLICANT_DECLARATION,
      entityId: updatedDeclaration.id,
      applicationId: application.id,
      previousData: {
        sectionId,
        values: previousValues,
      },
      newData: {
        sectionId,
        values,
      },
      metadata: {
        applicationId: application.id,
        sectionId,
        changedBy,
      },
      options: {
        transaction,
      },
    });

    /**
     * -------------------------------------------------------------------------
     * Return clean API contract.
     * -------------------------------------------------------------------------
     */
    return {
      id: updatedDeclaration.id,
      applicationId: updatedDeclaration.application_id,
      sectionId: updatedDeclaration.section_id,
      values: updatedDeclaration.values,
      createdAt: updatedDeclaration.created_at
        ? updatedDeclaration.created_at.toISOString()
        : null,
      updatedAt: updatedDeclaration.updated_at
        ? updatedDeclaration.updated_at.toISOString()
        : null,
    };
  });
};

const getApplicationSectionStatus = async ({ applicationId, sectionId }) => {
  if (!applicationId) {
    throw new NotFoundError("Application ID is required.");
  }

  if (!sectionId) {
    throw new NotFoundError("Section ID is required.");
  }

  const application = await findApplicantApplicationById(applicationId);

  if (!application) {
    throw new NotFoundError("Applicant application not found.");
  }

  const section = await findApplicationSection(applicationId, sectionId);

  if (!section) {
    throw new NotFoundError("Application section not found.");
  }

  return {
    sectionId: section.section_id,
    status: section.status,
  };
};

const updateApplicationSectionStatusService = async ({
  applicationId,
  sectionId,
  status,
}) => {
  if (!applicationId) {
    throw new Error("Application ID is required.");
  }

  if (!sectionId) {
    throw new Error("Section ID is required.");
  }

  if (!APPLICATION_SECTION_STATUSES.includes(status)) {
    throw new ValidationError("Invalid application section status.");
  }

  return sequelize.transaction(async (transaction) => {
    const application = await findApplicantApplicationById(applicationId, {
      transaction,
    });

    if (!application) {
      throw new NotFoundError("Applicant application not found.");
    }

    const section = await findApplicationSection(applicationId, sectionId, {
      transaction,
    });

    if (!section) {
      throw new NotFoundError("Application section not found.");
    }

    if (section.status === status) {
      throw new ConflictError(`Application section is already ${status}.`);
    }

    const updatedSection = await updateApplicationSectionStatus(
      section,
      status,
      { transaction },
    );

    return {
      sectionId: updatedSection.section_id,
      status: updatedSection.status,
      updatedAt: updatedSection.updated_at,
    };
  });
};

export const declarationsService = {
  getDeclarations,
  getDeclarationValues,
  saveDeclaration,
  getApplicationSectionStatus,
  updateApplicationSectionStatusService,
};
