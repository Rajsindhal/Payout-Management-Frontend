import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { vendorService } from "@/services/vendor.service";
import { CreateVendorFormData } from "@/schemas/vendor.schema";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ApiError } from "@/types";

export const useVendors = () => {
    const queryClient = useQueryClient();

    const fetchQuery = useQuery({
        queryKey: ["vendors"],
        queryFn: vendorService.getVendors,
    });

    const createMutation = useMutation({
        mutationFn: (data: CreateVendorFormData) => vendorService.createVendor(data),
        onSuccess: (response) => {
            toast.success("Vendor created", { description: response.message });
            queryClient.invalidateQueries({ queryKey: ["vendors"] });
        },
        onError: (err: AxiosError<ApiError>) => {
            const message = err.response?.data?.message || "Failed to create vendor";
            toast.error("Vendor Creation Error", { description: message });
        },
    });

    return {
        vendors: fetchQuery.data?.data?.vendors || [],
        isLoading: fetchQuery.isLoading,
        error: fetchQuery.error,
        createVendor: createMutation.mutateAsync,
        isCreating: createMutation.isPending,
    };
};
