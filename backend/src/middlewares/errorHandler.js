import multer from 'multer';
import { env } from '../config/env.js';

const getMulterErrorMessage = (error) => {
  switch (error.code) {
    case 'LIMIT_FILE_SIZE':
      return 'File must be up to 1 MB';
    case 'LIMIT_FILE_COUNT':
      return 'Only one file is allowed';
    case 'LIMIT_UNEXPECTED_FILE':
      return error.message || 'Unexpected file';
    default:
      return error.message || 'File upload error';
  }
};

export const errorHandler = (error, _req, res, _next) => {
  const isMulterError = error instanceof multer.MulterError;
  const status = isMulterError ? 400 : Number(error.status ?? 500);
  const message = isMulterError
    ? getMulterErrorMessage(error)
    : (error.message ?? 'Internal server error');

  res.status(status).json({
    status,
    message,
    details: error.details,
    ...(env.nodeEnv !== 'production' ? { stack: error.stack } : {}),
  });
};
