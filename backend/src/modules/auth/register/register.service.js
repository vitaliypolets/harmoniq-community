import bcrypt from "bcrypt";
import cloudinary from "../../../config/cloudinary.js";
import { User } from "../../../models/User.js";

const SALT_ROUNDS = 10;

const normalizeEmail = (email) => email.toLowerCase().trim();

export const findUserByEmail = (email) => User.findOne({ email: normalizeEmail(email) });

export const hashPassword = (password) => bcrypt.hash(password, SALT_ROUNDS);

export const createUser = ({ _id, name, email, passwordHash, avatarUrl, avatarPublicId }) =>
  User.create({ _id, name, email, passwordHash, avatarUrl, avatarPublicId });

export const deleteUserById = (id) => User.findByIdAndDelete(id);

export const toPublicUser = (user) => {
  const plain = typeof user.toObject === "function" ? user.toObject() : user;
  return {
    id: plain._id.toString(),
    name: plain.name,
    email: plain.email,
    avatarUrl: plain.avatarUrl ?? null,
    articlesAmount: plain.articlesAmount ?? 0,
    createdAt: plain.createdAt,
    updatedAt: plain.updatedAt,
  };
};

export const uploadAvatarToCloudinary = (buffer, userId) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "harmoniq/avatars",
        public_id: `avatar_${userId}`,
        resource_type: "image",
        overwrite: true,
        unique_filename: false,
        transformation: [
          { width: 500, height: 500, crop: "fill", gravity: "auto" },
          { fetch_format: "auto", quality: "auto" },
        ],
      },
      (error, result) => (error ? reject(error) : resolve(result)),
    );
    uploadStream.end(buffer);
  });
