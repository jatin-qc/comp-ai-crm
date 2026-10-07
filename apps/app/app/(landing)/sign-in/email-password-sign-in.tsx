"use client";

import { authClient, signIn } from "@crm/auth/client";
import { Button } from "@crm/ui/components/button";
import { Input } from "@crm/ui/components/input";
import { Label } from "@crm/ui/components/label";
import { Spinner } from "@crm/ui/components/spinner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function EmailPasswordSignIn() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [pending, setPending] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!email || !password) {
			toast.error("Please enter both email and password.");
			return;
		}

		setPending(true);
		try {
			const res = await signIn.email({
				email: email.trim().toLowerCase(),
				password,
			});

			if (res.error) {
				toast.error(res.error.message ?? "Invalid email or password.");
			} else {
				toast.success("Signed in successfully!");
				router.push("/");
				router.refresh();
			}
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Could not sign in with email and password.",
			);
		} finally {
			setPending(false);
		}
	}

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
			<div className="flex flex-col gap-1.5">
				<Label htmlFor="signin-email">Email</Label>
				<Input
					id="signin-email"
					type="email"
					placeholder="name@example.com"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					disabled={pending}
					required
					autoComplete="email"
				/>
			</div>

			<div className="flex flex-col gap-1.5">
				<div className="flex items-center justify-between">
					<Label htmlFor="signin-password">Password</Label>
					<Link
						href="/forgot-password"
						className="text-xs text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
					>
						Forgot password?
					</Link>
				</div>
				<Input
					id="signin-password"
					type="password"
					placeholder="••••••••"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					disabled={pending}
					required
					autoComplete="current-password"
				/>
			</div>

			<Button type="submit" disabled={pending} className="w-full mt-1">
				{pending ? <Spinner data-icon="inline-start" /> : null}
				Sign In
			</Button>

			<div className="text-center mt-2 text-xs text-muted-foreground">
				Don&apos;t have an account?{" "}
				<Link
					href="/sign-up"
					className="text-foreground underline-offset-4 hover:underline font-medium"
				>
					Sign Up
				</Link>
			</div>
		</form>
	);
}
