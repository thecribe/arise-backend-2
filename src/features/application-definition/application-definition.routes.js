import { Router } from "express";
import { getPhases, getSections } from "./application-definition.controller.js";

const applicationDefinitionRouter = Router();

applicationDefinitionRouter.get(
  "/phases",
  getPhases
);

applicationDefinitionRouter.get(
  "/phases/:phaseId/sections",
  getSections
);


export { applicationDefinitionRouter };