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
  PERSONAL_INFORMATION: "personal-information",
  RIGHT_TO_WORK: "right-to-work",
  EMPLOYMENT_HISTORY: "employment-history",
  REFERENCES: "references",
  COMPLIANCE: "compliance",
  DECLARATION: "declaration",
};

export const SECTION_IDS = {
  // Personal Information
  BASIC_INFORMATION: "basic-information",
  EMERGENCY_CONTACTS: "emergency-contacts",
  CONTACT_INFORMATION: "contact-information",
  ADDRESS_INFORMATION: "address-information",

  // Right to Work
  RIGHT_TO_WORK: "right-to-work",

  // Employment
  EMPLOYMENT_HISTORY: "employment-history",

  // References
  REFERENCES: "references",

  // Compliance
  COMPLIANCE_DOCUMENTS: "compliance-documents",

  // Declaration
  DECLARATION: "declaration",
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