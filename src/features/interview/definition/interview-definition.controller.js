import { ApiResponse } from "../../../common/responses/api-response.js";
import interviewDefinitionService from "./interview-definition.service.js";

const getDefinition = async (req, res, next) => {
  try {
    const definition = interviewDefinitionService.getInterviewDefinition();

    return ApiResponse.success(
      res,
      definition,
      "Interview definition retrieved successfully.",
    );
  } catch (error) {
    next(error);
  }
};

const getSections = async (req, res, next) => {
  try {
    const sections = interviewDefinitionService.getInterviewSections();

    return ApiResponse.success(
      res,
      sections,
      "Interview sections retrieved successfully.",
    );
  } catch (error) {
    next(error);
  }
};

const getSectionFields = async (req, res, next) => {
  try {
    const { sectionId } = req.params;

    const fields = interviewDefinitionService.getInterviewFields(sectionId);

    if (!fields) {
      return res.status(404).json({
        success: false,
        message: "Interview section not found.",
      });
    }

    return ApiResponse.success(
      res,
      fields,
      "Interview section fields retrieved successfully.",
    );
  } catch (error) {
    next(error);
  }
};

export const interviewDefinitionController = {
  getDefinition,
  getSections,
  getSectionFields,
};
