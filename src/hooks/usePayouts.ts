import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { payoutService } from "@/services/payout.service";
import { CreatePayoutFormData, RejectPayoutFormData } from "@/schemas/payout.schema";
import { PayoutStatus } from "@/types/payout";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ApiError } from "@/types";

export const usePayouts = (filters?: { status?: PayoutStatus }) => {
    const queryClient = useQueryClient();

    const fetchQuery = useQuery({
        queryKey: ["payouts", filters],
        queryFn: () => payoutService.getPayouts(filters),
    });

    const getPayoutQuery = (id: string) => useQuery({
        queryKey: ["payout", id],
        queryFn: () => payoutService.getPayoutById(id),
        enabled: !!id,
    });

    const createMutation = useMutation({
        mutationFn: (data: CreatePayoutFormData) => payoutService.createPayout(data),
        onSuccess: (response) => {
            toast.success("Draft Created", { description: response.message });
            queryClient.invalidateQueries({ queryKey: ["payouts"] });
        },
        onError: (err: AxiosError<ApiError>) => {
            const message = err.response?.data?.message || "Failed to create draft";
            toast.error("Creation Error", { description: message });
        }
    });

    const submitMutation = useMutation({
        mutationFn: (id: string) => payoutService.submitPayout(id),
        onSuccess: (response) => {
            toast.success("Payout Submitted", { description: response.message });
            queryClient.invalidateQueries({ queryKey: ["payouts"] });
            queryClient.invalidateQueries({ queryKey: ["payout"] });
        },
        onError: (err: AxiosError<ApiError>) => {
            const message = err.response?.data?.message || "Submission failed";
            toast.error("Pipeline Error", { description: message });
        }
    });

    const approveMutation = useMutation({
        mutationFn: (id: string) => payoutService.approvePayout(id),
        onSuccess: (response) => {
            toast.success("Payout Approved", { description: response.message });
            queryClient.invalidateQueries({ queryKey: ["payouts"] });
            queryClient.invalidateQueries({ queryKey: ["payout"] });
        },
        onError: (err: AxiosError<ApiError>) => {
            const message = err.response?.data?.message || "Approval failed";
            toast.error("Approval Error", { description: message });
        }
    });

    const rejectMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: RejectPayoutFormData }) => payoutService.rejectPayout(id, data),
        onSuccess: (response) => {
            toast.success("Payout Rejected", { description: response.message });
            queryClient.invalidateQueries({ queryKey: ["payouts"] });
            queryClient.invalidateQueries({ queryKey: ["payout"] });
        },
        onError: (err: AxiosError<ApiError>) => {
            const message = err.response?.data?.message || "Rejection logic failed";
            toast.error("Rejection Error", { description: message });
        }
    });

    return {
        payouts: fetchQuery.data?.data?.payouts || [],
        isLoading: fetchQuery.isLoading,
        error: fetchQuery.error,
        refetch: fetchQuery.refetch,

        getPayout: getPayoutQuery,

        createPayout: createMutation.mutateAsync,
        isCreating: createMutation.isPending,

        submitPayout: submitMutation.mutateAsync,
        isSubmitting: submitMutation.isPending,

        approvePayout: approveMutation.mutateAsync,
        isApproving: approveMutation.isPending,

        rejectPayout: rejectMutation.mutateAsync,
        isRejecting: rejectMutation.isPending,
    };
};
