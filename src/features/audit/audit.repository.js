import { AuditLog } from "../../database/models/AuditLog.js";

const create = async (data, options = {}) => {
  return AuditLog.create(data, options);
};

const findByApplicationId = async (applicationId, options = {}) => {
  return AuditLog.findAll({
    where: {
      application_id: applicationId,
    },

    order: [["created_at", "DESC"]],

    ...options,
  });
};

const findByEntity = async (entityType, entityId, options = {}) => {
  return AuditLog.findAll({
    where: {
      entity_type: entityType,
      entity_id: entityId,
    },

    order: [["created_at", "DESC"]],

    ...options,
  });
};

const findByUserId = async (userId, options = {}) => {
  return AuditLog.findAll({
    where: {
      user_id: userId,
    },

    order: [["created_at", "DESC"]],

    ...options,
  });
};

export const auditRepository = {
  create,
  findByApplicationId,
  findByEntity,
  findByUserId,
};
