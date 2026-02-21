import { AuthGuard } from "@/providers/auth-guard";
import { Sidebar } from "@/components/shared/Sidebar";
import { Header } from "@/components/shared/Header";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard>
            <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col md:flex-row">
                <Sidebar />

                <main className="flex-1 flex flex-col h-screen overflow-hidden">
                    <Header />

                    {/* Page Content Render Block */}
                    <section className="p-6 flex-1 overflow-auto bg-zinc-50/50 dark:bg-zinc-950/50">
                        {children}
                    </section>
                </main>
            </div>
        </AuthGuard>
    );
}
