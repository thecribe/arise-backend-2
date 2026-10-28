import { Router } from "express";

import generalRouter from "./general/general.routes.js";

const settingsRouter = Router();

/**
 * General settings routes.
 *
 * GET   /general
 * PATCH /general
 */
settingsRouter.use("/general", generalRouter);

export default settingsRouter;
