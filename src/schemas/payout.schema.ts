import { z } from "zod";

export const createPayoutSchema = z.object({
    vendor_id: z.string().min(1, "Beneficiary vendor is required"),
    amount: z.coerce.number().positive("Amount must be greater than 0"),
    mode: z.enum(["UPI", "IMPS", "NEFT"]),
});

export const rejectPayoutSchema = z.object({
    decision_reason: z
        .string()
        .min(5, "Rejection reason must be at least 5 characters long")
        .max(1000, "Rejection reason cannot exceed 1000 characters"),
});

export type CreatePayoutFormData = z.infer<typeof createPayoutSchema>;
export type RejectPayoutFormData = z.infer<typeof rejectPayoutSchema>;
