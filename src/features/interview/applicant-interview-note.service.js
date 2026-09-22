import { AUDIT_ACTIONS } from "../../common/constants/audit-actions.js";
import { AUDIT_ENTITY_TYPES } from "../../common/constants/audit-entity-types.js";
import { BadRequestError } from "../../common/errors/bad-request-error.js";
import { NotFoundError } from "../../common/errors/not-found-error.js";
import { sanitizeRichText } from "../../common/utils/sanitize-html.js";
import { sequelize } from "../../config/database.js";
import { recordAuditAction } from "../audit/record-audit-action.js";
import interviewNoteRepository from "./applicant-interview-note.repository.js";
import { interviewRepository } from "./applicant-interview.repository.js";

/**
 * --------------------------------------------------------------------------
 * Helpers
 * --------------------------------------------------------------------------
 */

/**
 * Removes HTML tags and whitespace to determine
 * whether the note contains meaningful text.
 */
const hasMeaningfulText = (html) => {
  if (!html) {
    return false;
  }

  const plainText = html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();

  return plainText.length > 0;
};

/**
 * Sanitizes and validates rich-text note content.
 */
const getSanitizedContent = (content) => {
  const sanitizedContent = sanitizeRichText(content);

  if (!hasMeaningfulText(sanitizedContent)) {
    throw new BadRequestError("Note content is required.");
  }

  return sanitizedContent;
};

const getInterviewOrThrow = async (interviewId, transaction) => {
  const interview = await interviewRepository.findInterviewById(interviewId, {
    transaction,
  });

  if (!interview) {
    throw new NotFoundError("Interview not found.");
  }

  return interview;
};

/**
 * --------------------------------------------------------------------------
 * Get Notes By Interview ID
 * --------------------------------------------------------------------------
 */

const getNotesByInterviewId = async (interviewId) => {
  await getInterviewOrThrow(interviewId);

  return interviewNoteRepository.findNotesByInterviewId(interviewId);
};

/**
 * --------------------------------------------------------------------------
 * Create Note
 * --------------------------------------------------------------------------
 */

const createNote = async (interviewId, createdBy, data, auditContext) => {
  return sequelize.transaction(async (transaction) => {
    await getInterviewOrThrow(interviewId, transaction);

    const content = getSanitizedContent(data.content);

    const note = await interviewNoteRepository.createNote(
      {
        interviewId,
        content,
        createdBy,
      },
      {
        transaction,
      },
    );

    await recordAuditAction({
      ...auditContext,
      action: AUDIT_ACTIONS.INTERVIEW_NOTE_CREATED,
      entityType: AUDIT_ENTITY_TYPES.INTERVIEW_NOTE,
      entityId: note.id,
      metadata: {
        interviewId,
        createdBy,
      },
      transaction,
    });

    return note;
  });
};

/**
 * --------------------------------------------------------------------------
 * Update Note
 * --------------------------------------------------------------------------
 */

const updateNote = async (noteId, data, auditContext) => {
  return sequelize.transaction(async (transaction) => {
    const note = await interviewNoteRepository.findNoteById(noteId, {
      transaction,
    });

    if (!note) {
      throw new NotFoundError("Interview note not found.");
    }

    const content = getSanitizedContent(data.content);
    const previousData = note.toJSON();

    const updatedNote = await interviewNoteRepository.updateNote(
      note,
      {
        content,
      },
      {
        transaction,
      },
    );

    await recordAuditAction({
      ...auditContext,
      action: AUDIT_ACTIONS.INTERVIEW_NOTE_UPDATED,
      entityType: AUDIT_ENTITY_TYPES.INTERVIEW_NOTE,
      entityId: note.id,
      metadata: {
        interviewId: note.interview_id,
        previousData: {
          id: previousData.id,
          interview_id: previousData.interview_id,
          created_by: previousData.created_by,
          created_at: previousData.created_at,
          updated_at: previousData.updated_at,
        },
        updatedData: {
          id: updatedNote.id,
          interview_id: updatedNote.interview_id,
          created_by: updatedNote.created_by,
          created_at: updatedNote.created_at,
          updated_at: updatedNote.updated_at,
        },
      },
      transaction,
    });

    return updatedNote;
  });
};

/**
 * --------------------------------------------------------------------------
 * Delete Note
 * --------------------------------------------------------------------------
 */

const deleteNote = async (noteId, auditContext) => {
  return sequelize.transaction(async (transaction) => {
    const note = await interviewNoteRepository.findNoteById(noteId, {
      transaction,
    });

    if (!note) {
      throw new NotFoundError("Interview note not found.");
    }

    const previousData = note.toJSON();

    await interviewNoteRepository.deleteNote(note, {
      transaction,
    });

    await recordAuditAction({
      ...auditContext,
      action: AUDIT_ACTIONS.INTERVIEW_NOTE_DELETED,
      entityType: AUDIT_ENTITY_TYPES.INTERVIEW_NOTE,
      entityId: note.id,
      metadata: {
        interviewId: note.interview_id,
        deletedData: {
          id: previousData.id,
          interview_id: previousData.interview_id,
          created_by: previousData.created_by,
          created_at: previousData.created_at,
          updated_at: previousData.updated_at,
        },
      },
      transaction,
    });

    return {
      id: noteId,
      deleted: true,
    };
  });
};

const interviewNoteService = {
  getNotesByInterviewId,
  createNote,
  updateNote,
  deleteNote,
};

export default interviewNoteService;
