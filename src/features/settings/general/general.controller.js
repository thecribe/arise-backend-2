import { createAuditContext } from "../../../common/audit/audit-context.js";
import { ApiResponse } from "../../../common/responses/api-response.js";
import { generalSettingsService } from "./general.service.js";

const getGeneralSettings = async (req, res, next) => {
  try {
    const settings = await generalSettingsService.getGeneralSettings();

    return ApiResponse.success(
      res,
      settings,
      "General settings retrieved successfully.",
    );
  } catch (error) {
    next(error);
  }
};

const updateGeneralSettings = async (req, res, next) => {
  try {
    const auditContext = createAuditContext(req);

    const settings = await generalSettingsService.updateGeneralSettings(
      req.body,
      auditContext,
    );

    return ApiResponse.success(
      res,
      settings,
      "General settings updated successfully.",
    );
  } catch (error) {
    next(error);
  }
};

export default {
  getGeneralSettings,
  updateGeneralSettings,
};
