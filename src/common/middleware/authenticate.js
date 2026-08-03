import { authRepository } from "../../features/auth/auth.repository.js";
import { userMapper } from "../../features/auth/mappers/user.mapper.js";

import { authCookie } from "../utils/auth-cookie.js";
import { jwtService } from "../services/jwt.service.js";
import { tokenService } from "../services/token.service.js";

export const authenticate = async (req, res, next) => {
  let session = null;
  let payload = null;

  /**
   * ----------------------------------------------------------------------
   * STEP 1
   * Try authenticating with the access token.
   *
   * If it is missing, invalid or expired, we'll silently fall back to the
   * refresh token instead of immediately returning 401.
   * ----------------------------------------------------------------------
   */
  const accessToken = req.cookies.access_token;

  if (accessToken) {
    try {
      payload = jwtService.verifyAccessToken(accessToken);

      session = await authRepository.findAuthenticatedSession(
        payload.sessionId,
      );
    } catch {
      payload = null;
      session = null;
    }
  }

  /**
   * ----------------------------------------------------------------------
   * STEP 2
   * Access authentication failed.
   *
   * Try authenticating using the refresh token.
   *
   * If successful:
   * - verify the refresh JWT
   * - verify it belongs to the current session
   * - generate a new access token
   * - send the new access cookie
   * - continue the request normally
   *
   * If this fails, the user must login again.
   * ----------------------------------------------------------------------
   */
  if (!session) {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      return res.sendStatus(401);
    }

    try {
      const refreshPayload = jwtService.verifyRefreshToken(refreshToken);

      session = await authRepository.findAuthenticatedSession(
        refreshPayload.sessionId,
      );

      if (!session) {
        return res.sendStatus(401);
      }

      if (session.expires_at && session.expires_at < new Date()) {
        return res.sendStatus(401);
      }

      const matches = tokenService.compare(
        refreshToken,
        session.refresh_token_hash,
      );

      if (!matches) {
        return res.sendStatus(401);
      }

      const newAccessToken = jwtService.generateAccessToken({
        userId: session.user.id,
        sessionId: session.id,
      });

      authCookie.setAccessToken(res, newAccessToken);
    } catch {
      return res.sendStatus(401);
    }
  }

  /**
   * ----------------------------------------------------------------------
   * STEP 3
   * At this point we have a valid authenticated session.
   *
   * Attach the authenticated user and session to the request so every
   * downstream controller and middleware can use them.
   * ----------------------------------------------------------------------
   */
  req.user = userMapper.toAuthenticatedUser(session.user);

  req.session = session;

  next();
};
