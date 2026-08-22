import { controllerWrapper } from '../../../middlewares/controllerWrapper.js';
import { clearAuthCookies, setAuthCookies } from '../shared/authCookies.js';
import { logoutAuthSession, refreshAuthSession } from './session.service.js';

export const refreshSessionController = controllerWrapper(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  const sessionId = req.cookies?.sessionId;

  const session = await refreshAuthSession(refreshToken, sessionId);

  setAuthCookies(res, session.refreshToken, session.sessionId);

  res.status(200).json({
    data: {
      accessToken: session.accessToken,
    },
    message: 'Successfully refreshed a session!',
  });
});

export const logoutSessionController = controllerWrapper(async (req, res) => {
  const sessionId = req.cookies?.sessionId;

  await logoutAuthSession(sessionId);

  clearAuthCookies(res);

  res.status(204).send();
});
