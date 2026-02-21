export type Role = "OPS" | "FINANCE";

export interface User {
    _id: string;
    name: string;
    email: string;
    role: Role;
    createdAt: string;
    updatedAt: string;
}

export interface Vendor {
    _id: string;
    name: string;
    upi_id?: string;
    bank_account?: string;
    ifsc?: string;
    is_active: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ApiSuccess<T = unknown> {
    success: true;
    message: string;
    data: T;
}

export interface ApiError {
    success: false;
    message: string;
    errors?: Record<string, string>;
}

export * from "./payout";
