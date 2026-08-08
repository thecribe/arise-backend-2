import { PHASE_IDS, SECTION_IDS } from "../constants.js";
import { FIELD_TYPES, FIELD_WIDTH } from "../constants.js";


const personalInformation = {
  id: PHASE_IDS.PERSONAL_INFORMATION,

  title: "Personal Information",

  description: "Provide your personal information.",

  order: 1,

  sections: [
    {
  id: SECTION_IDS.BASIC_INFORMATION,

  phaseId: PHASE_IDS.PERSONAL_INFORMATION,

  title: "Basic Information",

  description: "Provide your basic personal details.",

  order: 1,

  repeatable: false,

  fields: [
    {
      id: "basic-information-first-name",

      name: "firstName",

      label: "First Name",

      type: FIELD_TYPES.TEXT,

      placeholder: "Enter your first name",

      required: true,

      width: FIELD_WIDTH.HALF,

      order: 1,
    },

    {
      id: "basic-information-middle-name",

      name: "middleName",

      label: "Middle Name",

      type: FIELD_TYPES.TEXT,

      placeholder: "Enter your middle name",

      width: FIELD_WIDTH.HALF,

      order: 2,
    },

    {
      id: "basic-information-last-name",

      name: "lastName",

      label: "Last Name",

      type: FIELD_TYPES.TEXT,

      placeholder: "Enter your last name",

      required: true,

      width: FIELD_WIDTH.HALF,

      order: 3,
    },

    {
      id: "basic-information-gender",

      name: "gender",

      label: "Gender",

      type: FIELD_TYPES.SELECT,

      required: true,

      width: FIELD_WIDTH.HALF,

      order: 4,

      options: [
        {
          label: "Male",
          value: "male",
        },
        {
          label: "Female",
          value: "female",
        },
        {
          label: "Prefer not to say",
          value: "prefer_not_to_say",
        },
      ],
    },

    {
      id: "basic-information-date-of-birth",

      name: "dateOfBirth",

      label: "Date of Birth",

      type: FIELD_TYPES.DATE,

      required: true,

      width: FIELD_WIDTH.HALF,

      order: 5,
    },
  ],
},

   {
  id: SECTION_IDS.EMERGENCY_CONTACTS,

  phaseId: PHASE_IDS.PERSONAL_INFORMATION,

  title: "Emergency Contacts",

  description: "Provide one or more emergency contacts.",

  order: 2,

  repeatable: true,

  minItems: 1,

  maxItems: 5,

  fields: [
    {
      id: "emergency-contact-full-name",

      name: "fullName",

      label: "Full Name",

      type: FIELD_TYPES.TEXT,

      placeholder: "Enter full name",

      required: true,

      width: FIELD_WIDTH.HALF,

      order: 1,
    },

    {
      id: "emergency-contact-relationship",

      name: "relationship",

      label: "Relationship",

      type: FIELD_TYPES.SELECT,

      required: true,

      width: FIELD_WIDTH.HALF,

      order: 2,

      options: [
        {
          label: "Parent",
          value: "parent",
        },
        {
          label: "Sibling",
          value: "sibling",
        },
        {
          label: "Spouse",
          value: "spouse",
        },
        {
          label: "Partner",
          value: "partner",
        },
        {
          label: "Friend",
          value: "friend",
        },
        {
          label: "Other",
          value: "other",
        },
      ],
    },

    {
      id: "emergency-contact-phone-number",

      name: "phoneNumber",

      label: "Phone Number",

      type: FIELD_TYPES.PHONE,

      placeholder: "Enter phone number",

      required: true,

      width: FIELD_WIDTH.HALF,

      order: 3,
    },

    {
      id: "emergency-contact-email",

      name: "email",

      label: "Email Address",

      type: FIELD_TYPES.EMAIL,

      placeholder: "Enter email address",

      width: FIELD_WIDTH.HALF,

      order: 4,
    },

    {
      id: "emergency-contact-address",

      name: "address",

      label: "Address",

      type: FIELD_TYPES.TEXTAREA,

      placeholder: "Enter address",

      rows: 4,

      width: FIELD_WIDTH.FULL,

      order: 5,
    },
  ],
}
  ],
};

export default personalInformation;