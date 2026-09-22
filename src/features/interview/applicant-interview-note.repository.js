import { ApplicantInterviewNote } from "../../database/models/ApplicantInterviewNote.js";

/**
 * --------------------------------------------------------------------------
 * Find All Notes By Interview ID
 * --------------------------------------------------------------------------
 */
const findNotesByInterviewId = async (interviewId, options = {}) => {
  return ApplicantInterviewNote.findAll({
    ...options,
    where: {
      interview_id: interviewId,
    },
    order: [["created_at", "ASC"]],
  });
};

/**
 * --------------------------------------------------------------------------
 * Find Note By ID
 * --------------------------------------------------------------------------
 */
const findNoteById = async (noteId, options = {}) => {
  return ApplicantInterviewNote.findByPk(noteId, options);
};

/**
 * --------------------------------------------------------------------------
 * Create Note
 * --------------------------------------------------------------------------
 */
const createNote = async (data, options = {}) => {
  return ApplicantInterviewNote.create(
    {
      interview_id: data.interviewId,
      content: data.content,
      created_by: data.createdBy,
    },
    options,
  );
};

/**
 * --------------------------------------------------------------------------
 * Update Note
 * --------------------------------------------------------------------------
 */
const updateNote = async (note, data, options = {}) => {
  await note.update(
    {
      ...(data.content !== undefined && {
        content: data.content,
      }),
    },
    options,
  );

  return note;
};

/**
 * --------------------------------------------------------------------------
 * Delete Note
 * --------------------------------------------------------------------------
 */
const deleteNote = async (note, options = {}) => {
  return note.destroy(options);
};

const interviewNoteRepository = {
  findNotesByInterviewId,
  findNoteById,
  createNote,
  updateNote,
  deleteNote,
};

export default interviewNoteRepository;
