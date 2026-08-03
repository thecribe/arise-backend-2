import { z } from "zod";

const registerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),

  lastName: z.string().min(2, "Last name must be at least 2 characters"),

  email: z.string().email("Please enter a valid email address"),

  phoneNumber: z.string().min(10, "Please enter a valid phone number"),

  address: z.string().min(5, "Address is required"),

  postcode: z.string().min(3, "Postcode is required"),

  // jobType: z.string().uuid("Invalid job type").optional(),
  jobTypeId: z.string().optional(),

  acceptTerms: z.boolean().refine((value) => value === true, {
    message: "You must accept the terms and conditions",
  }),
});

const setPasswordSchema = z
  .object({
    token: z.string().min(1, "Token is required"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),

  password: z.string().min(1, "Password is required"),
});

export { registerSchema, setPasswordSchema, loginSchema };
