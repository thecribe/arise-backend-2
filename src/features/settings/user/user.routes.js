import { Router } from "express";

import userController from "./user.controller.js";

import { authenticate } from "../../../common/middleware/authenticate.js";
import { authorize } from "../../../common/middleware/authorize.js";
import { validate } from "../../../common/middleware/validate.js";

import { PERMISSIONS } from "../../../common/constants/permissions.js";

const userRouter = Router();

/**
 * Retrieve all manageable users.
 */
userRouter.get(
  "/",
  authenticate,
  authorize(PERMISSIONS.SETTINGS_VIEW.name),
  userController.getAllUsers,
);

/**
 * Retrieve roles available for assignment.
 */
userRouter.get(
  "/roles",
  authenticate,
  authorize(PERMISSIONS.SETTINGS_VIEW.name),
  userController.getAssignableRoles,
);

/**
 * Retrieve a manageable user by ID.
 */
userRouter.get(
  "/:id",
  authenticate,
  authorize(PERMISSIONS.SETTINGS_VIEW.name),
  userController.getUserById,
);

/**
 * Create a user account.
 */
userRouter.post(
  "/",
  authenticate,
  authorize(PERMISSIONS.ROLE_CREATE.name),

  userController.createUser,
);

/**
 * Update user details.
 */
userRouter.patch(
  "/:id",
  authenticate,
  authorize(PERMISSIONS.ROLE_UPDATE.name),

  userController.updateUser,
);

/**
 * Change a user's assigned role.
 */
userRouter.patch(
  "/:id/role",
  authenticate,
  authorize(PERMISSIONS.ROLE_UPDATE.name),

  userController.updateUserRole,
);

/**
 * Activate or deactivate a user account.
 */
userRouter.patch(
  "/:id/status",
  authenticate,
  authorize(PERMISSIONS.ROLE_UPDATE.name),
  userController.updateUserStatus,
);
userRouter.patch(
  "/:id/password",
  authenticate,
  authorize(PERMISSIONS.ROLE_UPDATE.name),
  userController.resetUserPassword,
);

export default userRouter;
