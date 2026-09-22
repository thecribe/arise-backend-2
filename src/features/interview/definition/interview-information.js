import { PHASE_IDS, SECTION_IDS } from "./constants.js";
import { communicationSkillsFields } from "./interview-fields/communication-skills.fields.js";
import { generalInformationField } from "./interview-fields/general-information.fields.js";
import { knowledgeOfCareFields } from "./interview-fields/knowledge-of-care.fields.js";
import { professionalismFields } from "./interview-fields/professionalism.fields.js";

const interviewInformation = {
  id: PHASE_IDS.INTERVIEW,
  title: "Interview Scoresheet",
  description: "Internal interview assessment for recruitment managers.",
  order: 3,
  sections: [
    {
      id: SECTION_IDS.INTERVIEW_GENERAL_INFORMATION,
      phaseId: PHASE_IDS.INTERVIEW,
      title: "General Information",
      description: "Interview details.",
      order: 4,
      repeatable: false,
      fields: generalInformationField,
    },
    {
      id: SECTION_IDS.KNOWLEDGE_OF_CARE,
      phaseId: PHASE_IDS.INTERVIEW,
      title: "Knowledge of Care",
      description: "Assessment of care knowledge.",
      order: 1,
      repeatable: false,
      fields: knowledgeOfCareFields,
    },
    {
      id: SECTION_IDS.COMMUNICATION_SKILLS,
      phaseId: PHASE_IDS.INTERVIEW,
      title: "Communication Skills",
      description: "Assessment of communication skills.",
      order: 2,
      repeatable: false,
      fields: communicationSkillsFields,
    },
    {
      id: SECTION_IDS.PROFESSIONALISM,
      phaseId: PHASE_IDS.INTERVIEW,
      title: "Professionalism",
      description: "Assessment of professionalism.",
      order: 3,
      repeatable: false,
      fields: professionalismFields,
    },
  ],
};

export default interviewInformation;
