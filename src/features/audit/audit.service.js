import { SENSITIVE_FIELDS } from "../../common/constants/senstive-fields.js";
import { auditRepository } from "./audit.repository.js";

/**
 * --------------------------------------------------------------------------
 * serializeData
 *
 * Converts structured JavaScript values into JSON strings before saving them
 * to MySQL TEXT columns.
 * --------------------------------------------------------------------------
 */

const sanitizeData = (value) => {
  if (value === null || value === undefined) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeData);
  }

  if (typeof value === "object") {
    return Object.entries(value).reduce((result, [key, currentValue]) => {
      const normalizedKey = key.toLowerCase();

      const isSensitive = SENSITIVE_FIELDS.some(
        (sensitiveKey) =>
          normalizedKey === sensitiveKey ||
          normalizedKey.includes(sensitiveKey),
      );

      result[key] = isSensitive ? "[REDACTED]" : sanitizeData(currentValue);

      return result;
    }, {});
  }

  return value;
};

const serializeData = (data) => {
  if (data === undefined || data === null) {
    return null;
  }

  return JSON.stringify(sanitizeData(data));
};

/**
 * --------------------------------------------------------------------------
 * parseData
 *
 * Safely converts JSON strings from the database back into JavaScript values.
 *
 * Invalid or legacy data should not cause the entire audit retrieval request
 * to fail.
 * --------------------------------------------------------------------------
 */

const parseData = (data) => {
  if (data === undefined || data === null) {
    return null;
  }

  if (typeof data !== "string") {
    return data;
  }

  try {
    return JSON.parse(data);
  } catch {
    return data;
  }
};

/**
 * --------------------------------------------------------------------------
 * toAuditData
 *
 * Converts database audit records into application-friendly objects.
 * --------------------------------------------------------------------------
 */

const toAuditData = (auditLog) => {
  if (!auditLog) {
    return null;
  }

  const data =
    typeof auditLog.toJSON === "function" ? auditLog.toJSON() : auditLog;

  return {
    ...data,

    previous_data: parseData(data.previous_data),

    new_data: parseData(data.new_data),

    metadata: parseData(data.metadata),
  };
};

/**
 * --------------------------------------------------------------------------
 * create
 *
 * Creates a new audit log record.
 * --------------------------------------------------------------------------
 */

const create = async (data, options = {}) => {
  const auditLog = await auditRepository.create(
    {
      user_id: data.userId ?? null,

      action: data.action,

      entity_type: data.entityType,

      entity_id:
        data.entityId !== undefined && data.entityId !== null
          ? String(data.entityId)
          : null,

      application_id: data.applicationId ?? null,

      previous_data: serializeData(data.previousData),

      new_data: serializeData(data.newData),

      metadata: serializeData(data.metadata),

      ip_address: data.ipAddress ?? null,

      user_agent: data.userAgent ?? null,
    },
    options,
  );

  return toAuditData(auditLog);
};

/**
 * --------------------------------------------------------------------------
 * findByApplicationId
 * --------------------------------------------------------------------------
 */

const findByApplicationId = async (applicationId, options = {}) => {
  const auditLogs = await auditRepository.findByApplicationId(
    applicationId,
    options,
  );

  return auditLogs.map(toAuditData);
};

/**
 * --------------------------------------------------------------------------
 * findByEntity
 * --------------------------------------------------------------------------
 */

const findByEntity = async (entityType, entityId, options = {}) => {
  const auditLogs = await auditRepository.findByEntity(
    entityType,
    String(entityId),
    options,
  );

  return auditLogs.map(toAuditData);
};

/**
 * --------------------------------------------------------------------------
 * findByUserId
 * --------------------------------------------------------------------------
 */

const findByUserId = async (userId, options = {}) => {
  const auditLogs = await auditRepository.findByUserId(userId, options);

  return auditLogs.map(toAuditData);
};

export const auditService = {
  create,
  findByApplicationId,
  findByEntity,
  findByUserId,
};
