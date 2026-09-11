import { createAuditContext } from "../../common/audit/audit-context.js";
import { logger } from "../../common/logger/logger.js";
import { ApiResponse } from "../../common/responses/api-response.js";
import {
  getComplianceSection,
  updateComplianceManagerSectionData,
  updateComplianceSectionData,
} from "./compliance.service.js";

const getApplicantComplianceSection = async (req, res) => {
  const { applicationId, sectionId } = req.params;

  const auditContext = createAuditContext(req);

  const complianceSection = await getComplianceSection(
    applicationId,
    sectionId,
    auditContext,
  );

  return ApiResponse.success(
    res,
    complianceSection,
    "Application compliance section retrieved successfully.",
  );
};

const updateApplicantComplianceSection = async (req, res) => {
  const { applicationId, sectionId } = req.params;
  const auditContext = createAuditContext(req);

  const complianceSection = await updateComplianceSectionData(
    applicationId,
    sectionId,
    req.body,
    auditContext,
  );

  return ApiResponse.success(
    res,
    complianceSection,
    "Application compliance section updated successfully.",
  );
};
const updateManagerComplianceSection = async (req, res) => {
  const { applicationId, sectionId } = req.params;
  const auditContext = createAuditContext(req);

  const complianceSection = await updateComplianceManagerSectionData(
    applicationId,
    sectionId,
    req.body,
    auditContext,
  );

  return ApiResponse.success(
    res,
    complianceSection,
    "Application compliance section updated successfully.",
  );
};
export const recruitmentComplianceSectionController = {
  getApplicantComplianceSection,
  updateApplicantComplianceSection,
  updateManagerComplianceSection,
};
