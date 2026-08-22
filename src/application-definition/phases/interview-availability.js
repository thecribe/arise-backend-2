import {
  FIELD_TYPES,
  FIELD_WIDTH,
  PHASE_IDS,
  SECTION_IDS,
} from "../constants.js";

const interviewAvailabiltyInformation = {
  id: PHASE_IDS.INTERVIEW_AVAILABILITY,

  title: "Interview availability",

  description: "This information will be used to schedule your interview.",

  order: 3,
  sections: [
    {
      id: SECTION_IDS.INTERVIEW_AVAILABILITY,

      phaseId: PHASE_IDS.INTERVIEW_AVAILABILITY,

      title: "Interview availability",

      description: "Provide details about your availability.",

      order: 1,

      repeatable: false,

      fields: [
        {
          id: "interview-availability-preferred-date",
          name: "preferredInterviewDate",
          label: "Preferred Interview Date",
          type: FIELD_TYPES.DATE,
          required: true,
          width: FIELD_WIDTH.HALF,
          order: 1,
        },

        {
          id: "interview-availability-preferred-time",
          name: "preferredInterviewTime",
          label: "Preferred Interview Time",
          type: FIELD_TYPES.TIME,
          required: true,
          width: FIELD_WIDTH.HALF,
          order: 2,
        },

        {
          id: "interview-availability-alternative-date",
          name: "alternativeInterviewDate",
          label: "Alternative Interview Date",
          type: FIELD_TYPES.DATE,
          required: false,
          width: FIELD_WIDTH.HALF,
          order: 3,
        },

        {
          id: "interview-availability-alternative-time",
          name: "alternativeInterviewTime",
          label: "Alternative Interview Time",
          type: FIELD_TYPES.TIME,
          required: false,
          width: FIELD_WIDTH.HALF,
          order: 4,
        },

        {
          id: "interview-availability-flexibility",
          name: "interviewAvailabilityFlexibility",
          label: "How flexible are you with the interview time?",
          type: FIELD_TYPES.SELECT,
          placeholder: "Select your availability",
          required: true,
          width: FIELD_WIDTH.FULL,
          order: 5,
          options: [
            {
              label: "Very flexible",
              value: "very-flexible",
            },
            {
              label: "Somewhat flexible",
              value: "somewhat-flexible",
            },
            {
              label: "Not very flexible",
              value: "not-very-flexible",
            },
          ],
        },

        {
          id: "interview-availability-method",
          name: "preferredInterviewMethod",
          label: "Preferred Interview Method",
          type: FIELD_TYPES.CHECKBOX,
          placeholder: "Select interview method",
          required: true,
          width: FIELD_WIDTH.HALF,
          order: 6,
          options: [
            {
              label: "Video call",
              value: "video",
            },
            {
              label: "Telephone",
              value: "telephone",
            },
            {
              label: "In person",
              value: "in-person",
            },
          ],
        },

        {
          id: "interview-availability-notes",
          name: "interviewAvailabilityNotes",
          label: "Additional Availability Information",
          type: FIELD_TYPES.TEXTAREA,
          placeholder:
            "Please let us know anything else about your availability that may help us arrange your interview.",
          required: false,
          width: FIELD_WIDTH.FULL,
          order: 7,
          rows: 4,
        },
      ],
    },
  ],
};

export default interviewAvailabiltyInformation;
