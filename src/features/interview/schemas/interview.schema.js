import { z } from "zod";

const scoreField = z.coerce
  .number({ error: "Score is required" })
  .int("Score must be a whole number")
  .min(0, "Minimum score is 0")
  .max(5, "Maximum score is 5");

const scoresSchema = z.object({
  understandingPersonalCare: scoreField,
  handlingMobilityIssues: scoreField,
  healthSafetyAwareness: scoreField,
  knowledgeOfSafeguarding: scoreField,
  nutritionMealPreparation: scoreField,

  spokenEnglishCompetency: scoreField,
  listeningSkills: scoreField,
  abilityToExplainInstructions: scoreField,
  empathyProfessionalLanguage: scoreField,

  timeManagementAwareness: scoreField,
  attitudeWillingnessToLearn: scoreField,
  adaptability: scoreField,
});

const baseInterviewSchema = z.object({
  interviewDate: z.string().min(1, "Interview date is required"),

  scores: scoresSchema,

  notes: z.array(z.string().min(1, "Note cannot be empty")).default([]),

  interviewerSignature: z.string().optional().nullable(),
});

/**
 * Schema for creating an interview
 */
export const createInterviewSchema = baseInterviewSchema;

/**
 * Schema for updating an interview
 */
export const updateInterviewSchema = baseInterviewSchema.partial();
