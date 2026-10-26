import { z } from "zod";

// Regex Patterns
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const PHONE_REGEX = /^\d{10}$/;
const FSSAI_REGEX = /^\d{14}$/;

// ==========================================
// Initial Stage: Email Schema
// ==========================================
export const applyEmailSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .toLowerCase()
    .trim(),
});

export type ApplyEmailFormValues = z.infer<typeof applyEmailSchema>;

// ==========================================
// Initial Stage: OTP Schema
// ==========================================
export const verifyOtpSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .toLowerCase()
    .trim(),
  otp: z
    .string()
    .min(4, "OTP must be at least 4 digits")
    .max(6, "OTP cannot exceed 6 digits")
    .trim(),
});

export type VerifyOtpFormValues = z.infer<typeof verifyOtpSchema>;

// ==========================================
// Step 1 Schema: Basic Details
// ==========================================
export const basicDetailsSchema = z.object({
  ownerName: z
    .string()
    .min(2, "Owner name must be at least 2 characters")
    .trim(),
  restaurantName: z
    .string()
    .min(2, "Restaurant name must be at least 2 characters")
    .trim(),
  location: z.union([
    z.string().min(5, "Location address is required"),
    z.object({
      address: z.string().min(5, "Address must be at least 5 characters"),
      city: z.string().min(2, "City is required"),
      state: z.string().min(2, "State is required"),
      pincode: z.string().min(6, "Valid 6-digit pincode is required"),
    }),
  ]),
  email: z.string().email("Invalid email address").toLowerCase().trim(),
  phone: z
    .string()
    .regex(PHONE_REGEX, "Enter a valid 10-digit mobile number"),
  whatsappNumber: z
    .string()
    .regex(PHONE_REGEX, "Enter a valid 10-digit WhatsApp number"),
  workingDays: z
    .array(z.string())
    .min(1, "Select at least one working day"),
  openingClosing: z.object({
    open: z.string().min(1, "Opening time is required"),
    close: z.string().min(1, "Closing time is required"),
  }),
});

export type BasicDetailsFormValues = z.infer<typeof basicDetailsSchema>;

// ==========================================
// Step 2 Schema: Legal & Financial Documents
// ==========================================
export const documentsSchema = z.object({
  outletType: z.enum(["Restaurant", "Cloud Kitchen", "Cafe", "Bakery", "Sweet Shop"], {
    required_error: "Please select an outlet type",
  }),
  pan: z
    .string()
    .transform((val) => val.toUpperCase().trim())
    .pipe(z.string().regex(PAN_REGEX, "Invalid PAN number format (e.g. ABCDE1234F)")),
  gstin: z
    .string()
    .transform((val) => val.toUpperCase().trim())
    .pipe(z.string().regex(GSTIN_REGEX, "Invalid GSTIN format"))
    .optional()
    .or(z.literal("")),
  ifscCode: z
    .string()
    .transform((val) => val.toUpperCase().trim())
    .pipe(z.string().regex(IFSC_REGEX, "Invalid IFSC Code format")),
  bankAccountNumber: z
    .string()
    .min(9, "Account number must be at least 9 digits")
    .max(18, "Account number cannot exceed 18 digits")
    .trim(),
  fssaiNumber: z
    .string()
    .regex(FSSAI_REGEX, "FSSAI number must be exactly 14 digits"),
});

export type DocumentsFormValues = z.infer<typeof documentsSchema>;

// ==========================================
// Step 3 Schema: Partner Contract
// ==========================================
export const contractSchema = z.object({
  fullName: z.string().min(1, "Full name is required").trim(),
  designation: z.string().min(1, "Designation is required").trim(),
  date: z.string().optional(),
  place: z.string().min(1, "Place is required").trim(),
  declarationAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
  reviewedSections: z
    .array(z.string())
    .min(4, "Please review all contract sections"),
});

export type ContractFormValues = z.infer<typeof contractSchema>;