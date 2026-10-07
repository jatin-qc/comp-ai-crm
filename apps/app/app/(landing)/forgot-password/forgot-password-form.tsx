"use client";

import { authClient } from "@crm/auth/client";
import { Button } from "@crm/ui/components/button";
import { Input } from "@crm/ui/components/input";
import { Label } from "@crm/ui/components/label";
import { Spinner } from "@crm/ui/components/spinner";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export function ForgotPasswordForm() {
	const [email, setEmail] = useState("");
	const [pending, setPending] = useState(false);
	const [submitted, setSubmitted] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!email) {
			toast.error("Please enter your email address.");
			return;
		}

		setPending(true);
		try {
			const res = await authClient.requestPasswordReset({
				email: email.trim().toLowerCase(),
				redirectTo: `${window.location.origin}/reset-password`,
			});

			if (res.error) {
				toast.error(res.error.message ?? "Could not request password reset.");
			} else {
				setSubmitted(true);
				toast.success("Password reset request sent!");
			}
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Could not request password reset.",
			);
		} finally {
			setPending(false);
		}
	}

	if (submitted) {
		return (
			<div className="flex flex-col gap-4 text-center">
				<p className="text-sm text-muted-foreground">
					If an account exists for <strong className="text-foreground">{email}</strong>, we have sent instructions to reset your password.
				</p>
				<Button asChild variant="outline" className="w-full">
					<Link href="/sign-in">Return to Sign In</Link>
				</Button>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
			<div className="flex flex-col gap-1.5">
				<Label htmlFor="forgot-email">Email Address</Label>
				<Input
					id="forgot-email"
					type="email"
					placeholder="name@example.com"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					disabled={pending}
					required
					autoComplete="email"
				/>
			</div>

			<Button type="submit" disabled={pending} className="w-full mt-2">
				{pending ? <Spinner data-icon="inline-start" /> : null}
				Send Reset Link
			</Button>

			<div className="text-center mt-2">
				<Link
					href="/sign-in"
					className="text-xs text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
				>
					Back to Sign In
				</Link>
			</div>
		</form>
	);
}
