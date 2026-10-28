/**
 * -----------------------------------------------------------------------------
 * File: disability.js
 *
 * Description:
 * Disability Discrimination Act declaration definition.
 * -----------------------------------------------------------------------------
 */

import {
  FIELD_TYPES,
  FIELD_WIDTH,
} from "../../../application-definition/constants.js";

const disabilityDeclaration = {
  id: "disability",

  text: `
      <p>
      Applicants with disabilities will be invited for interview if the essential job criteria are met.
    </p>
  `,

  fields: [
    {
      id: "disability-status",
      type: FIELD_TYPES.RADIO,
      name: "disabilityStatus",
      label:
        "Do you consider yourself to be a person with a disability as described by the Disability Discrimination Act 1995? i.e. do you consider yourself to be someone who has a physical or mental impairment which has a substantial and long term adverse effect on your ability to carry out normal day to day activities?",
      required: true,
      order: 1,
      width: FIELD_WIDTH.FULL,
      options: [
        {
          label: "Yes",
          value: "yes",
        },
        {
          label: "No",
          value: "no",
        },
      ],
    },

    {
      id: "disability-details",
      type: FIELD_TYPES.TEXTAREA,
      name: "disabilityDetails",
      label: "If 'No' please give details.",
      required: false,
      order: 2,
      width: FIELD_WIDTH.FULL,
      visibleWhen: {
        rules: [
          {
            field: "disabilityStatus",
            operator: "equals",
            value: "no",
          },
        ],
      },
    },

    {
      id: "disability-signature",
      type: FIELD_TYPES.SIGNATURE,
      name: "signature",
      label: "Signature",
      required: true,
      order: 3,
      width: FIELD_WIDTH.HALF,
    },

    {
      id: "disability-date",
      type: FIELD_TYPES.DATE,
      name: "date",
      label: "Date",
      required: true,
      order: 4,
      width: FIELD_WIDTH.HALF,
    },
  ],
};

export default disabilityDeclaration;
