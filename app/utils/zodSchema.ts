// app/utils/zodSchema.ts
import { z } from "zod";

export const onboardingSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "First name can only contain letters and spaces"),

  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Last name can only contain letters and spaces"),

  address: z
    .string()
    .min(1, "Address is required")
    .max(200, "Address must be less than 200 characters")
    .regex(/^[a-zA-Z0-9\s,.-]+$/, "Address contains invalid characters"),

  telephone: z
    .string()
    .optional()
    .or(z.literal("")) // Allow empty string
    .refine((val) => {
      if (!val || val.trim() === "") return true; // Optional field
      // Basic phone number validation
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      const cleanPhone = val.replace(/[\s\(\)\-]/g, "");
      return phoneRegex.test(cleanPhone);
    }, "Please enter a valid phone number"),
});

export const invoiceSchema = z.object({
  // Top section
  invoiceName: z.string().min(1, "Invoice name is required"),
  total: z.number().min(1, "Total is required"),
  invoiceNumber: z.number().min(1, "Total is required"),
  status: z.enum(["PAID", "PENDING"]).default("PENDING"),
  currency: z.string().min(1, "Currency is required"),

  // From section
  fromName: z.string().min(1, "Your name is required"),
  fromEmail: z.email("Please enter a valid email address"),
  fromAddress: z.string().min(1, "Your address is required"),

  // To section
  clientName: z.string().min(1, "Client name is required"),
  clientEmail: z.email("Valid client email is required"),
  clientAddress: z.string().min(1, "Client address is required"),

  // Date section
  date: z.string().min(1, "Date is required"),
  dueDate: z.number().min(1, "Due date is required"),

  // Invoice items - keep as strings for form inputs
  invoiceItemDescription: z.string().min(1, "Item description is required"),
  invoiceItemquantity: z.string().min(1, "Quantity is required"),
  invoiceItemRate: z.string().min(1, "Rate is required"),

  // Notes
  note: z.string().optional(),
});
export type InvoiceFormData = z.infer<typeof invoiceSchema>;

export type OnboardingFormData = z.infer<typeof onboardingSchema>;
