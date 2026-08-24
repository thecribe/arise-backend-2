import multer from "multer";
import path from "path";
import fs from "fs";

function createUpload(baseDirectory) {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      try {
        const user = req.applicant;

        if (!user) {
          return cb(new Error("Upload user not available"));
        }

        const userFolder = `${user.id}-${user.first_name}-${user.last_name}`
          .toLowerCase()
          .replace(/[^a-z0-9-]/g, "-");

        const uploadPath = path.join(
          process.cwd(),
          "uploads",
          baseDirectory,
          userFolder,
        );

        fs.mkdirSync(uploadPath, {
          recursive: true,
        });

        cb(null, uploadPath);
      } catch (error) {
        cb(error);
      }
    },

    filename: function (req, file, cb) {
      const extension = path.extname(file.originalname);

      const filename = `${Date.now()}-${file.originalname.replaceAll(" ", "_")}`;
      // ${extension}
      cb(null, filename);
    },
  });

  return multer({
    storage,
  });
}

export default createUpload;
