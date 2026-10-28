/**
 * -----------------------------------------------------------------------------
 * File: rehabilitation-of-offenders-act.js
 *
 * Description:
 * Rehabilitation of Offenders Act 1974 declaration definition.
 * -----------------------------------------------------------------------------
 */

import {
  FIELD_TYPES,
  FIELD_WIDTH,
} from "../../../application-definition/constants.js";

const rehabilitationOfOffendersActDeclaration = {
  id: "rehabilitation-of-offenders-act",

  text: `
    <p>
      Because of the nature of the work for which you are applying, Section 4(2), and further Orders made by the Secretary of State under the provision of this section of the Rehabilitation of Offenders Act (1974) (Exceptions) Order 1975 apply. Applicants are therefore required to give information about convictions which for other purposes are “spent” under the provisions of the Act. Any information given will be completely confidential and will be considered only in relation for positions to which the order applies.
    </p>
  `,

  fields: [
    {
      id: "rehabilitation-convictions",
      type: FIELD_TYPES.RADIO,
      name: "convictions",
      label: "Do you have any convictions, cautions or bindovers?",
      required: true,
      order: 1,
      width: FIELD_WIDTH.TWO_THIRDS,
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
      id: "rehabilitation-disciplinary-action",
      type: FIELD_TYPES.RADIO,
      name: "disciplinaryAction",
      label: "Have you ever had disciplinary action taken against you?",
      required: true,
      order: 2,
      width: FIELD_WIDTH.TWO_THIRDS,
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
      id: "rehabilitation-current-action",
      type: FIELD_TYPES.RADIO,
      name: "currentAction",
      label:
        "Are you at present the subject of criminal charges or disciplinary action?",
      required: true,
      order: 3,
      width: FIELD_WIDTH.TWO_THIRDS,
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
      id: "rehabilitation-police-check-consent",
      type: FIELD_TYPES.RADIO,
      name: "policeCheckConsent",
      label:
        "Do you consent to Arise Nursing requesting a police check and any appropriate references on your behalf?",
      required: true,
      order: 4,
      width: FIELD_WIDTH.TWO_THIRDS,
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
      id: "rehabilitation-police-checked",
      type: FIELD_TYPES.RADIO,
      name: "policeChecked",
      label: "Have you been police checked in the last three years?",
      required: true,
      order: 5,
      width: FIELD_WIDTH.TWO_THIRDS,
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
      id: "rehabilitation-signature",
      type: FIELD_TYPES.SIGNATURE,
      name: "signature",
      label: "Upload Signature",
      required: true,
      order: 6,
      width: FIELD_WIDTH.TWO_THIRDS,
      file: {
        multiple: false,
      },
    },
  ],
};

export default rehabilitationOfOffendersActDeclaration;
