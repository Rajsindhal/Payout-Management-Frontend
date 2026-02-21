import { z } from "zod";

export const createVendorSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(150, "Name cannot exceed 150 characters"),
    upi_id: z.string().regex(/^[\w.\-]+@[\w]+$/, "Please provide a valid UPI ID (e.g., vendor@oksbi)").optional().or(z.literal("")),
    bank_account: z.string().regex(/^\d{9,18}$/, "Bank account must be between 9 and 18 digits").optional().or(z.literal("")),
    ifsc: z.string()
        .toUpperCase()
        .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Please provide a valid IFSC code (e.g., SBIN0001234)")
        .optional()
        .or(z.literal("")),
});

export type CreateVendorFormData = z.infer<typeof createVendorSchema>;
