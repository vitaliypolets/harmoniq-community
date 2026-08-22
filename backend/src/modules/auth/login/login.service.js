// backend/src/modules/auth/login/login.service.js

import bcrypt from "bcrypt";

import { User } from "../../../models/User.js";

import { createAccessToken, createRefreshToken } from "../shared/authTokens.js";

import { createAuthSession } from "../shared/authSession.js";

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email }).select("+passwordHash");

  if (!user) {
    const error = new Error("Invalid email or password");
    error.status = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    const error = new Error("Invalid email or password");
    error.status = 401;
    throw error;
  }

  const accessToken = createAccessToken(user);

  const refreshToken = createRefreshToken(user);

  const session = await createAuthSession(user._id, refreshToken);

  return {
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl ?? null,
      articlesAmount: user.articlesAmount,
    },

    accessToken,
    refreshToken,
    sessionId: session._id.toString(),
  };
}
