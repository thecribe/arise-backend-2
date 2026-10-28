import { Router } from "express";

import generalComplianceController from "./general-compliance.controller.js";
import { authenticate } from "../../common/middleware/authenticate.js";

const generalComplianceRouter = Router();

generalComplianceRouter.get(
  "/",
  //   authenticate,
  generalComplianceController.getCompliance,
);

export default generalComplianceRouter;
