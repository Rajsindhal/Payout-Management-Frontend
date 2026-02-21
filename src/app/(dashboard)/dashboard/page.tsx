"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useVendors } from "@/hooks/useVendors";
import { usePayouts } from "@/hooks/usePayouts";
import { Building2, Clock, Loader2 } from "lucide-react";

export default function DashboardPage() {
    const { vendors, isLoading: isLoadingVendors } = useVendors();
    const { payouts, isLoading: isLoadingPayouts } = usePayouts();

    const pendingApprovals = payouts.filter((p) => p.status === "Submitted").length;

    const isLoading = isLoadingVendors || isLoadingPayouts;

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
                <p className="text-zinc-500 mt-2">
                    Welcome to the Payout Management portal.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="relative overflow-hidden group hover:shadow-md transition-all border-zinc-200 dark:border-zinc-800">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-950/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                        <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Total Vendors</CardTitle>
                        <Building2 className="h-4 w-4 text-zinc-400" />
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-3xl font-bold font-sans">
                            {isLoading ? <Loader2 className="h-5 w-5 animate-spin mt-1" /> : vendors.length}
                        </div>
                        <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
                            <span className="text-emerald-500 font-medium">+ New</span> active partners
                        </p>
                    </CardContent>
                </Card>
                <Card className="relative overflow-hidden group hover:shadow-md transition-all border-amber-200/50 dark:border-amber-900/50">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-transparent dark:from-amber-950/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                        <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-500">Pending Approvals</CardTitle>
                        <Clock className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-3xl font-bold text-amber-600 dark:text-amber-500 font-sans">
                            {isLoading ? <Loader2 className="h-5 w-5 animate-spin mt-1" /> : pendingApprovals}
                        </div>
                        <p className="text-xs text-amber-600/70 dark:text-amber-500/70 mt-1">Requires finance attention</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
