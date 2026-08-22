import multer from 'multer';

const storage = multer.memoryStorage();

const MAX_FILE_SIZE = 1 * 1024 * 1024;
const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const fileFilter = (_req, file, callback) => {
  if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype)) {
    const error = new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname);
    error.message = 'Invalid file type. Only JPEG, PNG and WEBP images are allowed.';

    return callback(error);
  }

  callback(null, true);
};

export const articleUpload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },
  fileFilter,
});
