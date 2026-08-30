/**
 * -----------------------------------------------------------------------------
 * Application Definition Constants
 *
 * Centralised identifiers for phases and sections.
 *
 * These IDs are referenced throughout the application:
 * - Application Definition
 * - Applicant Progress
 * - Recruitment
 * - Compliance
 * -----------------------------------------------------------------------------
 */

export const PHASE_IDS = {
  APPLICATION_FORM: "application-form",
  INTERVIEW_AVAILABILITY: "interview-availability",
  EQUALITY_MONITORING: "equality-monitoring",

  // ADDRESS_CONTACT_INFORMATION: "address-contact-information",
  // RIGHT_TO_WORK: "right-to-work",
  // EMPLOYMENT_HISTORY: "employment-history",
  // REFERENCES: "references",
  // COMPLIANCE: "compliance",
  // DECLARATION: "declaration",
};

export const SECTION_IDS = {
  //Application form
  PERSONAL_INFORMATION: "personal-information",
  ADDRESS_CONTACT_INFORMATION: "address-contact-information",
  EMPLOYMENT_HISTORY: "employment-history",
  EDUCATIONAL_HISTORY: "educational-qualification",
  UPLOAD_CV: "upload-cv",

  //Equality Monitoring
  EQUALITY_MONITORING: "equality-monitoring",

  // Interview Availability
  INTERVIEW_AVAILABILITY: "interview-availability",

  // EMERGENCY_CONTACTS: "emergency-contacts",
  // CONTACT_INFORMATION: "contact-information",
  // ADDRESS_INFORMATION: "address-information",

  // // Right to Work
  // RIGHT_TO_WORK: "right-to-work",

  // // References
  // REFERENCES: "references",

  // // Compliance
  // COMPLIANCE_DOCUMENTS: "compliance-documents",

  // // Declaration
  // DECLARATION: "declaration",
};

/**
 * Supported field types.
 */
export const FIELD_TYPES = {
  TEXT: "text",
  PASSWORD: "password",

  EMAIL: "email",
  PHONE: "tel",
  NUMBER: "number",
  DATE: "date",
  TIME: "time",
  TEXTAREA: "textarea",

  SELECT: "select",
  MULTISELECT: "multiselect",
  RADIO: "radio",
  CHECKBOX: "checkbox",

  SIGNATURE: "signature",

  UPLOAD: "file",
};

/**
 * Grid widths.
 *
 * These values match the frontend layout system.
 */
export const FIELD_WIDTH = {
  QUARTER: 3,
  THIRD: 4,
  HALF: 6,
  TWO_THIRDS: 8,
  THREE_QUARTERS: 9,
  FULL: 12,
};

export const APPLICATION_STATUSES = [
  "locked",
  "draft",
  "in_progress",
  "submitted",
  "rejected",
  "approved",
];

export const APPLICATION_STATUS = {
  IN_PROGRESS: "IN_PROGRESS",
  REJECTED: "REJECTED",
  APPROVED: "APPROVED",
};

export const APPLICATION_STAGE = {
  APPLICATION_FORM: "APPLICATION_FORM",
  INTERVIEW: "INTERVIEW",
  COMPLIANCE: "COMPLIANCE",
};
