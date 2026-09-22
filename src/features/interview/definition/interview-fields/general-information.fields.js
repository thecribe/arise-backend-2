import {
  FIELD_TYPES,
  FIELD_WIDTH,
} from "../../../../application-definition/constants.js";

export const generalInformationField = [
  {
    id: "interview-date",
    type: FIELD_TYPES.DATE,
    name: "interviewDate",
    label: "Interview Date",
    required: true,
    order: 1,
    width: FIELD_WIDTH.HALF,
  },

  {
    id: "interviewer-name",
    type: FIELD_TYPES.TEXT,
    name: "interviewerName",
    label: "Interviewer Name",
    placeholder: "Enter interviewer name",
    required: true,
    order: 2,
    width: FIELD_WIDTH.HALF,
  },

  {
    id: "interviewer-signature",
    type: FIELD_TYPES.SIGNATURE,
    name: "interviewerSignature",
    label: "Interviewer Signature",
    required: true,
    order: 3,
    width: FIELD_WIDTH.THIRD,
  },
];
