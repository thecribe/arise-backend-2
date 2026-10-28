import { AUDIT_ACTIONS } from "../../common/constants/audit-actions.js";
import { AUDIT_ENTITY_TYPES } from "../../common/constants/audit-entity-types.js";
import { ConflictError } from "../../common/errors/conflict-error.js";
import { NotFoundError } from "../../common/errors/not-found-error.js";
import { ValidationError } from "../../common/errors/validation-error.js";
import { sequelize } from "../../config/database.js";
import { findApplicationSection } from "../applicant-application/applicant-application.repository.js";
import { recordAuditAction } from "../audit/record-audit-action.js";
import {
  findApplicantApplicationByApplicantId,
  findApplicantApplicationById,
} from "../users/user.repository.js";
import {
  findDeclarationsByApplicationId,
  findDeclaration,
  createDeclaration,
  updateDeclaration,
} from "./declarations.repository.js";
import { syncDeclarationSection } from "./declarations.service.js";
import declarationSections from "./fields/eachsection.js";

const EDITABLE_STATUSES = ["in_progress", "rejected"];

const resolveApplicantApplication = async (applicantId, options = {}) => {
  const application = await findApplicantApplicationByApplicantId(
    applicantId,
    options,
  );

  if (!application) {
    throw new NotFoundError(
      "No application was found for the authenticated applicant.",
    );
  }

  return application;
};

const getDeclarations = async ({ applicantId }) => {
  if (!applicantId) {
    throw new Error("Applicant ID is required.");
  }

  return sequelize.transaction(async (transaction) => {
    const application = await findApplicantApplicationByApplicantId(
      applicantId,
      { transaction },
    );

    if (!application) {
      throw new NotFoundError("Applicant application not found.");
    }

    await syncDeclarationSection(application.id, { transaction });

    return declarationSections;
  });
};

const getDeclarationValues = async ({ applicantId }) => {
  const application = await resolveApplicantApplication(applicantId);

  const declarations = await findDeclarationsByApplicationId(application.id);

  return declarations.reduce((result, declaration) => {
    result[declaration.section_id] = declaration.values;
    return result;
  }, {});
};

const saveDeclaration = async ({
  applicantId,
  sectionId,
  values,
  changedBy,
  auditContext,
}) => {
  return sequelize.transaction(async (transaction) => {
    const application = await resolveApplicantApplication(applicantId, {
      transaction,
    });

    const declaration = declarationSections[sectionId];

    if (!declaration) {
      throw new NotFoundError(
        `Declaration section "${sectionId}" was not found.`,
      );
    }

    /*
     * ---------------------------------------------------------------
     * Resolve the application workflow section.
     * ---------------------------------------------------------------
     */
    const applicationSection = await findApplicationSection(
      application.id,
      "declarations",
      { transaction },
    );

    if (!applicationSection) {
      throw new NotFoundError("Declaration application section not found.");
    }

    /*
     * ---------------------------------------------------------------
     * The frontend permission is only UX.
     *
     * The backend must enforce the same rule.
     * ---------------------------------------------------------------
     */
    if (!EDITABLE_STATUSES.includes(applicationSection.status)) {
      throw new ConflictError(
        `Declarations cannot be edited while the section is ${applicationSection.status}.`,
      );
    }

    if (!values || typeof values !== "object" || Array.isArray(values)) {
      throw new ValidationError("Declaration values must be a valid object.");
    }

    const existing = await findDeclaration(application.id, sectionId, {
      transaction,
    });

    /*
     * ---------------------------------------------------------------
     * Create
     * ---------------------------------------------------------------
     */
    if (!existing) {
      const created = await createDeclaration(
        {
          applicationId: application.id,
          sectionId,
          values,
        },
        { transaction },
      );

      await recordAuditAction({
        action: AUDIT_ACTIONS.APPLICANT_DECLARATION_CREATED,
        entityType: AUDIT_ENTITY_TYPES.APPLICANT_DECLARATION,
        entityId: created.id,
        changedBy,
        auditContext,
        options: { transaction },
      });

      return {
        id: created.id,
        applicationId: created.application_id,
        sectionId: created.section_id,
        values: created.values,
        createdAt: created.created_at,
        updatedAt: created.updated_at,
      };
    }

    /*
     * ---------------------------------------------------------------
     * Update
     * ---------------------------------------------------------------
     */
    const previousValues = existing.values;

    if (JSON.stringify(previousValues) === JSON.stringify(values)) {
      throw new ConflictError("No changes were made to the declaration.");
    }

    const updated = await updateDeclaration(existing, values, { transaction });

    await recordAuditAction({
      action: AUDIT_ACTIONS.APPLICANT_DECLARATION_UPDATED,
      entityType: AUDIT_ENTITY_TYPES.APPLICANT_DECLARATION,
      entityId: updated.id,
      changedBy,
      auditContext,
      metadata: {
        previousValues,
        newValues: values,
      },
      options: { transaction },
    });

    return {
      id: updated.id,
      applicationId: updated.application_id,
      sectionId: updated.section_id,
      values: updated.values,
      createdAt: updated.created_at,
      updatedAt: updated.updated_at,
    };
  });
};

const getApplicantApplicationSectionStatus = async ({
  applicantId,
  sectionId,
}) => {
  const application = await findApplicantApplicationByApplicantId(applicantId);

  if (!application) {
    throw new NotFoundError("Applicant application not found.");
  }

  const section = await findApplicationSection(application.id, sectionId);

  if (!section) {
    throw new NotFoundError("Application section not found.");
  }

  return {
    sectionId: section.section_id,
    status: section.status,
  };
};

export const applicantDeclarationsService = {
  getDeclarations,
  getDeclarationValues,
  saveDeclaration,
  getApplicantApplicationSectionStatus,
};
