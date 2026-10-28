/**
 * -----------------------------------------------------------------------------
 * File: working-time-regulations.js
 *
 * Description:
 * Working Time Regulations declaration definition.
 * -----------------------------------------------------------------------------
 */

import {
  FIELD_TYPES,
  FIELD_WIDTH,
} from "../../../application-definition/constants.js";

const workingTimeRegulationsDeclaration = {
  id: "working-time-regulations",

  text: `
    <p>
      For the purposes of the Working Time Regulations 1998 (as amended) I, consent to work more than an average of 48 hours per week, averaged over 17 weeks. I understand that I may withdraw this consent by giving Arise Nursing not less than three months&rsquo; notice at any time.
    </p>
  `,

  fields: [
    {
      id: "working-time-regulations-signature",
      type: FIELD_TYPES.SIGNATURE,
      name: "signature",
      label: "Signature",
      required: true,
      order: 1,
      width: FIELD_WIDTH.HALF,
    },

    {
      id: "working-time-regulations-date",
      type: FIELD_TYPES.DATE,
      name: "date",
      label: "Date",
      required: true,
      order: 2,
      width: FIELD_WIDTH.HALF,
    },
  ],
};

export default workingTimeRegulationsDeclaration;
