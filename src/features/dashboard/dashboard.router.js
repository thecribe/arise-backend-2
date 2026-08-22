import { Router } from "express";

import {
  getApplicantDashboardData,
} from "./dashboard.controller.js";
import { authenticate } from "../../common/middleware/authenticate.js";
import { authorize } from "../../common/middleware/authorize.js";
import { PERMISSIONS } from "../../common/constants/permissions.js";

const dashboardRouter = Router();

dashboardRouter.get(
  "/applicant",
  authenticate,
  authorize(PERMISSIONS.APPLICATION_VIEW.name),
  getApplicantDashboardData,
);

export { dashboardRouter };