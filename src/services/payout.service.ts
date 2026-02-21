import axiosInstance from "@/lib/axios";
import { CreatePayoutFormData, RejectPayoutFormData } from "@/schemas/payout.schema";
import { ApiSuccess } from "@/types";
import { Payout, PayoutStatus, PayoutAudit } from "@/types/payout";

export const payoutService = {
    // Configured to support potential future query parameters (status, search) natively
    getPayouts: async (filters?: { status?: PayoutStatus }): Promise<ApiSuccess<{ payouts: Payout[] }>> => {
        let url = "/payouts";
        if (filters?.status && filters.status !== "All" as unknown) {
            url += `?status=${filters.status}`;
        }
        const response = await axiosInstance.get(url);
        return response.data;
    },

    // Pulls a single Payout heavily populated with BOTH the native details AND the Audit History timeline
    getPayoutById: async (id: string): Promise<ApiSuccess<{ payout: Payout; audits: PayoutAudit[] }>> => {
        const response = await axiosInstance.get(`/payouts/${id}`);
        return response.data;
    },

    createPayout: async (data: CreatePayoutFormData): Promise<ApiSuccess<{ payout: Payout }>> => {
        const response = await axiosInstance.post("/payouts", data);
        return response.data;
    },

    // State Machine Trigger APIs (Mapping exactly to backend constraints)
    submitPayout: async (id: string): Promise<ApiSuccess<{ payout: Payout }>> => {
        const response = await axiosInstance.post(`/payouts/${id}/submit`);
        return response.data;
    },

    approvePayout: async (id: string): Promise<ApiSuccess<{ payout: Payout }>> => {
        const response = await axiosInstance.post(`/payouts/${id}/approve`);
        return response.data;
    },

    rejectPayout: async (id: string, data: RejectPayoutFormData): Promise<ApiSuccess<{ payout: Payout }>> => {
        const response = await axiosInstance.post(`/payouts/${id}/reject`, data);
        return response.data;
    },
};
