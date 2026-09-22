import { Router } from "express";
import { interviewDefinitionController } from "./interview-definition.controller.js";
import { authenticate } from "../../../common/middleware/authenticate.js";
import { authorize } from "../../../common/middleware/authorize.js";
import { PERMISSIONS } from "../../../common/constants/permissions.js";

const interviewDefinitionRouter = Router();

interviewDefinitionRouter.get(
  "/definition",
  authenticate,
  authorize(PERMISSIONS.APPLICATION_VIEW.name),
  interviewDefinitionController.getDefinition,
);

interviewDefinitionRouter.get(
  "/definition/sections",
  authenticate,
  authorize(PERMISSIONS.APPLICATION_VIEW.name),
  interviewDefinitionController.getSections,
);

interviewDefinitionRouter.get(
  "/definition/sections/:sectionId/fields",
  authenticate,
  authorize(PERMISSIONS.APPLICATION_VIEW.name),
  interviewDefinitionController.getSectionFields,
);

export default interviewDefinitionRouter;
