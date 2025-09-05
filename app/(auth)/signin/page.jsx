"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Code2, Gamepad2, Trophy, Zap, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

export function SignIn() {
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "authenticated" && session) {
            router.push("/dashboard");
        }
    }, [status, session, router]);

    if (status === "loading") {
        return (
            <div className="min-h-screen w-full bg-gradient-to-br from-[#0F2027] via-[#2C5364] to-[#2C5364] flex justify-center items-center">
                <div className="text-slate-100">Loading...</div>
            </div>
        );
    }

    if (status === "authenticated") {
        return null;
    }

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();

    const handleSignIn = async (data) => {
        const result = await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: true,
            callbackUrl: "/dashboard",
        });

        return result;
    };

    const handleGoogleSignIn = async () => {
        try {
            await signIn("google", { callbackUrl: "/dashboard" });
        } catch (error) {
            console.error("Google sign in error:", error);
        }
    };

    const handleGithubSignIn = async () => {
        try {
            await signIn("github", { callbackUrl: "/dashboard" });
        } catch (error) {
            console.error("GitHub sign in error:", error);
        }
    };

    const handleSignUp = () => {
        router.push("/signup");
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 flex justify-center items-center p-4 relative overflow-hidden">
            {/* Subtle background elements */}
            <div className="absolute inset-0 overflow-hidden z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-slate-600/3 rounded-full blur-3xl"></div>
            </div>

            {/* Minimal floating icons */}
            <div className="absolute top-20 left-20 text-slate-300/20 z-10 pointer-events-none" aria-hidden>
                <Code2 size={24} />
            </div>
            <div className="absolute top-32 right-32 text-slate-300/20 z-10 pointer-events-none" aria-hidden>
                <Gamepad2 size={20} />
            </div>
            <div className="absolute bottom-32 left-32 text-slate-300/20 z-10 pointer-events-none" aria-hidden>
                <Trophy size={22} />
            </div>
            <div className="absolute bottom-20 right-20 text-slate-300/20 z-10 pointer-events-none" aria-hidden>
                <Zap size={18} />
            </div>

            <Card className="w-full max-w-md bg-slate-900/95 backdrop-blur-xl border border-slate-800/50 shadow-2xl relative z-10">
                <CardHeader className="space-y-3 pb-4 text-center">
                    <div className="space-y-1">
                        <CardTitle className="text-xl font-semibold text-slate-100">
                            Sign in to your account
                        </CardTitle>
                        <CardDescription className="text-slate-400 text-sm">
                            Access your coding workspace and continue learning
                        </CardDescription>
                    </div>
                </CardHeader>

                <form onSubmit={handleSubmit(handleSignIn)}>
                    <CardContent className="space-y-3">
                        <div className="space-y-3">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="email"
                                    className="text-slate-300 font-medium text-sm"
                                >
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    {...register("email", { required: true })}
                                    className="h-10 bg-slate-800/50 border-slate-700/50 text-slate-100 placeholder:text-slate-500 focus:bg-slate-800/80 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
                                />
                                {errors.email && (
                                    <p className="text-red-400 text-xs">Email is required</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label
                                        htmlFor="password"
                                        className="text-slate-300 font-medium text-sm"
                                    >
                                        Password
                                    </Label>
                                    <button
                                        type="button"
                                        className="text-xs text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        {...register("password", { required: true })}
                                        className="h-10 bg-slate-800/50 border-slate-700/50 text-slate-100 placeholder:text-slate-500 focus:bg-slate-800/80 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all pr-10"
                                    />
                                    {errors.password && (
                                        <p className="text-red-400 text-xs">Password is required</p>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-3 pt-3">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-200"
                        >
                            {isSubmitting ? "Signing in..." : "Sign in"}
                        </Button>

                        <div className="flex justify-center">
                            <Button
                                variant="link"
                                onClick={handleSignUp}
                                className="text-blue-400 hover:text-blue-300 font-medium p-0 h-auto text-sm transition-colors"
                            >
                                Don't have an account? Sign up
                            </Button>
                        </div>

                        <div className="relative w-full">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-700/50" />
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="bg-slate-900 px-2 text-slate-500">
                                    or continue with
                                </span>
                            </div>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleGoogleSignIn}
                            className="w-full h-10 bg-slate-800/50 border-slate-700/50 text-slate-200 hover:text-slate-200 hover:bg-slate-800/50 hover:border-slate-700/50 transition-all duration-200"
                        >
                            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                                <path
                                    fill="#4285f4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34a853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#fbbc05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="#ea4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            Continue with Google
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleGithubSignIn}
                            className="w-full h-10 bg-slate-800/50 border-slate-700/50 text-slate-200 hover:text-slate-200 hover:bg-slate-800/50 hover:border-slate-700/50 transition-all duration-200"
                        >
                            <svg
                                className="w-4 h-4 mr-2"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                            Continue with GitHub
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}

export default SignIn;
