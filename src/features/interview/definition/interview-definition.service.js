import interviewInformation from "./interview-information.js";

const getInterviewDefinition = () => {
  return interviewInformation;
};

const getInterviewSections = () => {
  return [...interviewInformation.sections].sort((a, b) => a.order - b.order);
};

const getInterviewSection = (sectionId) => {
  return interviewInformation.sections.find(
    (section) => section.id === sectionId,
  );
};

const getInterviewFields = (sectionId) => {
  const section = getInterviewSection(sectionId);

  if (!section) {
    return null;
  }

  return [...section.fields].sort((a, b) => a.order - b.order);
};

export default {
  getInterviewDefinition,
  getInterviewSections,
  getInterviewSection,
  getInterviewFields,
};
