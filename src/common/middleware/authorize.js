export const authorize =
  (...permissions) =>
  (req, res, next) => {
    const allowed = permissions.every((permission) =>
      req.user.permissions.includes(permission),
    );

    if (!allowed) {
      return res.sendStatus(403);
    }

    next();
  };
