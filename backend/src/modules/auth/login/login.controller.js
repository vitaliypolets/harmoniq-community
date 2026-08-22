import { loginSchema } from "./login.validation.js";
import { loginUser } from "./login.service.js";
import { setAuthCookies } from "../shared/authCookies.js";
import { HttpError } from "../../../utils/HttpError.js";

export async function loginController(req, res) {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    throw new HttpError(400, "Validation error", result.error.flatten());
  }

  const resultData = await loginUser(result.data);

  setAuthCookies(res, resultData.refreshToken, resultData.sessionId);

  return res.status(200).json({
    data: {
      user: resultData.user,
      accessToken: resultData.accessToken,
    },
    message: "Successfully logged in!",
  });
}
