import { z } from "zod";

export const loginSchema = z.object({
  mobile: z
    .string()
    .min(10, "Mobile number must be 10 digits")
    .max(10, "Mobile number must be 10 digits")
    .regex(/^[6-9]\d{9}$/, "Enter a valid mobile number"),
});

export type LoginFormData = z.infer<typeof loginSchema>;