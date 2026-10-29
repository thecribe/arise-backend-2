import { Router } from "express";

import roleController from "./role.controller.js";
import { authenticate } from "../../../common/middleware/authenticate.js";
import { authorize } from "../../../common/middleware/authorize.js";
import { PERMISSIONS } from "../../../common/constants/permissions.js";
import { createRoleSchema } from "./schemas/create-role.schema.js";
import { updateRoleSchema } from "./schemas/update-role.schema.js";
import { updateRolePermissionsSchema } from "./schemas/update-role-permissions.schema.js";
import { validate } from "../../../common/middleware/validate.js";

const roleRouter = Router();

/**
 * Retrieve all roles.
 */
roleRouter.get(
  "/",
  authenticate,
  authorize(PERMISSIONS.ROLE_VIEW.name),
  roleController.getAllRoles,
);

/**
 * Retrieve system-defined permissions.
 */
roleRouter.get(
  "/permissions",
  authenticate,
  authorize(PERMISSIONS.ROLE_VIEW.name),
  roleController.getPermissions,
);

/**
 * Retrieve a role by ID.
 */
roleRouter.get(
  "/:id",
  authenticate,
  authorize(PERMISSIONS.ROLE_VIEW.name),
  roleController.getRoleById,
);

/**
 * Create a role with its selected permissions.
 */
roleRouter.post(
  "/",
  authenticate,
  authorize(PERMISSIONS.ROLE_CREATE.name),
  validate(createRoleSchema),
  roleController.createRole,
);

/**
 * Update custom role details.
 */
roleRouter.patch(
  "/:id",
  authenticate,
  authorize(PERMISSIONS.ROLE_UPDATE.name),
  validate(updateRoleSchema),
  roleController.updateRole,
);

/**
 * Replace the permissions assigned to a custom role.
 */
roleRouter.put(
  "/:id/permissions",
  authenticate,
  authorize(PERMISSIONS.ROLE_UPDATE.name),
  validate(updateRolePermissionsSchema),
  roleController.updateRolePermissions,
);

/**
 * Delete an eligible custom role.
 */
roleRouter.delete(
  "/:id",
  authenticate,
  authorize(PERMISSIONS.ROLE_DELETE.name),
  roleController.deleteRole,
);

export default roleRouter;
