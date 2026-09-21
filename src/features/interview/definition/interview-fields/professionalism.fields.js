import {
  FIELD_TYPES,
  FIELD_WIDTH,
} from "../../../../application-definition/constants.js";

export const professionalismFields = [
  {
    id: "time-management-awareness",
    type: FIELD_TYPES.NUMBER,
    name: "timeManagementAwareness",
    label: "Time Management Awareness",
    placeholder: "Score from 0 to 5",
    required: true,
    min: 0,
    max: 5,
    step: 1,
    helpText:
      "Understands the importance of punctuality and task prioritization.",
    order: 1,
    width: FIELD_WIDTH.FULL,
  },

  {
    id: "attitude-willingness-to-learn",
    type: FIELD_TYPES.NUMBER,
    name: "attitudeWillingnessToLearn",
    label: "Attitude & Willingness to Learn",
    placeholder: "Score from 0 to 5",
    required: true,
    min: 0,
    max: 5,
    step: 1,
    helpText: "Displays eagerness to develop skills.",
    order: 2,
    width: FIELD_WIDTH.FULL,
  },

  {
    id: "adaptability",
    type: FIELD_TYPES.NUMBER,
    name: "adaptability",
    label: "Adaptability",
    placeholder: "Score from 0 to 5",
    required: true,
    min: 0,
    max: 5,
    step: 1,
    helpText: "Demonstrates flexibility with tasks or schedule changes.",
    order: 3,
    width: FIELD_WIDTH.FULL,
  },
];
