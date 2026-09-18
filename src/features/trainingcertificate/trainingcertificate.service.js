import { AUDIT_ACTIONS } from "../../common/constants/audit-actions.js";
import { AUDIT_ENTITY_TYPES } from "../../common/constants/audit-entity-types.js";
import { ConflictError } from "../../common/errors/conflict-error.js";
import { NotFoundError } from "../../common/errors/not-found-error.js";
import { sequelize } from "../../config/database.js";
import { recordAuditAction } from "../audit/record-audit-action.js";
import { trainingCertificateRepository } from "./trainingcertificate.repository.js";

const getTrainingCertificateRequirements = async ({
  includeInactive = false,
} = {}) => {
  return trainingCertificateRepository.findAll({
    includeInactive,
  });
};

const getTrainingCertificateRequirementById = async (id) => {
  const requirement = await trainingCertificateRepository.findById(id);

  if (!requirement) {
    throw new NotFoundError("Training certificate requirement not found.");
  }

  return requirement;
};

const createTrainingCertificateRequirement = async (data, auditContext) => {
  return sequelize.transaction(async (transaction) => {
    const existing = await trainingCertificateRepository.findByName(data.name, {
      transaction,
    });

    if (existing) {
      throw new ConflictError(
        "A training certificate requirement with this name already exists.",
      );
    }

    const requirement = await trainingCertificateRepository.create(
      {
        name: data.name,
        description: data.description ?? null,
      },
      { transaction },
    );

    await recordAuditAction({
      auditContext,
      action: AUDIT_ACTIONS.TRAINING_CERTIFICATE_REQUIREMENT_CREATED,
      entityType: AUDIT_ENTITY_TYPES.TRAINING_CERTIFICATE_REQUIREMENT,
      entityId: requirement.id,
      previousData: null,
      newData: {
        name: requirement.name,
        description: requirement.description,
        active: requirement.active,
      },
      metadata: {
        feature: "training-certificates",
        operation: "create",
      },
      options: { transaction },
    });

    return requirement;
  });
};

const updateTrainingCertificateRequirement = async (id, data, auditContext) => {
  return sequelize.transaction(async (transaction) => {
    const requirement = await trainingCertificateRepository.findById(id, {
      transaction,
    });

    if (!requirement) {
      throw new NotFoundError("Training certificate requirement not found.");
    }

    if (data.name !== undefined && data.name !== requirement.name) {
      const existing = await trainingCertificateRepository.findByName(
        data.name,
        { transaction },
      );

      if (existing && existing.id !== requirement.id) {
        throw new ConflictError(
          "A training certificate requirement with this name already exists.",
        );
      }
    }

    const previousData = {
      name: requirement.name,
      description: requirement.description,
      active: requirement.active,
    };

    await trainingCertificateRepository.update(
      requirement,
      {
        name: data.name ?? requirement.name,
        description: data.description ?? requirement.description,
      },
      { transaction },
    );

    const newData = {
      name: requirement.name,
      description: requirement.description,
      active: requirement.active,
    };

    await recordAuditAction({
      auditContext,
      action: AUDIT_ACTIONS.TRAINING_CERTIFICATE_REQUIREMENT_UPDATED,
      entityType: AUDIT_ENTITY_TYPES.TRAINING_CERTIFICATE_REQUIREMENT,
      entityId: requirement.id,
      previousData,
      newData,
      metadata: {
        feature: "training-certificates",
        operation: "update",
      },
      options: { transaction },
    });

    return requirement;
  });
};

const updateTrainingCertificateRequirementStatus = async (
  id,
  active,
  auditContext,
) => {
  return sequelize.transaction(async (transaction) => {
    const requirement = await trainingCertificateRepository.findById(id, {
      transaction,
    });

    if (!requirement) {
      throw new NotFoundError("Training certificate requirement not found.");
    }

    const previousData = {
      name: requirement.name,
      description: requirement.description,
      active: requirement.active,
    };

    await trainingCertificateRepository.update(
      requirement,
      {
        active,
      },
      { transaction },
    );

    const newData = {
      name: requirement.name,
      description: requirement.description,
      active: requirement.active,
    };

    await recordAuditAction({
      auditContext,
      action: active
        ? AUDIT_ACTIONS.TRAINING_CERTIFICATE_REQUIREMENT_ACTIVATED
        : AUDIT_ACTIONS.TRAINING_CERTIFICATE_REQUIREMENT_DEACTIVATED,
      entityType: AUDIT_ENTITY_TYPES.TRAINING_CERTIFICATE_REQUIREMENT,
      entityId: requirement.id,
      previousData,
      newData,
      metadata: {
        feature: "training-certificates",
        operation: "status-update",
      },
      options: { transaction },
    });

    return requirement;
  });
};

export const trainingCertificateService = {
  getTrainingCertificateRequirements,
  getTrainingCertificateRequirementById,
  createTrainingCertificateRequirement,
  updateTrainingCertificateRequirement,
  updateTrainingCertificateRequirementStatus,
};
