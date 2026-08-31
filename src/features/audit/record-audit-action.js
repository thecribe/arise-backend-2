import { auditService } from "./audit.service.js";

/**
 * --------------------------------------------------------------------------
 * recordAuditAction
 *
 * Reusable helper for recording important application actions.
 *
 * This is the primary API that other feature services should use for
 * audit logging.
 * --------------------------------------------------------------------------
 */

const recordAuditAction = async ({
  auditContext = {},

  action,

  entityType,

  entityId = null,

  applicationId = null,

  previousData = null,

  newData = null,

  metadata = null,

  options = {},
}) => {
  return auditService.create(
    {
      userId: auditContext.userId ?? null,

      action,

      entityType,

      entityId,

      applicationId,

      previousData,

      newData,

      metadata,

      ipAddress: auditContext.ipAddress ?? null,

      userAgent: auditContext.userAgent ?? null,
    },

    options,
  );
};

export { recordAuditAction };
