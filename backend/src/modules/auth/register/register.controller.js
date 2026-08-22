import mongoose from "mongoose";
import { HttpError } from "../../../utils/HttpError.js";
import { createAuthSession } from "../shared/authSession.js";
import { createAccessToken, createRefreshToken } from "../shared/authTokens.js";
import { setAuthCookies } from "../shared/authCookies.js";
import {
  createUser,
  deleteUserById,
  findUserByEmail,
  hashPassword,
  toPublicUser,
  uploadAvatarToCloudinary,
} from "./register.service.js";

const DUPLICATE_KEY_ERROR_CODE = 11000;

export const registerController = async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new HttpError(409, "Email in use");
  }

  const passwordHash = await hashPassword(password);

  const userId = new mongoose.Types.ObjectId();

  let avatarUrl;
  let avatarPublicId;

  if (req.file) {
    const uploadResult = await uploadAvatarToCloudinary(req.file.buffer, userId);

    avatarUrl = uploadResult.secure_url;
    avatarPublicId = uploadResult.public_id;
  }

  let user;

  try {
    user = await createUser({
      _id: userId,
      name,
      email,
      passwordHash,
      avatarUrl,
      avatarPublicId,
    });
  } catch (error) {
    if (error.code === DUPLICATE_KEY_ERROR_CODE) {
      throw new HttpError(409, "Email in use");
    }
    throw error;
  }

  try {
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    const session = await createAuthSession(user._id, refreshToken);

    setAuthCookies(res, refreshToken, session._id.toString());

    res.status(201).json({
      data: {
        user: toPublicUser(user),
        accessToken,
      },
      message: "Success",
    });
  } catch (error) {
    await deleteUserById(user._id);
    throw error;
  }
};

export const checkEmailController = async (req, res) => {
  const { email } = req.body;

  const existingUser = await findUserByEmail(email);

  res.status(200).json({
    data: {
      available: !existingUser,
    },
    message: "Success",
  });
};
