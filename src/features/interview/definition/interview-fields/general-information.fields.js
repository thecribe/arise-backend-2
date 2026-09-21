import {
  FIELD_TYPES,
  FIELD_WIDTH,
} from "../../../../application-definition/constants.js";

export const generalInformationField = [
  {
    id: "candidate-name",
    type: FIELD_TYPES.TEXT,
    name: "candidateName",
    label: "Candidate Name",
    placeholder: "Enter candidate name",
    required: true,
    readOnly: true,
    order: 1,
    width: FIELD_WIDTH.HALF,
  },

  {
    id: "interview-date",
    type: FIELD_TYPES.DATE,
    name: "interviewDate",
    label: "Interview Date",
    required: true,
    order: 2,
    width: FIELD_WIDTH.HALF,
  },

  {
    id: "interviewer-name",
    type: FIELD_TYPES.TEXT,
    name: "interviewerName",
    label: "Interviewer Name",
    placeholder: "Enter interviewer name",
    required: true,
    readOnly: true,
    order: 3,
    width: FIELD_WIDTH.HALF,
  },

  {
    id: "interview-notes",
    type: FIELD_TYPES.TEXTAREA,
    name: "interviewNotes",
    label: "Interview Notes",
    placeholder: "Enter general interview notes",
    required: false,
    rows: 5,
    order: 4,
    width: FIELD_WIDTH.FULL,
  },

  {
    id: "interviewer-signature",
    type: FIELD_TYPES.SIGNATURE,
    name: "interviewerSignature",
    label: "Interviewer Signature",
    required: true,
    order: 5,
    width: FIELD_WIDTH.FULL,
  },
];
