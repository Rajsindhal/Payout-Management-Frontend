import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { LoginFormData } from "@/schemas/auth.schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ApiError } from "@/types";
import { AxiosError } from "axios";
import { useAppStore } from "@/lib/store";
import { useEffect } from "react";

export const useAuth = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    const setUser = useAppStore((state) => state.setUser);

    const { data, isLoading, error } = useQuery({
        queryKey: ["authUser"],
        queryFn: authService.getMe,
        retry: false,
    });

    // Sync React Query cache into Zustand automatically
    useEffect(() => {
        if (data?.data?.user) {
            setUser(data.data.user);
        } else if (!isLoading) {
            setUser(null);
        }
    }, [data, isLoading, setUser]);

    const loginMutation = useMutation({
        mutationFn: (data: LoginFormData) => authService.login(data),
        onSuccess: (response) => {
            queryClient.setQueryData(["authUser"], response);
            toast.success("Welcome back!", { description: response.message });
            router.push("/dashboard");
        },
        onError: (err: AxiosError<ApiError>) => {
            const message = err.response?.data?.message || "Login failed";
            toast.error("Authentication Error", { description: message });
        },
    });

    const logoutMutation = useMutation({
        mutationFn: authService.logout,
        onSuccess: () => {
            queryClient.setQueryData(["authUser"], null);
            queryClient.clear();
            setUser(null);
            toast.success("Logged out successfully");
            router.push("/login");
        },
        onError: () => {
            toast.error("Logout failed", { description: "Something went wrong" });
        }
    });

    return {
        user: data?.data?.user || null,
        isLoading,
        error,
        login: loginMutation.mutate,
        isLoggingIn: loginMutation.isPending,
        logout: logoutMutation.mutate,
        isLoggingOut: loginMutation.isPending,
    };
};
