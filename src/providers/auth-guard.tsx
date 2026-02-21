"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.replace("/login");
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen w-full flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950">
                <div className="relative flex items-center justify-center h-24 w-24 mb-6">
                    <div className="absolute inset-0 border-4 border-zinc-200 dark:border-zinc-800 rounded-full animate-ping opacity-20"></div>
                    <div className="absolute inset-2 border-4 border-zinc-300 dark:border-zinc-700 rounded-full animate-spin border-t-emerald-500 dark:border-t-emerald-500"></div>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">Payout Management</h1>
                <p className="text-sm flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Authenticating session...
                </p>
            </div>
        );
    }

    if (!user) {
        return null;
    }
    return <>{children}</>;
}
