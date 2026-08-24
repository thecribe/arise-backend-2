export const applicationParseFormdata = (req, res, next) => {
  try {
    const parsedBody = {
      ...req.body,
    };

    /*
     * Parse JSON metadata.
     */
    const jsonFields = req.body.__json ? JSON.parse(req.body.__json) : [];

    /*
     * Parse file metadata.
     *
     * Example:
     *
     * {
     *   passport: "single",
     *   resume: "multiple",
     *   certificates: "multiple"
     * }
     */
    const fileFields = req.body.__files ? JSON.parse(req.body.__files) : {};

    /*
     * Remove internal fields.
     */
    delete parsedBody.__json;
    delete parsedBody.__files;

    /*
     * Parse JSON fields.
     */
    jsonFields.forEach((key) => {
      if (typeof parsedBody[key] === "string") {
        parsedBody[key] = JSON.parse(parsedBody[key]);
      }
    });

    /*
     * Group uploaded files by field name.
     */
    const uploadedFiles = {};

    if (Array.isArray(req.files)) {
      req.files.forEach((file) => {
        const fieldName = file.fieldname;
        const documentUrl = file.path
          .replace(process.cwd(), "")
          .replace(/\\/g, "/");

        const uploadedFile = {
          id: file.filename,
          name: file.filename,
          mimetype: file.mimetype,
          size: file.size,
          document_url: req.protocol + "://" + req.get("host") + documentUrl,
        };

        if (!uploadedFiles[fieldName]) {
          uploadedFiles[fieldName] = [];
        }

        uploadedFiles[fieldName].push(uploadedFile);
      });
    }
    /*
     * Process every file field.
     */
    Object.entries(fileFields).forEach(([fieldName, type]) => {
      const newFiles = uploadedFiles[fieldName] || [];

      const existingKey = `${fieldName}_existing`;

      let existingFiles = parsedBody[existingKey] || [];

      /*
       * Normalize to array.
       */
      if (!Array.isArray(existingFiles)) {
        existingFiles = [existingFiles];
      }

      /*
       * Parse existing file JSON.
       */
      existingFiles = existingFiles.map((file) => {
        if (typeof file === "string") {
          try {
            return JSON.parse(file);
          } catch {
            return file;
          }
        }

        return file;
      });

      /*
       * Remove temporary field.
       */
      delete parsedBody[existingKey];

      /*
       * SINGLE FILE
       */
      if (type === "single") {
        parsedBody[fieldName] = newFiles[0] || null;

        return;
      }

      /*
       * MULTIPLE FILES
       */
      parsedBody[fieldName] = [...existingFiles, ...newFiles];
    });

    /*
     * Replace req.body with clean data.
     */
    req.body = parsedBody;

    next();
  } catch (error) {
    next(error);
  }
};
