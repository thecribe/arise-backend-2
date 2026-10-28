/**
 * -----------------------------------------------------------------------------
 * File: confidentiality.js
 *
 * Description:
 * Confidentiality declaration definition.
 * -----------------------------------------------------------------------------
 */

import {
  FIELD_TYPES,
  FIELD_WIDTH,
} from "../../../application-definition/constants.js";

const confidentialityDeclaration = {
  id: "confidentiality",

  text: `
    <p>
      I hereby declare that at no time will I divulge to any person, nor use for my own or any other person&apos;s benefit, any confidential information in relation to Arise Nursing or in relation to any of their employees, business affairs, transactions, or finances which I may acquire during the term of my agreement with Arise Nursing under the Terms of Engagement.
    </p>
  `,

  fields: [
    {
      id: "confidentiality-signature",
      type: FIELD_TYPES.SIGNATURE,
      name: "signature",
      label: "Signature",
      required: true,
      order: 1,
      width: FIELD_WIDTH.HALF,
    },

    {
      id: "confidentiality-date",
      type: FIELD_TYPES.DATE,
      name: "date",
      label: "Date",
      required: true,
      order: 2,
      width: FIELD_WIDTH.HALF,
    },
  ],
};

export default confidentialityDeclaration;
