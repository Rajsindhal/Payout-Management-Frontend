"use client";

import { usePayouts } from "@/hooks/usePayouts";
import { useVendors } from "@/hooks/useVendors";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreatePayoutFormData, createPayoutSchema } from "@/schemas/payout.schema";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Plus, Banknote, Loader2, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PayoutStatus } from "@/types/payout";

const statusColors: Record<PayoutStatus, string> = {
    Draft: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
    Submitted: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-500/20",
    Approved: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20",
    Rejected: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-200 dark:border-red-500/20",
};

export default function PayoutsPage() {
    const [filter, setFilter] = useState<PayoutStatus | "All">("All");
    const { payouts, isLoading, createPayout, isCreating } = usePayouts(filter === "All" ? undefined : { status: filter });
    const { vendors, isLoading: isLoadingVendors } = useVendors();
    const { user } = useAuth();
    const [open, setOpen] = useState(false);

    const form = useForm<CreatePayoutFormData>({
        resolver: zodResolver(createPayoutSchema) as any,
        defaultValues: { vendor_id: "", amount: 0, mode: "UPI" as "UPI" | "IMPS" | "NEFT" },
    });

    const onSubmit = async (data: CreatePayoutFormData) => {
        try {
            await createPayout(data);
            setOpen(false);
            form.reset();
        } catch {
            // Handled globally in usePayouts slice
        }
    };

    const hasPayoutAccess = user?.role === "OPS";

    return (
        <div className="space-y-6 max-w-7xl mx-auto h-full flex flex-col">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Payout Pipeline</h1>
                    <p className="text-zinc-500 mt-1">Orchestrate safe transitions from drafts securely to bank payouts.</p>
                </div>

                <div className="flex gap-4">
                    <Select value={filter} onValueChange={(v) => setFilter(v as PayoutStatus | "All")}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Statuses</SelectItem>
                            <SelectItem value="Draft">Drafts</SelectItem>
                            <SelectItem value="Submitted">Pending Approval</SelectItem>
                            <SelectItem value="Approved">Approved</SelectItem>
                            <SelectItem value="Rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select>

                    {hasPayoutAccess && (
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    New Draft
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Draft New Payout</DialogTitle>
                                    <DialogDescription>
                                        Link a vendor and lock in amount allocations before submission.
                                    </DialogDescription>
                                </DialogHeader>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                                        <FormField
                                            control={form.control}
                                            name="vendor_id"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Beneficiary Vendor</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder={isLoadingVendors ? "Loading vendors..." : "Select active vendor"} />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {vendors.map((vendor) => (
                                                                <SelectItem key={vendor._id} value={vendor._id}>
                                                                    {vendor.name} {vendor.bank_account ? `(${vendor.bank_account})` : ''}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="amount"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Amount (₹)</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" placeholder="0.00" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="mode"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Payment Mode</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Mode" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="UPI">UPI Transfer</SelectItem>
                                                                <SelectItem value="IMPS">IMPS Instant</SelectItem>
                                                                <SelectItem value="NEFT">NEFT Batch</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="pt-4 flex justify-end">
                                            <Button type="submit" disabled={isCreating}>
                                                {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                Save Draft
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            </div>

            <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 overflow-hidden flex-1">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
                        <Loader2 className="h-8 w-8 animate-spin mb-4" />
                        <p>Syncing pipeline state...</p>
                    </div>
                ) : payouts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-zinc-500">
                        <Banknote className="h-12 w-12 mb-4 text-zinc-300 dark:text-zinc-700" />
                        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Empty Pipeline</h3>
                        <p className="mt-1">No payouts matching this filter exist yet.</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader className="bg-zinc-50/80 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="text-xs font-semibold uppercase tracking-wider text-zinc-500 w-[120px]">Payout ID</TableHead>
                                <TableHead className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Beneficiary</TableHead>
                                <TableHead className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Routing</TableHead>
                                <TableHead className="text-xs font-semibold uppercase tracking-wider text-zinc-500 text-right">Amount (₹)</TableHead>
                                <TableHead className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Status</TableHead>
                                <TableHead className="text-xs font-semibold uppercase tracking-wider text-zinc-500 text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payouts.map((payout) => (
                                <TableRow key={payout._id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-colors cursor-pointer border-b border-zinc-100 dark:border-zinc-800/50 last:border-0" onClick={() => window.location.href = `/payouts/${payout._id}`}>
                                    <TableCell className="font-mono text-xs text-zinc-500 align-middle">
                                        <span className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md">
                                            {payout._id.slice(-8).toUpperCase()}
                                        </span>
                                    </TableCell>
                                    <TableCell className="align-middle">
                                        <div className="font-medium text-sm text-zinc-900 dark:text-zinc-100">{payout.vendor_id?.name || "Unknown Vendor"}</div>
                                        <div className="text-xs text-zinc-500 mt-0.5">{new Date(payout.createdAt).toLocaleDateString()}</div>
                                    </TableCell>
                                    <TableCell className="align-middle">
                                        <Badge variant="secondary" className="font-mono text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200">{payout.mode}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right align-middle">
                                        <div className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                                            ₹{payout.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </div>
                                    </TableCell>
                                    <TableCell className="align-middle">
                                        <Badge variant="outline" className={`${statusColors[payout.status]} border-transparent shadow-sm`}>
                                            {payout.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right align-middle">
                                        <Link href={`/payouts/${payout._id}`} onClick={(e) => e.stopPropagation()}>
                                            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-zinc-950 shadow-sm border border-zinc-200 dark:border-zinc-800">
                                                Details <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    );
}
