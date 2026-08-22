import multer from "multer";

const storage = multer.memoryStorage();

const MAX_FILE_SIZE = 1 * 1024 * 1024;

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    const error = new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname);

    error.message = "Invalid file type. Only JPEG, PNG and WEBP images are allowed.";

    return cb(error);
  }

  cb(null, true);
};

export const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },
  fileFilter,
});
