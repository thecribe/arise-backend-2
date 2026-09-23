import { AUDIT_ACTIONS } from "../../../common/constants/audit-actions.js";
import { AUDIT_ENTITY_TYPES } from "../../../common/constants/audit-entity-types.js";
import { BadRequestError } from "../../../common/errors/bad-request-error.js";
import { NotFoundError } from "../../../common/errors/not-found-error.js";

import { sequelize } from "../../../config/database.js";

import { ApplicantApplication } from "../../../database/models/ApplicantApplication.js";

import { recordAuditAction } from "../../audit/record-audit-action.js";

import { applicantDocumentRepository } from "./applicant-document.repository.js";

const normalizeDocuments = (documents) => {
  if (!documents) {
    return [];
  }

  return Array.isArray(documents) ? documents : [documents];
};

const validateDocument = (document) => {
  if (!document || typeof document !== "object") {
    throw new BadRequestError("Invalid document.");
  }

  if (!document.document_url) {
    throw new BadRequestError("Document URL is required.");
  }

  if (!document.name) {
    throw new BadRequestError("Document name is required.");
  }

  return document;
};

const getApplicantDocuments = async (applicationId) => {
  if (!applicationId) {
    throw new BadRequestError("Application ID is required.");
  }

  const application = await ApplicantApplication.findByPk(applicationId);

  if (!application) {
    throw new NotFoundError("Application not found.");
  }

  return applicantDocumentRepository.findByApplicationId(applicationId);
};

const uploadApplicantDocuments = async (
  applicationId,
  documents,
  auditContext = {},
) => {
  if (!applicationId) {
    throw new BadRequestError("Application ID is required.");
  }

  const transaction = await sequelize.transaction();

  try {
    const application = await ApplicantApplication.findByPk(applicationId, {
      transaction,
    });

    if (!application) {
      throw new NotFoundError("Application not found.");
    }

    const normalizedDocuments = normalizeDocuments(documents);

    if (normalizedDocuments.length === 0) {
      throw new BadRequestError("At least one document is required.");
    }

    const validatedDocuments = normalizedDocuments.map(validateDocument);

    const documentData = validatedDocuments.map((document) => ({
      application_id: applicationId,
      name: document.name,
      document_url: document.document_url,
      mime_type: document.mimetype ?? null,
      size: document.size ?? null,
    }));

    const createdDocuments = await applicantDocumentRepository.createMany(
      documentData,
      { transaction },
    );

    await recordAuditAction({
      ...auditContext,
      action: AUDIT_ACTIONS.APPLICANT_DOCUMENT_UPLOADED,
      entityType: AUDIT_ENTITY_TYPES.APPLICANT_DOCUMENT,
      entityId:
        createdDocuments.length === 1 ? createdDocuments[0].id : applicationId,
      metadata: {
        applicationId,
        documentIds: createdDocuments.map((document) => document.id),
        documents: createdDocuments.map((document) => ({
          id: document.id,
          name: document.name,
          mimeType: document.mime_type,
          size: document.size,
        })),
      },
      transaction,
    });

    await transaction.commit();

    return createdDocuments;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const deleteApplicantDocument = async (
  applicationId,
  documentId,
  auditContext = {},
) => {
  if (!applicationId) {
    throw new BadRequestError("Application ID is required.");
  }

  if (!documentId) {
    throw new BadRequestError("Document ID is required.");
  }

  const transaction = await sequelize.transaction();

  try {
    const document = await applicantDocumentRepository.findByIdAndApplicationId(
      documentId,
      applicationId,
      { transaction },
    );

    if (!document) {
      throw new NotFoundError("Applicant document not found.");
    }

    await document.destroy({ transaction });

    await recordAuditAction({
      ...auditContext,
      action: AUDIT_ACTIONS.APPLICANT_DOCUMENT_DELETED,
      entityType: AUDIT_ENTITY_TYPES.APPLICANT_DOCUMENT,
      entityId: document.id,
      metadata: {
        applicationId,
        documentId: document.id,
        name: document.name,
        documentUrl: document.document_url,
        mimeType: document.mime_type,
        size: document.size,
      },
      transaction,
    });

    await transaction.commit();

    return document;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const applicantDocumentService = {
  getApplicantDocuments,
  uploadApplicantDocuments,
  deleteApplicantDocument,
};
