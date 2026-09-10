import { createAuditContext } from "../../common/audit/audit-context.js";
import { ApiResponse } from "../../common/responses/api-response.js";
import {
  getComplianceSection,
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
    "Application status updated successfully.",
  );
};

const updateApplicantComplianceSection = async (req, res) => {
  const { applicationId, sectionId } = req.params;
  const auditContext = createAuditContext(req);

  console.log({ body: req.body });
  const complianceSection = await updateComplianceSectionData(
    applicationId,
    sectionId,
    req.body,
    auditContext,
  );

  return ApiResponse.success(
    res,
    complianceSection,
    "Application status updated successfully.",
  );
};
export const recruitmentComplianceSectionController = {
  getApplicantComplianceSection,
  updateApplicantComplianceSection,
};
