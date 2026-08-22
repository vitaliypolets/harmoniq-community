import bcrypt from "bcrypt";
import mongoose from "mongoose";

import { Session } from "../../../models/Session.js";
import { User } from "../../../models/User.js";
import { HttpError } from "../../../utils/HttpError.js";
import { createAuthSession } from "../shared/authSession.js";
import { createAccessToken, createRefreshToken } from "../shared/authTokens.js";

export const refreshAuthSession = async (refreshToken, sessionId) => {
  if (!refreshToken) {
    throw new HttpError(401, "Refresh token is missing");
  }

  if (!sessionId || !mongoose.isValidObjectId(sessionId)) {
    throw new HttpError(401, "Session not found or expired");
  }

  const session = await Session.findById(sessionId).select("+refreshTokenHash");

  if (!session) {
    throw new HttpError(401, "Session not found or expired");
  }

  const isTokenValid = await bcrypt.compare(refreshToken, session.refreshTokenHash);

  if (!isTokenValid) {
    await Session.deleteOne({ _id: session._id });
    throw new HttpError(401, "Invalid refresh token");
  }

  const user = await User.findById(session.userId);

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  await Session.deleteOne({ _id: session._id });

  const newAccessToken = createAccessToken(user);
  const newRefreshToken = createRefreshToken(user);

  const newSession = await createAuthSession(user._id, newRefreshToken);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    sessionId: newSession._id.toString(),
  };
};

export const logoutAuthSession = async (sessionId) => {
  if (!sessionId || !mongoose.isValidObjectId(sessionId)) {
    return;
  }

  await Session.deleteOne({ _id: sessionId });
};
