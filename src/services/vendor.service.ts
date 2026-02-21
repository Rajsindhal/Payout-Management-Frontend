import axiosInstance from "@/lib/axios";
import { CreateVendorFormData } from "@/schemas/vendor.schema";
import { ApiSuccess, Vendor } from "@/types";

export const vendorService = {
    getVendors: async (): Promise<ApiSuccess<{ vendors: Vendor[] }>> => {
        const response = await axiosInstance.get("/vendors");
        return response.data;
    },

    createVendor: async (data: CreateVendorFormData): Promise<ApiSuccess<{ vendor: Vendor }>> => {
        // Only send non-empty strings
        const payload: Partial<CreateVendorFormData> = { name: data.name };
        if (data.upi_id) payload.upi_id = data.upi_id;
        if (data.bank_account) payload.bank_account = data.bank_account;
        if (data.ifsc) payload.ifsc = data.ifsc;

        const response = await axiosInstance.post("/vendors", payload);
        return response.data;
    }
};
