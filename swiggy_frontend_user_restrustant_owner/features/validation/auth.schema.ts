// features/auth/auth.schema.ts
import { z } from "zod";

// ==========================================
// LOGIN SCHEMA
// ==========================================
export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password should have at least 6 characters")
    .max(50, "Password cannot exceed 50 characters"),
});

export type LoginFormData = z.infer<typeof LoginSchema>;

// ==========================================
// REGISTER SCHEMA
// ==========================================
export const RegisterSchema = z
  .object({
    full_name: z
      .string()
      .min(1, "Name is required")
      .min(2, "Name should have at least 2 characters"),
    mobile_Number: z
      .string()
      .min(6, "Mobile number should have at least 6 characters")
      .max(10, "Mobile number cannot exceed 10 characters")
      .regex(/^\d+$/, "Mobile number must contain only digits"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    address: z
      .string()
      .min(2, "Address should have at least 2 characters"),
    password: z
      .string()
      .min(6, "Password should have at least 6 characters")
      .max(10, "Password cannot exceed 10 characters"),
    confirm_password: z
      .string()
      .min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Confirm password must match password",
    path: ["confirm_password"],
  });

export type RegisterFormData = z.infer<typeof RegisterSchema>;

// ==========================================
// OTP SCHEMA
// ==========================================
export const OtpSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  otp: z
    .string()
    .length(6, "OTP length should be 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only numbers"),
});

export type OtpFormData = z.infer<typeof OtpSchema>;