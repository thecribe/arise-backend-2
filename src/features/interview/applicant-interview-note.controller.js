import { createAuditContext } from "../../common/audit/audit-context.js";
import { ApiResponse } from "../../common/responses/api-response.js";
import interviewNoteService from "./applicant-interview-note.service.js";

/**
 * --------------------------------------------------------------------------
 * Get Notes By Interview ID
 * --------------------------------------------------------------------------
 */
const getNotesByInterviewId = async (req, res, next) => {
  try {
    const { interviewId } = req.params;

    const notes = await interviewNoteService.getNotesByInterviewId(interviewId);

    return ApiResponse.success(
      res,
      notes,
      "Interview notes retrieved successfully.",
    );
  } catch (error) {
    next(error);
  }
};

/**
 * --------------------------------------------------------------------------
 * Create Note
 * --------------------------------------------------------------------------
 */
const createNote = async (req, res, next) => {
  try {
    const { interviewId } = req.params;
    const createdBy = req.user.id;

    const auditContext = createAuditContext(req);

    const note = await interviewNoteService.createNote(
      interviewId,
      createdBy,
      req.body,
      auditContext,
    );

    return ApiResponse.success(
      res,
      note,
      "Interview note created successfully.",
    );
  } catch (error) {
    next(error);
  }
};

/**
 * --------------------------------------------------------------------------
 * Update Note
 * --------------------------------------------------------------------------
 */
const updateNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const auditContext = createAuditContext(req);

    const note = await interviewNoteService.updateNote(
      noteId,
      req.body,
      auditContext,
    );

    return ApiResponse.success(
      res,
      note,
      "Interview note updated successfully.",
    );
  } catch (error) {
    next(error);
  }
};

/**
 * --------------------------------------------------------------------------
 * Delete Note
 * --------------------------------------------------------------------------
 */
const deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const auditContext = createAuditContext(req);

    const result = await interviewNoteService.deleteNote(noteId, auditContext);

    return ApiResponse.success(
      res,
      result,
      "Interview note deleted successfully.",
    );
  } catch (error) {
    next(error);
  }
};

const interviewNoteController = {
  getNotesByInterviewId,
  createNote,
  updateNote,
  deleteNote,
};

export default interviewNoteController;
