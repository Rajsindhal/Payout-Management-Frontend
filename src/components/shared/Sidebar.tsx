"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { Users, Banknote, LayoutDashboard, Menu } from "lucide-react";

export function Sidebar() {
    const pathname = usePathname();
    const user = useAppStore((state) => state.user);
    const isSidebarOpen = useAppStore((state) => state.isSidebarOpen);
    const closeSidebar = useAppStore((state) => state.closeSidebar);

    const links = [
        { href: "/dashboard", label: "Overview", icon: LayoutDashboard, roles: ["OPS", "FINANCE"] },
        { href: "/vendors", label: "Vendors", icon: Users, roles: ["OPS", "FINANCE"] },
        { href: "/payouts", label: "Payouts Pipeline", icon: Banknote, roles: ["OPS", "FINANCE"] },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden" 
                    onClick={closeSidebar}
                />
            )}

            {/* Main Sidebar Configuration */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 border-r bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 flex flex-col min-h-screen transition-transform duration-200 ease-in-out md:relative md:translate-x-0 md:flex",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
            <div className="p-6 h-16 flex items-center border-b border-zinc-200 dark:border-zinc-800">
                <h1 className="font-bold text-lg tracking-tight text-zinc-900 dark:text-zinc-100">
                    Payout Manager
                </h1>
            </div>
            <nav className="flex-1 p-4 space-y-1">
                {links.map((link) => {
                    if (!user || !link.roles.includes(user.role)) return null;

                    const isActive = pathname.startsWith(link.href) && (link.href !== "/dashboard" || pathname === "/dashboard");

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                                    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:text-zinc-50 dark:hover:bg-zinc-800/50"
                            )}
                        >
                            <link.icon className="h-4 w-4" />
                            {link.label}
                        </Link>
                    );
                })}
            </nav>
            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
                <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-md border border-zinc-200 dark:border-zinc-800 flex flex-col text-sm">
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">Role Identity</span>
                    <span className="text-zinc-500 font-mono mt-1">{user?.role}</span>
                </div>
            </div>
        </aside>
        </>
    );
}
