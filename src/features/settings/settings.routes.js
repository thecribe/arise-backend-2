import { Router } from "express";

import generalRouter from "./general/general.routes.js";
import roleRouter from "./roles/roles.routes.js";
import userRouter from "./user/user.routes.js";

const settingsRouter = Router();

/**
 * General settings routes.
 *
 * GET   /general
 * PATCH /general
 */
settingsRouter.use("/general", generalRouter);
settingsRouter.use("/roles", roleRouter);
settingsRouter.use("/users", userRouter);

export default settingsRouter;
