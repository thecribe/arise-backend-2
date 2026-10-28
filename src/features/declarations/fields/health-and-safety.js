/**
 * -----------------------------------------------------------------------------
 * File: health-and-safety.js
 *
 * Description:
 * Health and Safety declaration definition.
 * -----------------------------------------------------------------------------
 */

import {
  FIELD_TYPES,
  FIELD_WIDTH,
} from "../../../application-definition/constants.js";

const healthAndSafetyDeclaration = {
  id: "health-and-safety",

  text: `
    <p>
      Each agency worker has a responsibility at the start of their first shift to become familiar with the Client&apos;s general policies including, without limitation, those relating to Crash Call Procedures, the Hot Spot Mechanism for alerting security staff that an individual is in trouble, Fire Policy, and the Violent Episode Policy.
    </p>
  `,

  fields: [
    {
      id: "health-and-safety-signature",
      type: FIELD_TYPES.SIGNATURE,
      name: "signature",
      label: "Signature",
      required: true,
      order: 1,
      width: FIELD_WIDTH.HALF,
    },

    {
      id: "health-and-safety-date",
      type: FIELD_TYPES.DATE,
      name: "date",
      label: "Date",
      required: true,
      order: 2,
      width: FIELD_WIDTH.HALF,
    },
  ],
};

export default healthAndSafetyDeclaration;
