import axiosInstance from "@/lib/axios";
import { LoginFormData } from "@/schemas/auth.schema";
import { ApiSuccess, User } from "@/types";

export const authService = {
    login: async (data: LoginFormData): Promise<ApiSuccess<{ user: User }>> => {
        const response = await axiosInstance.post("/auth/login", data);
        return response.data;
    },

    logout: async (): Promise<ApiSuccess> => {
        const response = await axiosInstance.post("/auth/logout");
        return response.data;
    },

    getMe: async (): Promise<ApiSuccess<{ user: User }>> => {
        const response = await axiosInstance.get("/auth/me");
        return response.data;
    }
};
