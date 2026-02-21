"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/schemas/auth.schema";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const { login, isLoggingIn, user, isLoading } = useAuth();
    const router = useRouter();

    // Already authenticated? Instantly bypass login.
    useEffect(() => {
        if (!isLoading && user) {
            router.replace("/dashboard");
        }
    }, [user, isLoading, router]);

    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });

    const onSubmit = (data: LoginFormData) => login(data);

    if (isLoading || user) return null; // Prevent flash of login while getting auth state

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
            <Card className="w-full max-w-md shadow-lg border-zinc-200 dark:border-zinc-800">
                <CardHeader className="space-y-2 text-center pb-6">
                    <CardTitle className="text-3xl font-bold tracking-tight">Access Portal</CardTitle>
                    <CardDescription className="text-zinc-500">
                        Secure payouts management system
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-semibold text-zinc-900 dark:text-zinc-100">Email Address</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="h-11"
                                                type="email"
                                                placeholder="ops@demo.com"
                                                autoComplete="email"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-semibold text-zinc-900 dark:text-zinc-100">Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="h-11"
                                                type="password"
                                                placeholder="••••••••"
                                                autoComplete="current-password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={isLoggingIn}>
                                {isLoggingIn ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Authenticating...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </Form>

                    {/* Developer Mock Context */}
                    <div className="mt-8 text-xs text-center text-zinc-500 flex flex-col items-center">
                        <p className="mb-2 font-medium">Demo Testing Credentials:</p>
                        <div className="flex flex-col space-y-2 bg-zinc-100 dark:bg-zinc-900/50 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 w-full text-left">
                            <div className="flex justify-between">
                                <span className="font-semibold text-zinc-700 dark:text-zinc-300">OPS:</span>
                                <code>ops@demo.com / ops123</code>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold text-zinc-700 dark:text-zinc-300">FINANCE:</span>
                                <code>finance@demo.com / fin123</code>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
