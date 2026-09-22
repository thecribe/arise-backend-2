/**
 * -----------------------------------------------------------------------------
 * File: documents.controller.js
 *
 * Description:
 * Handles requests for manager-generated document data.
 * -----------------------------------------------------------------------------
 */

import { ApiResponse } from "../../common/responses/api-response.js";
import documentsService from "./documents.service.js";

/**
 * -----------------------------------------------------------------------------
 * Get Application Form Document Data
 * -----------------------------------------------------------------------------
 */

const getApplicationFormDocument = async (req, res, next) => {
  try {
    const { applicationId } = req.params;

    const documentData =
      await documentsService.getApplicationFormDocumentData(applicationId);

    return ApiResponse.success(
      res,
      documentData,
      "Application form document data retrieved successfully.",
    );
  } catch (error) {
    next(error);
  }
};

const documentsController = {
  getApplicationFormDocument,
};

export default documentsController;
