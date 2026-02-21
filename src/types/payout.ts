export type PayoutStatus = "Draft" | "Submitted" | "Approved" | "Rejected";

export interface PayoutAudit {
    _id: string;
    payout_id: string;
    action: "CREATED" | "SUBMITTED" | "APPROVED" | "REJECTED";
    performer_id: string;
    performer_name: string;
    note?: string;
    createdAt: string;
}

export interface Payout {
    _id: string;
    vendor_id: {
        _id: string;
        name: string;
        upi_id?: string;
        bank_account?: string;
        ifsc?: string;
    };
    author_id: string;
    approver_id?: string;
    amount: number;
    mode: "UPI" | "IMPS" | "NEFT";
    status: PayoutStatus;
    decision_reason?: string;
    note?: string;
    createdAt: string;
    updatedAt: string;
}
