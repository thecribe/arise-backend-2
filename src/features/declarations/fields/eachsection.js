/**
 * -----------------------------------------------------------------------------
 * File: eachsection.js
 *
 * Description:
 * Combines all declaration section definitions.
 *
 * Individual declaration definitions are maintained in separate files to make
 * each section easier to update independently.
 * -----------------------------------------------------------------------------
 */

import healthDeclaration from "./health.js";
import disabilityDeclaration from "./disability.js";
import confidentialityDeclaration from "./confidentiality.js";
import photographicImagesDeclaration from "./photographic-images.js";
import personalDeclarations from "./personal-declarations.js";
import workingTimeRegulationsDeclaration from "./working-time-regulations.js";
import otherDeclarations from "./other-declarations.js";
import healthAndSafetyDeclaration from "./health-and-safety.js";
import rehabilitationOfOffendersActDeclaration from "./rehabilitation-of-offenders-act.js";

const declarationSections = {
  [healthDeclaration.id]: healthDeclaration,

  [disabilityDeclaration.id]: disabilityDeclaration,

  [confidentialityDeclaration.id]: confidentialityDeclaration,

  [photographicImagesDeclaration.id]: photographicImagesDeclaration,

  [personalDeclarations.id]: personalDeclarations,

  [workingTimeRegulationsDeclaration.id]: workingTimeRegulationsDeclaration,

  [otherDeclarations.id]: otherDeclarations,

  [healthAndSafetyDeclaration.id]: healthAndSafetyDeclaration,

  [rehabilitationOfOffendersActDeclaration.id]:
    rehabilitationOfOffendersActDeclaration,
};

export default declarationSections;
