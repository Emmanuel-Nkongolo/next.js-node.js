import { z } from "zod";

export const userSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters"),
  dateOfBirth: z.string().refine((date) => {
    const today = new Date();
    const dob = new Date(date);
    return dob < today;
  }, "Date of birth must be in the past"),
});

export type UserFormData = z.infer<typeof userSchema>;
