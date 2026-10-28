/**
 * -----------------------------------------------------------------------------
 * File: photographic-images.js
 *
 * Description:
 * Consent for the use of staff photographic images declaration definition.
 * -----------------------------------------------------------------------------
 */

import {
  FIELD_TYPES,
  FIELD_WIDTH,
} from "../../../application-definition/constants.js";

const photographicImagesDeclaration = {
  id: "photographic-images",

  text: `
    <p>
      To comply with the principle, set out in the Data Protection Act 2018 and GDPR, Arise Nursing requires consent to take and use staff photographic images. By signing this declaration, you authorise Arise Nursing to use your images in publications, promotions, social media, advertising, website and any other digital media or filming which Arise Nursing approves and authorise. If you should wish to withdraw your consent at any time, please contact us at <a href="mailto:info@arisenursing.co.uk">info@arisenursing.co.uk</a>. Please note that although your images will be removed from our data base on request, we cannot guarantee it will not be in circulation in any media produced prior to your request.
    </p>

    <p> I hereby consent for my photographic images to be used as stated above.
    </p>
  `,

  fields: [
    {
      id: "photographic-images-signature",
      type: FIELD_TYPES.SIGNATURE,
      name: "signature",
      label: "Signature",
      required: true,
      order: 1,
      width: FIELD_WIDTH.HALF,
    },

    {
      id: "photographic-images-date",
      type: FIELD_TYPES.DATE,
      name: "date",
      label: "Date",
      required: true,
      order: 2,
      width: FIELD_WIDTH.HALF,
    },
  ],
};

export default photographicImagesDeclaration;
