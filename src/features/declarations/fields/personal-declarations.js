/**
 * -----------------------------------------------------------------------------
 * File: personal-declarations.js
 *
 * Description:
 * Personal declarations definition.
 * -----------------------------------------------------------------------------
 */

import {
  FIELD_TYPES,
  FIELD_WIDTH,
} from "../../../application-definition/constants.js";

const personalDeclarations = {
  id: "personal-declarations",

  text: `
    <p>
      I hereby confirm that the information provided on my application is correct and true to the best of my knowledge and that I have not withheld any information that should be considered when offering me work.
    </p>

    <p> I understand that providing false or inaccurate information may result in the termination of any placement. I agree that I will make best endeavours to make myself aware of the Health &amp; Safety procedures for each client I am assigned to.
    </p>

    <p> I confirm that I have read and understood the Terms of Engagement and the terms of the declaration and agree to be bound by them.
    </p>
  `,

  fields: [
    {
      id: "personal-declarations-signature",
      type: FIELD_TYPES.SIGNATURE,
      name: "signature",
      label: "Signature",
      required: true,
      order: 1,
      width: FIELD_WIDTH.HALF,
    },

    {
      id: "personal-declarations-date",
      type: FIELD_TYPES.DATE,
      name: "date",
      label: "Date",
      required: true,
      order: 2,
      width: FIELD_WIDTH.HALF,
    },
  ],
};

export default personalDeclarations;
