"use client";

import { usePayouts } from "@/hooks/usePayouts";
import { useAuth } from "@/hooks/useAuth";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RejectPayoutFormData, rejectPayoutSchema } from "@/schemas/payout.schema";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowLeft, Send, CheckCircle, XCircle, FileText, Activity } from "lucide-react";
import Link from "next/link";
import { PayoutStatus, PayoutAudit } from "@/types/payout";

const statusColors: Record<PayoutStatus, string> = {
    Draft: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
    Submitted: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-500/20",
    Approved: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20",
    Rejected: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-200 dark:border-red-500/20",
};

export default function PayoutDetailPage() {
    const params = useParams();
    const router = useRouter();
    const payoutId = params.id as string;
    const { user } = useAuth();
    const { getPayout, submitPayout, approvePayout, rejectPayout, isSubmitting, isApproving, isRejecting } = usePayouts();

    const { data, isLoading } = getPayout(payoutId);
    const payout = data?.data?.payout;
    const auditTrail: PayoutAudit[] = (data?.data as any)?.auditTrail || (data?.data as any)?.audits || [];

    const [rejectOpen, setRejectOpen] = useState(false);

    const rejectForm = useForm<RejectPayoutFormData>({
        resolver: zodResolver(rejectPayoutSchema) as any,
        defaultValues: { decision_reason: "" },
    });

    const onRejectSubmit = async (data: RejectPayoutFormData) => {
        try {
            await rejectPayout({ id: payoutId, data });
            setRejectOpen(false);
            rejectForm.reset();
        } catch {
            // Handled globally
        }
    };

    const handleApprove = async () => {
        try {
            await approvePayout(payoutId);
        } catch {
            // Error handled globally
        }
    };

    const handleSubmit = async () => {
        try {
            await submitPayout(payoutId);
        } catch {
            // Error handled globally
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-500 mb-4" />
                <p className="text-zinc-500">Loading details...</p>
            </div>
        );
    }

    if (!payout) {
        return (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
                <h2 className="text-xl font-bold">Payout not found</h2>
                <Link href="/payouts"><Button variant="outline">Back to list</Button></Link>
            </div>
        )
    }

    const isOps = user?.role === "OPS";
    const isFinance = user?.role === "FINANCE";
    const status = payout.status as PayoutStatus;

    const canSubmit = isOps && status === "Draft";
    const canApproveReject = isFinance && status === "Submitted";

    return (
        <div className="space-y-6 max-w-5xl mx-auto h-full overflow-auto pb-10">
            <div className="flex items-center space-x-4 mb-4">
                <Link href="/payouts">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-3">
                        Payout #{payout._id.slice(-8).toUpperCase()}
                        <Badge variant="outline" className={statusColors[status]}>
                            {status}
                        </Badge>
                    </h1>
                    <p className="text-zinc-500 text-sm mt-1">
                        Created on {new Date(payout.createdAt).toLocaleDateString()}
                    </p>
                </div>

                <div className="ml-auto flex items-center space-x-2">
                    {canSubmit && (
                        <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
                            {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                            Submit Payout
                        </Button>
                    )}

                    {canApproveReject && (
                        <>
                            <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="destructive" className="bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 border border-transparent shadow-none">
                                        {isRejecting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <XCircle className="h-4 w-4 mr-2" />}
                                        Reject
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Reject Payout</DialogTitle>
                                        <DialogDescription>
                                            Provide a mandatory reason for rejecting this payout. The internal OPS team will be notified to review the draft.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <Form {...rejectForm}>
                                        <form onSubmit={rejectForm.handleSubmit(onRejectSubmit)} className="space-y-4 pt-4">
                                            <FormField
                                                control={rejectForm.control}
                                                name="decision_reason"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Reason for rejection</FormLabel>
                                                        <FormControl>
                                                            <Textarea placeholder="e.g. Disputed amount, invoice mismatch..." {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <div className="flex justify-end">
                                                <Button type="submit" variant="destructive" disabled={isRejecting}>
                                                    {isRejecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                    Confirm Rejection
                                                </Button>
                                            </div>
                                        </form>
                                    </Form>
                                </DialogContent>
                            </Dialog>

                            <Button onClick={handleApprove} disabled={isApproving} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                {isApproving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                                Approve & Disburse
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
                        <h3 className="font-semibold text-lg flex items-center gap-2 mb-6">
                            <FileText className="h-5 w-5 text-zinc-500" />
                            Transfer Details
                        </h3>

                        <div className="grid grid-cols-2 gap-y-6 gap-x-4 text-sm">
                            <div>
                                <span className="block text-zinc-500 mb-1">Total Amount</span>
                                <span className="font-medium text-lg">₹{payout.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div>
                                <span className="block text-zinc-500 mb-1">Payment Mode</span>
                                <Badge variant="secondary" className="font-mono">{payout.mode}</Badge>
                            </div>
                            <div className="col-span-2 bg-zinc-50 dark:bg-zinc-950 p-4 rounded-lg border border-zinc-100 dark:border-zinc-800 mt-2">
                                <span className="block text-zinc-500 mb-2 font-medium">Beneficiary Information</span>
                                <div className="space-y-2">
                                    <p className="flex justify-between">
                                        <span className="text-zinc-500 text-xs">Name:</span>
                                        <span className="font-medium text-right">{payout.vendor_id?.name || "Unknown"}</span>
                                    </p>
                                    {payout.vendor_id?.bank_account && (
                                        <p className="flex justify-between">
                                            <span className="text-zinc-500 text-xs">Bank Account:</span>
                                            <span className="font-mono text-xs text-right bg-zinc-200/50 dark:bg-zinc-800 px-1 rounded">{payout.vendor_id.bank_account}</span>
                                        </p>
                                    )}
                                    {payout.vendor_id?.ifsc && (
                                        <p className="flex justify-between">
                                            <span className="text-zinc-500 text-xs">IFSC Code:</span>
                                            <span className="font-mono text-xs text-right bg-zinc-200/50 dark:bg-zinc-800 px-1 rounded">{payout.vendor_id.ifsc}</span>
                                        </p>
                                    )}
                                    {payout.vendor_id?.upi_id && (
                                        <p className="flex justify-between">
                                            <span className="text-zinc-500 text-xs">UPI ID:</span>
                                            <span className="font-mono text-xs text-right bg-zinc-200/50 dark:bg-zinc-800 px-1 rounded">{payout.vendor_id.upi_id}</span>
                                        </p>
                                    )}
                                </div>
                            </div>

                            {payout.note && (
                                <div className="col-span-2">
                                    <span className="block text-zinc-500 mb-1">Operation Note</span>
                                    <p className="text-zinc-700 dark:text-zinc-300 italic">"{payout.note}"</p>
                                </div>
                            )}

                            {payout.decision_reason && (
                                <div className="col-span-2 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-900 rounded-lg p-3">
                                    <span className="block text-red-600 dark:text-red-400 font-medium mb-1 flex items-center gap-1.5"><XCircle className="h-3 w-3" /> Rejection Reason</span>
                                    <p className="text-red-800 dark:text-red-300">{payout.decision_reason}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
                        <h3 className="font-semibold text-lg flex items-center gap-2 mb-6">
                            <Activity className="h-5 w-5 text-zinc-500" />
                            Audit Trail
                        </h3>

                        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-200 dark:before:via-zinc-800 before:to-transparent">
                            {auditTrail.map((audit, index) => (
                                <div key={audit._id || index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                    <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-white dark:border-zinc-950 bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-300 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                        <div className="w-1.5 h-1.5 bg-current rounded-full"></div>
                                    </div>

                                    <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm ml-4 md:ml-0 md:group-odd:text-right relative">
                                        <div className="flex flex-col md:group-even:items-start md:group-odd:items-end mb-1">
                                            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{audit.action}</span>
                                            <span className="text-[10px] text-zinc-400">{new Date(audit.createdAt).toLocaleString()}</span>
                                        </div>
                                        <p className="text-sm font-medium">{audit.performer_name}</p>
                                        {audit.note && <p className="text-xs text-zinc-500 mt-1 italic">{audit.note}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
