import multer from "multer";
import path from "path";
import fs from "fs";

const createSettingsUpload = (baseDirectory) => {
  const uploadPath = path.join(process.cwd(), "uploads", baseDirectory);

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      try {
        fs.mkdirSync(uploadPath, {
          recursive: true,
        });

        cb(null, uploadPath);
      } catch (error) {
        cb(error);
      }
    },

    filename: (req, file, cb) => {
      const extension = path.extname(file.originalname);
      const originalName = path
        .basename(file.originalname, extension)
        .replace(/[^a-zA-Z0-9_-]/g, "_");

      const filename = `${Date.now()}-${originalName}${extension}`;

      cb(null, filename);
    },
  });

  return multer({
    storage,
  });
};

export default createSettingsUpload;
