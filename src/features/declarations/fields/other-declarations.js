/**
 * -----------------------------------------------------------------------------
 * File: other-declarations.js
 *
 * Description:
 * Other declarations definition.
 * -----------------------------------------------------------------------------
 */

import {
  FIELD_TYPES,
  FIELD_WIDTH,
} from "../../../application-definition/constants.js";

const otherDeclarations = {
  id: "other-declarations",

  text: `
    <p>
      In addition, I also consent to work more than the maximum number of hours permitted to work at night under the directive. Please note you are under no obligation to sign either declaration.
    </p>
  `,

  fields: [
    {
      id: "other-declarations-signature",
      type: FIELD_TYPES.SIGNATURE,
      name: "signature",
      label: "Signature",
      required: true,
      order: 1,
      width: FIELD_WIDTH.HALF,
    },

    {
      id: "other-declarations-date",
      type: FIELD_TYPES.DATE,
      name: "date",
      label: "Date",
      required: true,
      order: 2,
      width: FIELD_WIDTH.HALF,
    },
  ],
};

export default otherDeclarations;
