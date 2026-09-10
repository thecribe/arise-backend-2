import { logger } from "../logger/logger.js";

export const applicationParseFormdata = (req, res, next) => {
  try {
    /*
     * ----------------------------------------
     * PARSE THE MAIN PAYLOAD
     * ----------------------------------------
     *
     * The frontend always sends the original
     * object/array structure as __payload.
     */

    let parsedBody = {};

    if (req.body.__payload) {
      try {
        parsedBody = JSON.parse(req.body.__payload);
      } catch (error) {
        throw new Error("Invalid __payload JSON");
      }
    }

    /*
     * ----------------------------------------
     * CREATE FILE LOOKUP
     * ----------------------------------------
     *
     * Example:
     *
     * uploadedFiles = {
     *   passport: {
     *     id: "...",
     *     name: "...",
     *     mimetype: "...",
     *     size: 12345,
     *     document_url: "..."
     *   },
     *
     *   qualifications_0_certificate_2: {
     *     ...
     *   }
     * }
     */

    const uploadedFiles = {};

    if (Array.isArray(req.files)) {
      req.files.forEach((file) => {
        const documentUrl = file.path
          .replace(process.cwd(), "")
          .replace(/\\/g, "/");

        uploadedFiles[file.fieldname] = {
          id: file.filename,
          name: file.filename,
          mimetype: file.mimetype,
          size: file.size,
          document_url: req.protocol + "://" + req.get("host") + documentUrl,
        };
      });
    }

    /*
     * ----------------------------------------
     * REPLACE FILE PLACEHOLDERS
     * ----------------------------------------
     *
     * Finds:
     *
     * {
     *   __file: true,
     *   field: "qualifications_0_certificate_2"
     * }
     *
     * And replaces it with:
     *
     * uploadedFiles[
     *   "qualifications_0_certificate_2"
     * ]
     */

    const replaceFilePlaceholders = (value) => {
      /*
       * FILE PLACEHOLDER
       */

      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value) &&
        value.__file === true &&
        typeof value.field === "string"
      ) {
        return uploadedFiles[value.field] || null;
      }

      /*
       * ARRAY
       */

      if (Array.isArray(value)) {
        return value.map((item) => replaceFilePlaceholders(item));
      }

      /*
       * OBJECT
       */

      if (typeof value === "object" && value !== null) {
        const result = {};

        Object.entries(value).forEach(([key, item]) => {
          result[key] = replaceFilePlaceholders(item);
        });

        return result;
      }

      /*
       * PRIMITIVES
       */

      return value;
    };

    /*
     * ----------------------------------------
     * RECONSTRUCT ORIGINAL PAYLOAD
     * ----------------------------------------
     */

    const cleanBody = replaceFilePlaceholders(parsedBody);

    /*
     * Replace req.body.
     *
     * This can be an object OR an array,
     * depending on what the frontend originally sent.
     */

    req.body = cleanBody;

    next();
  } catch (error) {
    next(error);
  }
};
