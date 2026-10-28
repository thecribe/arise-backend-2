/**
 * -----------------------------------------------------------------------------
 * File: health.js
 *
 * Description:
 * Health declaration definition.
 *
 * This file contains the declaration text and fields required for an applicant
 * to complete the Health Declaration.
 *
 * The declaration is intentionally kept separate from the declaration index so
 * that individual declarations can be maintained independently.
 * -----------------------------------------------------------------------------
 */

import {
  FIELD_TYPES,
  FIELD_WIDTH,
} from "../../../application-definition/constants.js";

const healthDeclaration = {
  id: "health",

  text: `
    <p>
      We would ask all <strong>OVERSEAS</strong> candidates to provide a medical statement from their GP or medical department confirming your state of health. Your details will be passed to our Occupational Health Doctors to establish your fitness for work. Please sign the declaration below to allow Arise Nursing to release your information for inspection.
    </p>

    <p>
      I consent to Arise Nursing releasing my health and immunisation records for review. I understand that based on this review I may be required to undergo a medical examination to establish my fitness for work. I confirm that I will immediately inform Arise Nursing in confidence if I am HIV Positive, Hep B positive or if I have AIDS in accordance with the Department of Health guidelines. I am aware of my obligations regarding MRSA contact and the need for screening. I agree to immediately inform Arise Nursing should my general condition of health change.
    </p>

    <p> I will inform Arise Nursing immediately if I discover that I am pregnant. I understand that withholding information or giving false answers may lead to dismissal. I also hereby consent to Arise Nursing obtaining further information regarding my health from my GP or Occupational Health Department.
    </p>
  `,

  fields: [
    {
      id: "health-declaration-name",
      type: FIELD_TYPES.TEXT,
      name: "name",
      label: "Full Name",
      placeholder: "Enter your full name",
      required: true,
      order: 1,
      width: FIELD_WIDTH.HALF,
    },

    {
      id: "health-declaration-signature",
      type: FIELD_TYPES.SIGNATURE,
      name: "signature",
      label: "Signature",
      required: true,
      order: 2,
      width: FIELD_WIDTH.HALF,
    },

    {
      id: "health-declaration-date",
      type: FIELD_TYPES.DATE,
      name: "date",
      label: "Date",
      required: true,
      order: 3,
      width: FIELD_WIDTH.HALF,
    },
  ],
};

export default healthDeclaration;
