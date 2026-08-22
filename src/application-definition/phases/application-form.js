import {
  FIELD_TYPES,
  FIELD_WIDTH,
  PHASE_IDS,
  SECTION_IDS,
} from "../constants.js";

const applicationForm = {
  id: PHASE_IDS.APPLICATION_FORM,
  title: "Application Form",
  description: "Provide the information to start your application",
  order: 1,
  sections: [
    {
      id: SECTION_IDS.PERSONAL_INFORMATION,
      phaseId: PHASE_IDS.APPLICATION_FORM,
      title: "Personal Information",
      description: "Provide your personal Information",
      order: 1,
      repeatable: false,
      fields: [
        {
          id: "personal-information-title",
          name: "title",
          label: "Title",
          type: FIELD_TYPES.SELECT,
          placeholder: "Select a title",
          required: false,
          width: FIELD_WIDTH.FULL,
          order: 1,
          options: [
            { label: "Mr.", value: "mr" },
            {
              label: "Ms.",
              value: "ms",
            },
            { label: "Mrs.", value: "mrs" },
          ],
        },
        {
          id: "personal-information-first-name",
          name: "firstName",

          label: "First Name",

          type: FIELD_TYPES.TEXT,

          placeholder: "Enter your first name",

          required: true,

          width: FIELD_WIDTH.HALF,

          order: 2,
        },
        {
          id: "personal-information-last-name",

          name: "lastName",

          label: "Last Name",

          type: FIELD_TYPES.TEXT,

          placeholder: "Enter your last name",

          required: true,

          width: FIELD_WIDTH.HALF,

          order: 3,
        },
        {
          id: "personal-information-right-to-work",
          name: "rightToWork",
          label: "Do you have the right to work in the UK?",
          type: FIELD_TYPES.RADIO,
          required: true,
          width: FIELD_WIDTH.HALF,
          order: 4,
          options: [
            {
              label: "Yes",
              value: true,
            },
            {
              label: "No",
              value: false,
            },
          ],
        },
        {
          id: "personal-information-require-sponsorship",
          name: "requiresSponsorship",
          label:
            "Will you require sponsorship now or in the future to work in the UK?",
          type: FIELD_TYPES.RADIO,
          required: true,
          width: FIELD_WIDTH.HALF,
          order: 5,
          options: [
            {
              label: "Yes",
              value: true,
            },
            {
              label: "No",
              value: false,
            },
          ],
        },

        {
          id: "personal-information-uk-driving-licence",
          name: "hasUkDrivingLicence",
          label: "Do you hold a full, valid UK driving licence?",
          type: FIELD_TYPES.RADIO,
          required: true,
          width: FIELD_WIDTH.HALF,
          order: 6,
          options: [
            {
              label: "Yes",
              value: true,
            },
            {
              label: "No",
              value: false,
            },
          ],
        },

        {
          id: "personal-information-has-car",
          name: "hasCar",
          label: "Do you have a car?",
          type: FIELD_TYPES.RADIO,
          required: true,
          width: FIELD_WIDTH.HALF,
          order: 7,
          options: [
            {
              label: "Yes",
              value: true,
            },
            {
              label: "No",
              value: false,
            },
          ],
        },
      ],
    },
    {
      id: SECTION_IDS.ADDRESS_CONTACT_INFORMATION,
      phaseId: PHASE_IDS.APPLICATION_FORM,
      title: "Address / contact details",
      description: "Provide your address and contact Information",
      order: 2,
      repeatable: false,
      fields: [
        {
          id: "address-contact-information-current-address",
          name: "currentAddress",
          label: "Current Address",
          type: FIELD_TYPES.TEXTAREA,
          placeholder: "Enter your current address",
          required: true,
          width: FIELD_WIDTH.FULL,
          order: 1,
        },

        {
          id: "address-contact-information-postcode",
          name: "postcode",
          label: "Postcode",
          type: FIELD_TYPES.TEXT,
          placeholder: "Enter your postcode",
          required: true,
          width: FIELD_WIDTH.HALF,
          order: 2,
        },

        {
          id: "address-contact-information-mobile-number",
          name: "mobileNumber",
          label: "Mobile Number",
          type: FIELD_TYPES.PHONE,
          placeholder: "Enter your mobile number",
          required: true,
          width: FIELD_WIDTH.HALF,
          order: 3,
        },

        {
          id: "address-contact-information-email-address",
          name: "emailAddress",
          label: "Email Address",
          type: FIELD_TYPES.EMAIL,
          placeholder: "Enter your email address",
          required: true,
          width: FIELD_WIDTH.HALF,
          order: 4,
        },
      ],
    },
    {
      id: SECTION_IDS.EMPLOYMENT_HISTORY,
      phaseId: PHASE_IDS.APPLICATION_FORM,
      title: "Employment History",
      description: "Provide your employment history",
      order: 3,
      repeatable: true,
      minItems: 1,
      maxItems: 5,
      fields: [
        {
          id: "employment-history-title",
          name: "title",
          label: "Job Title",
          type: FIELD_TYPES.TEXT,
          placeholder: "Enter your job title",
          required: true,
          width: FIELD_WIDTH.HALF,
          order: 1,
        },

        {
          id: "employment-history-place-of-work",
          name: "placeOfWork",
          label: "Place of Work",
          type: FIELD_TYPES.TEXT,
          placeholder: "Enter your place of work",
          required: true,
          width: FIELD_WIDTH.HALF,
          order: 2,
        },

        {
          id: "employment-history-pay",
          name: "pay",
          label: "Pay",
          type: FIELD_TYPES.TEXT,
          placeholder: "Enter your pay",
          required: true,
          width: FIELD_WIDTH.HALF,
          order: 3,
        },
        {
          id: "employment-history-status",
          name: "status",
          label: "Employment Status",
          type: FIELD_TYPES.SELECT,
          placeholder: "Select employment status",
          required: true,
          width: FIELD_WIDTH.HALF,
          order: 5,
          options: [
            {
              label: "Current",
              value: "current",
            },
            {
              label: "Previous",
              value: "previous",
            },
          ],
        },

        {
          id: "employment-history-duties",
          name: "duties",
          label: "Duties",
          type: FIELD_TYPES.TEXTAREA,
          placeholder: "Describe your duties",
          required: true,
          width: FIELD_WIDTH.FULL,
          order: 4,
        },
      ],
    },
    {
      id: SECTION_IDS.EDUCATIONAL_HISTORY,
      phaseId: PHASE_IDS.APPLICATION_FORM,
      title: "Educational Qualification",
      description: "Provide your educational qualification",
      order: 4,
      repeatable: true,
      minItems: 1,
      maxItems: 5,
      fields: [
        {
          id: "education-history-establishment",
          name: "establishment",
          label: "Establishment",
          type: FIELD_TYPES.TEXT,
          placeholder: "Enter the name of the establishment",
          required: true,
          width: FIELD_WIDTH.FULL,
          order: 1,
        },

        {
          id: "education-history-from",
          name: "from",
          label: "From",
          type: FIELD_TYPES.DATE,
          required: true,
          width: FIELD_WIDTH.HALF,
          order: 2,
        },

        {
          id: "education-history-to",
          name: "to",
          label: "To",
          type: FIELD_TYPES.DATE,
          required: true,
          width: FIELD_WIDTH.HALF,
          order: 3,
        },

        {
          id: "education-history-qualification",
          name: "qualification",
          label: "Qualification",
          type: FIELD_TYPES.TEXT,
          placeholder: "Enter your qualification",
          required: true,
          width: FIELD_WIDTH.HALF,
          order: 4,
        },

        {
          id: "education-history-grade",
          name: "grade",
          label: "Grade",
          type: FIELD_TYPES.TEXT,
          placeholder: "Enter your grade",
          required: true,
          width: FIELD_WIDTH.HALF,
          order: 5,
        },

        {
          id: "education-history-certificate",
          name: "certificate",
          label: "Upload Certificate",
          type: FIELD_TYPES.UPLOAD,
          required: true,
          file: { multiple: true },
          width: FIELD_WIDTH.FULL,
          order: 6,
        },
      ],
    },
    {
      id: SECTION_IDS.UPLOAD_CV,
      phaseId: PHASE_IDS.APPLICATION_FORM,
      title: "Upload your Resume",
      description: "Provide your up to date resume",
      order: 5,
      repeatable: false,
      fields: [
        {
          id: "upload-cv-resume",
          name: "resume",
          label: "Upload Resume",
          type: FIELD_TYPES.UPLOAD,
          required: true,
          file: { multiple: true },
          width: FIELD_WIDTH.FULL,
          order: 1,
        },
      ],
    },
  ],
};

export default applicationForm;
