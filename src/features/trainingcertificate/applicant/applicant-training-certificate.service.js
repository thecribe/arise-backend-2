/**
 * -----------------------------------------------------------------------------
 * File: service.js
 *
 * Description:
 * Business logic for applicant training certificates.
 * -----------------------------------------------------------------------------
 */

import { AUDIT_ACTIONS } from "../../../common/constants/audit-actions.js";
import { AUDIT_ENTITY_TYPES } from "../../../common/constants/audit-entity-types.js";
import { NotFoundError } from "../../../common/errors/not-found-error.js";
import { sequelize } from "../../../config/database.js";
import { recordAuditAction } from "../../audit/record-audit-action.js";
import { recruitmentRepository } from "../../recruitment/recruitment.repository.js";
import { trainingCertificateRepository } from "../trainingcertificate.repository.js";
import { applicantTainingCertificateRepository } from "./applicant-training-certificate.respository.js";

/**
 * Retrieve all training certificates for an application.
 */
const getTrainingCertificates = async (applicationId) => {
  const mandatoryCertificates = await trainingCertificateRepository.findAll();

  if (!mandatoryCertificates) {
    throw new NotFoundError("Training certificate not found.");
  }
  const applicantCertificate =
    await applicantTainingCertificateRepository.findByApplicationId(
      applicationId,
    );

  return {
    requirements: mandatoryCertificates,
    certificates: applicantCertificate.map((certificate) => ({
      id: certificate.id,
      applicationId: certificate.application_id,
      requirementId: certificate.requirement_id,

      certificateName: certificate.certificate_name,
      certificateNumber: certificate.certificate_number,

      issueDate: certificate.issue_date,
      expiryDate: certificate.expiry_date ? certificate.expiry_date : null,

      document: certificate.document,

      //   uploadedBy: certificate.uploaded_by,

      createdAt: certificate.createdAt,
      updatedAt: certificate.updatedAt,
    })),
  };
};

/**
 * Retrieve a single training certificate.
 */
const getTrainingCertificateById = async (applicationId, certificateId) => {
  const certificate =
    await applicantTainingCertificateRepository.findByApplicationIdAndId(
      applicationId,
      certificateId,
    );

  if (!certificate) {
    throw new NotFoundError("Training certificate not found.");
  }

  return certificate;
};

/**
 * Create a training certificate.
 */
const createTrainingCertificate = async (
  applicationId,
  data,
  uploadedBy,
  auditContext,
) => {
  return sequelize.transaction(async (transaction) => {
    const certificate = await applicantTainingCertificateRepository.create(
      {
        application_id: applicationId,
        requirement_id: data.requirementId ?? null,
        certificate_name: data.certificateName,
        certificate_number: data.certificateNumber ?? null,
        issue_date: data.issueDate ?? null,
        expiry_date: data.expiryDate ?? null,
        document: data.document ?? null,
        uploaded_by: uploadedBy ?? null,
      },
      { transaction },
    );

    await recordAuditAction({
      auditContext,
      action: AUDIT_ACTIONS.TRAINING_CERTIFICATE_CREATED,
      entityType: AUDIT_ENTITY_TYPES.TRAINING_CERTIFICATE,
      entityId: certificate.id,
      applicationId,
      previousData: null,
      newData: {
        requirementId: certificate.requirement_id,
        certificateName: certificate.certificate_name,
        certificateNumber: certificate.certificate_number,
        issueDate: certificate.issue_date,
        expiryDate: certificate.expiry_date,
        uploadedBy: certificate.uploaded_by,
      },
      metadata: {
        feature: "training-certificates",
        operation: "create",
      },
      options: { transaction },
    });

    return certificate;
  });
};

/**
 * Update a training certificate.
 */
const updateTrainingCertificate = async (
  applicationId,
  certificateId,
  data,
  auditContext,
) => {
  return sequelize.transaction(async (transaction) => {
    const certificate =
      await applicantTainingCertificateRepository.findByApplicationIdAndId(
        applicationId,
        certificateId,
        { transaction },
      );

    if (!certificate) {
      throw new NotFoundError("Training certificate not found.");
    }

    const previousData = {
      requirementId: certificate.requirement_id,
      certificateName: certificate.certificate_name,
      certificateNumber: certificate.certificate_number,
      issueDate: certificate.issue_date,
      expiryDate: certificate.expiry_date,
      uploadedBy: certificate.uploaded_by,
    };

    const updateData = {};

    if (data.certificateName !== undefined) {
      updateData.certificate_name = data.certificateName;
    }

    if (data.certificateNumber !== undefined) {
      updateData.certificate_number = data.certificateNumber;
    }

    if (data.issueDate !== undefined) {
      updateData.issue_date = data.issueDate;
    }

    if (data.expiryDate !== undefined) {
      updateData.expiry_date = data.expiryDate;
    }

    if (data.document !== undefined) {
      updateData.document = data.document;
    }

    await applicantTainingCertificateRepository.update(
      certificate,
      updateData,
      {
        transaction,
      },
    );

    const newData = {
      requirementId: certificate.requirement_id,
      certificateName: certificate.certificate_name,
      certificateNumber: certificate.certificate_number,
      issueDate: certificate.issue_date,
      expiryDate: certificate.expiry_date,
      uploadedBy: certificate.uploaded_by,
    };

    await recordAuditAction({
      auditContext,
      action: AUDIT_ACTIONS.TRAINING_CERTIFICATE_UPDATED,
      entityType: AUDIT_ENTITY_TYPES.TRAINING_CERTIFICATE,
      entityId: certificate.id,
      applicationId,
      previousData,
      newData,
      metadata: {
        feature: "training-certificates",
        operation: "update",
      },
      options: { transaction },
    });

    return certificate;
  });
};

/**
 * Delete a training certificate.
 */
const deleteTrainingCertificate = async (
  applicationId,
  certificateId,
  auditContext,
) => {
  return sequelize.transaction(async (transaction) => {
    const certificate =
      await applicantTainingCertificateRepository.findByApplicationIdAndId(
        applicationId,
        certificateId,
        { transaction },
      );

    if (!certificate) {
      throw new NotFoundError("Training certificate not found.");
    }

    const previousData = {
      requirementId: certificate.requirement_id,
      certificateName: certificate.certificate_name,
      certificateNumber: certificate.certificate_number,
      issueDate: certificate.issue_date,
      expiryDate: certificate.expiry_date,
      uploadedBy: certificate.uploaded_by,
    };

    await applicantTainingCertificateRepository.destroy(certificate, {
      transaction,
    });

    await recordAuditAction({
      auditContext,
      action: AUDIT_ACTIONS.TRAINING_CERTIFICATE_DELETED,
      entityType: AUDIT_ENTITY_TYPES.TRAINING_CERTIFICATE,
      entityId: certificate.id,
      applicationId,
      previousData,
      newData: null,
      metadata: {
        feature: "training-certificates",
        operation: "delete",
      },
      options: { transaction },
    });

    return null;
  });
};

//TRAINING COMMENT

/**
 * -----------------------------------------------------------------------------
 * File: service.js
 *
 * Description:
 * Business logic for Training Certificate section comments.
 * -----------------------------------------------------------------------------
 */

/**
 * Retrieve comments for an application section.
 */
const getComments = async (applicationId, sectionId) => {
  const details =
    await applicantTainingCertificateRepository.findCommentByApplicationIdAndSectionId(
      applicationId,
      sectionId,
    );
  const allcomments = details.map((comment) => {
    const data = comment.get({ plain: true });

    return {
      id: data.id,
      comment: data.comment,
      application_id: data.application_id,
      section_id: data.section_id,
      createdBy: {
        id: data.creator?.id,
        name: [data.creator?.first_name, data.creator?.last_name]
          .filter(Boolean)
          .join(" "),
      },
      createdAt: data.createdAt,
    };
  });

  return allcomments;
};

/**
 * Create a section review comment.
 */
const createComment = async (
  applicationId,
  sectionId,
  data,
  createdBy,
  auditContext,
) => {
  return sequelize.transaction(async (transaction) => {
    const comment = await applicantTainingCertificateRepository.createComment(
      {
        application_id: applicationId,
        section_id: sectionId,
        comment: data.comment,
        created_by: createdBy,
      },
      { transaction },
    );

    await recordAuditAction({
      auditContext,
      action: AUDIT_ACTIONS.SECTION_REVIEW_COMMENT_CREATED,
      entityType: AUDIT_ENTITY_TYPES.APPLICATION_SECTION,
      entityId: comment.id,
      applicationId,
      previousData: null,
      newData: {
        sectionId: comment.section_id,
        comment: comment.comment,
        createdBy: comment.created_by,
      },
      metadata: {
        feature: "training-certificates",
        operation: "comment-create",
      },
      options: { transaction },
    });

    return comment;
  });
};

/**
 * Update a section review comment.
 */
const updateComment = async (
  applicationId,
  sectionId,
  commentId,
  data,
  auditContext,
) => {
  return sequelize.transaction(async (transaction) => {
    const comment =
      await applicantTainingCertificateRepository.findCommentByApplicationIdAndSectionIdAndId(
        applicationId,
        sectionId,
        commentId,
        { transaction },
      );

    if (!comment) {
      throw new NotFoundError("Section review comment not found.");
    }

    const previousData = {
      sectionId: comment.section_id,
      comment: comment.comment,
      createdBy: comment.created_by,
    };

    await applicantTainingCertificateRepository.updateComment(
      comment,
      {
        comment: data.comment,
      },
      { transaction },
    );

    const newData = {
      sectionId: comment.section_id,
      comment: comment.comment,
      createdBy: comment.created_by,
    };

    await recordAuditAction({
      auditContext,
      action: AUDIT_ACTIONS.SECTION_REVIEW_COMMENT_UPDATED,
      entityType: AUDIT_ENTITY_TYPES.APPLICATION_SECTION,
      entityId: comment.id,
      applicationId,
      previousData,
      newData,
      metadata: {
        feature: "training-certificates",
        operation: "comment-update",
      },
      options: { transaction },
    });

    return comment;
  });
};

/**
 * Delete a section review comment.
 */
const deleteComment = async (
  applicationId,
  sectionId,
  commentId,
  auditContext,
) => {
  return sequelize.transaction(async (transaction) => {
    const comment =
      await applicantTainingCertificateRepository.findCommentByApplicationIdAndSectionIdAndId(
        applicationId,
        sectionId,
        commentId,
        { transaction },
      );

    if (!comment) {
      throw new NotFoundError("Section review comment not found.");
    }

    const previousData = {
      sectionId: comment.section_id,
      comment: comment.comment,
      createdBy: comment.created_by,
    };

    await applicantTainingCertificateRepository.destroyComment(comment, {
      transaction,
    });

    await recordAuditAction({
      auditContext,
      action: AUDIT_ACTIONS.SECTION_REVIEW_COMMENT_DELETED,
      entityType: AUDIT_ENTITY_TYPES.APPLICATION_SECTION,
      entityId: comment.id,
      applicationId,
      previousData,
      newData: null,
      metadata: {
        feature: "training-certificates",
        operation: "comment-delete",
      },
      options: { transaction },
    });

    return null;
  });
};

/**
 * -----------------------------------------------------------------------------
 * File: service.js
 *
 * Description:
 * Business logic for Training Certificate section status.
 * -----------------------------------------------------------------------------
 */

const VALID_STATUSES = [
  "locked",
  "in_progress",
  "submitted",
  "rejected",
  "approved",
];

/**
 * Retrieve the section status.
 */
const getSectionStatus = async (applicationId, sectionId) => {
  const section = await recruitmentRepository.findApplicationSection({
    applicationId,
    sectionId,
  });

  if (!section) {
    throw new NotFoundError(
      "Training Certificate application section not found.",
    );
  }

  return { status: section.status };
};

/**
 * Update the section status.
 */
const updateSectionStatus = async (
  applicationId,
  sectionId,
  status,
  auditContext,
) => {
  if (!VALID_STATUSES.includes(status)) {
    throw new Error("Invalid application section status.");
  }

  return sequelize.transaction(async (transaction) => {
    const section = await recruitmentRepository.findApplicationSection({
      applicationId,
      sectionId,
      transaction,
    });

    if (!section) {
      throw new NotFoundError(
        "Training Certificate application section not found.",
      );
    }

    const previousData = {
      status: section.status,
      recruiterComment: section.recruiter_comment,
      submittedAt: section.submitted_at,
      approvedAt: section.approved_at,
    };

    const updateData = {
      status,
    };

    if (status === "submitted") {
      updateData.submitted_at = new Date();
    }

    if (status === "approved") {
      updateData.approved_at = new Date();
    }

    if (status === "rejected") {
      updateData.approved_at = null;
    }

    if (status !== "approved" && status !== "submitted") {
      updateData.approved_at = null;
    }

    await applicantTainingCertificateRepository.updateCertificateStatus(
      section,
      updateData,
      {
        transaction,
      },
    );

    const newData = {
      status: section.status,
      recruiterComment: section.recruiter_comment,
      submittedAt: section.submitted_at,
      approvedAt: section.approved_at,
    };

    await recordAuditAction({
      auditContext,
      action:
        status === "approved"
          ? AUDIT_ACTIONS.APPLICATION_SECTION_APPROVED
          : status === "rejected"
            ? AUDIT_ACTIONS.APPLICATION_SECTION_REJECTED
            : AUDIT_ACTIONS.APPLICATION_SECTION_STATUS_UPDATED,
      entityType: AUDIT_ENTITY_TYPES.APPLICATION_SECTION,
      entityId: section.id,
      applicationId,
      previousData,
      newData,
      metadata: {
        feature: "training-certificates",
        operation: "section-status-update",
        sectionId,
      },
      options: { transaction },
    });

    return section;
  });
};

export default {
  getTrainingCertificates,
  getTrainingCertificateById,
  createTrainingCertificate,
  updateTrainingCertificate,
  deleteTrainingCertificate,

  //COMMENT
  getComments,
  createComment,
  updateComment,
  deleteComment,

  //UPDATE CERTIFICATE STATUS
  getSectionStatus,
  updateSectionStatus,
};
