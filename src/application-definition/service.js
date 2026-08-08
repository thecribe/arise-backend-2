import applicationDefinition from "./index.js";


class ApplicationDefinitionService {
  /**
   * Returns the complete application definition.
   */
  getDefinition() {
    return applicationDefinition;
  }

  /**
   * Returns all phases.
   */
getPhases() {
  return [...applicationDefinition.phases]
    .sort((a, b) => a.order - b.order)
    .map(
      ({
        id,
        title,
        description,
        order,
      }) => ({
        id,
        title,
        description,
        order,
      }),
    );
}
  

  /**
   * Returns a single phase.
   */
  getPhase(phaseId) {
    return applicationDefinition.phases.find(
      (phase) => phase.id === phaseId,
    );
  }

  /**
   * Returns all sections belonging to a phase.
   */
getSections(phaseId) {
  return [...(this.getPhase(phaseId)?.sections ?? [])].sort(
    (a, b) => a.order - b.order,
  );
}

  /**
   * Returns one section.
   */
  getSection(sectionId) {
    return applicationDefinition.phases
      .flatMap((phase) => phase.sections)
      .find((section) => section.id === sectionId);
  }

  /**
   * Returns every section.
   */
  getAllSections() {
    return applicationDefinition.phases.flatMap(
      (phase) => phase.sections,
    );
  }

  /**
   * Returns one field.
   */
  getField(sectionId, fieldId) {
    const section = this.getSection(sectionId);

    return section?.fields.find(
      (field) => field.id === fieldId,
    );
  }

  /**
   * Returns every field.
   */
  getAllFields() {
    return this.getAllSections().flatMap(
      (section) => section.fields,
    );
  }
}

export default new ApplicationDefinitionService();