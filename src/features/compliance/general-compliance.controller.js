import { ApiResponse } from "../../common/responses/api-response.js";
import complianceService from "./general-compliance.service.js";

const getCompliance = async (req, res, next) => {
  try {
    const {
      page = "1",
      limit = "10",
      search = "",
      job_type_id: jobTypeId = "",
    } = req.query;

    if (
      typeof page !== "string" ||
      typeof limit !== "string" ||
      typeof search !== "string" ||
      typeof jobTypeId !== "string"
    ) {
      return ApiResponse.error(
        res,
        "Invalid compliance query parameters.",
        400,
      );
    }

    const parsedPage = Number(page);
    const parsedLimit = Number(limit);

    if (
      !Number.isInteger(parsedPage) ||
      parsedPage < 1 ||
      !Number.isInteger(parsedLimit) ||
      parsedLimit < 1 ||
      parsedLimit > 100
    ) {
      return ApiResponse.error(
        res,
        "Page must be a positive integer and limit must be between 1 and 100.",
        400,
      );
    }

    const result = await complianceService.listCompliance({
      page: parsedPage,
      limit: parsedLimit,
      search: search.trim(),
      jobTypeId: jobTypeId.trim(),
    });

    return ApiResponse.success(
      res,
      result,
      "Compliance records retrieved successfully.",
    );
  } catch (error) {
    next(error);
  }
};

const generalComplianceController = {
  getCompliance,
};

export default generalComplianceController;
