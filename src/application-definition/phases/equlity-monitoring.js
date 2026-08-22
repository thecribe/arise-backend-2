import {
  FIELD_TYPES,
  FIELD_WIDTH,
  PHASE_IDS,
  SECTION_IDS,
} from "../constants.js";

const equalityMonitoringInformation = {
  id: PHASE_IDS.EQUALITY_MONITORING,

  title: "Equality Monitoring",

  description:
    "This information is collected separately for equality monitoring purposes and will not be visible to the recruiting manager.",

  order: 2,

  sections: [
    {
      id: SECTION_IDS.EQUALITY_MONITORING,

      phaseId: PHASE_IDS.EQUALITY_MONITORING,

      title: "Equality Monitoring",

      description:
        "Please provide the following information. Your responses are collected separately from your application and are used for equality monitoring purposes only.",

      order: 1,

      repeatable: false,

      fields: [
        /**
         * ---------------------------------------------------------------------
         * Gender
         * ---------------------------------------------------------------------
         */
        {
          id: "equality-monitoring-gender",
          name: "gender",
          label: "How do you describe your gender?",
          type: FIELD_TYPES.SELECT,
          placeholder: "Select your gender",
          required: false,
          width: FIELD_WIDTH.HALF,
          order: 1,
          options: [
            {
              label: "Man",
              value: "man",
            },
            {
              label: "Woman",
              value: "woman",
            },
            {
              label: "Non-binary",
              value: "non-binary",
            },
            {
              label: "Prefer to self-describe",
              value: "self-describe",
            },
            {
              label: "Prefer not to say",
              value: "prefer-not-to-say",
            },
          ],
        },

        /**
         * ---------------------------------------------------------------------
         * Ethnicity
         * ---------------------------------------------------------------------
         */
        {
          id: "equality-monitoring-ethnicity",
          name: "ethnicity",
          label: "What is your ethnic group?",
          type: FIELD_TYPES.SELECT,
          placeholder: "Select your ethnic group",
          required: false,
          width: FIELD_WIDTH.HALF,
          order: 2,
          options: [
            {
              label:
                "White - English, Welsh, Scottish, Northern Irish or British",
              value: "white-british",
            },
            {
              label: "White - Irish",
              value: "white-irish",
            },
            {
              label: "White - Gypsy or Irish Traveller",
              value: "white-gypsy-or-irish-traveller",
            },
            {
              label: "White - Roma",
              value: "white-roma",
            },
            {
              label: "White - Any other White background",
              value: "white-other",
            },
            {
              label: "Mixed or Multiple - White and Black Caribbean",
              value: "mixed-white-and-black-caribbean",
            },
            {
              label: "Mixed or Multiple - White and Black African",
              value: "mixed-white-and-black-african",
            },
            {
              label: "Mixed or Multiple - White and Asian",
              value: "mixed-white-and-asian",
            },
            {
              label:
                "Mixed or Multiple - Any other Mixed or Multiple background",
              value: "mixed-other",
            },
            {
              label: "Asian or Asian British - Indian",
              value: "asian-indian",
            },
            {
              label: "Asian or Asian British - Pakistani",
              value: "asian-pakistani",
            },
            {
              label: "Asian or Asian British - Bangladeshi",
              value: "asian-bangladeshi",
            },
            {
              label: "Asian or Asian British - Chinese",
              value: "asian-chinese",
            },
            {
              label: "Asian or Asian British - Any other Asian background",
              value: "asian-other",
            },
            {
              label: "Black, Black British, Caribbean or African - African",
              value: "black-african",
            },
            {
              label: "Black, Black British, Caribbean or African - Caribbean",
              value: "black-caribbean",
            },
            {
              label:
                "Black, Black British, Caribbean or African - Any other Black, Black British or Caribbean background",
              value: "black-other",
            },
            {
              label: "Other ethnic group - Arab",
              value: "other-arab",
            },
            {
              label: "Other ethnic group - Any other ethnic group",
              value: "other",
            },
            {
              label: "Prefer not to say",
              value: "prefer-not-to-say",
            },
          ],
        },

        /**
         * ---------------------------------------------------------------------
         * Religion or Belief
         * ---------------------------------------------------------------------
         */
        {
          id: "equality-monitoring-religion",
          name: "religionOrBelief",
          label: "What is your religion or belief?",
          type: FIELD_TYPES.SELECT,
          placeholder: "Select your religion or belief",
          required: false,
          width: FIELD_WIDTH.HALF,
          order: 3,
          options: [
            {
              label: "No religion",
              value: "no-religion",
            },
            {
              label: "Christian",
              value: "christian",
            },
            {
              label: "Buddhist",
              value: "buddhist",
            },
            {
              label: "Hindu",
              value: "hindu",
            },
            {
              label: "Jewish",
              value: "jewish",
            },
            {
              label: "Muslim",
              value: "muslim",
            },
            {
              label: "Sikh",
              value: "sikh",
            },
            {
              label: "Other religion or belief",
              value: "other",
            },
            {
              label: "Prefer not to say",
              value: "prefer-not-to-say",
            },
          ],
        },

        /**
         * ---------------------------------------------------------------------
         * Sexual Orientation
         * ---------------------------------------------------------------------
         */
        {
          id: "equality-monitoring-sexual-orientation",
          name: "sexualOrientation",
          label:
            "Which of the following best describes your sexual orientation?",
          type: FIELD_TYPES.SELECT,
          placeholder: "Select your sexual orientation",
          required: false,
          width: FIELD_WIDTH.HALF,
          order: 4,
          options: [
            {
              label: "Heterosexual or straight",
              value: "heterosexual",
            },
            {
              label: "Gay or lesbian",
              value: "gay-or-lesbian",
            },
            {
              label: "Bisexual",
              value: "bisexual",
            },
            {
              label: "Other sexual orientation",
              value: "other",
            },
            {
              label: "Not sure",
              value: "not-sure",
            },
            {
              label: "Prefer not to say",
              value: "prefer-not-to-say",
            },
          ],
        },

        /**
         * ---------------------------------------------------------------------
         * Disability Status
         * ---------------------------------------------------------------------
         */
        {
          id: "equality-monitoring-disability",
          name: "disabilityStatus",
          label:
            "Do you consider yourself to have a disability or long-term health condition?",
          type: FIELD_TYPES.SELECT,
          placeholder: "Select an option",
          required: false,
          width: FIELD_WIDTH.HALF,
          order: 5,
          options: [
            {
              label: "Yes",
              value: "yes",
            },
            {
              label: "No",
              value: "no",
            },
            {
              label: "Prefer not to say",
              value: "prefer-not-to-say",
            },
          ],
        },

        /**
         * ---------------------------------------------------------------------
         * Age Band
         * ---------------------------------------------------------------------
         */
        {
          id: "equality-monitoring-age-band",
          name: "ageBand",
          label: "Which age band are you in?",
          type: FIELD_TYPES.SELECT,
          placeholder: "Select your age band",
          required: false,
          width: FIELD_WIDTH.HALF,
          order: 6,
          options: [
            {
              label: "16–24",
              value: "16-24",
            },
            {
              label: "25–34",
              value: "25-34",
            },
            {
              label: "35–44",
              value: "35-44",
            },
            {
              label: "45–54",
              value: "45-54",
            },
            {
              label: "55–64",
              value: "55-64",
            },
            {
              label: "65 and over",
              value: "65-plus",
            },
            {
              label: "Prefer not to say",
              value: "prefer-not-to-say",
            },
          ],
        },
      ],
    },
  ],
};

export default equalityMonitoringInformation;
