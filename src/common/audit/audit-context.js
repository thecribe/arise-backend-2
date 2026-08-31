/**
 * --------------------------------------------------------------------------
 * createAuditContext
 *
 * Extracts audit information from an Express request.
 *
 * This prevents Express request objects from being passed into business
 * services.
 * --------------------------------------------------------------------------
 */

const createAuditContext = (req) => {
  return {
    userId: req.user?.id ?? null,

    ipAddress: req.ip ?? null,

    userAgent: req.get("user-agent") ?? null,
  };
};

export { createAuditContext };
