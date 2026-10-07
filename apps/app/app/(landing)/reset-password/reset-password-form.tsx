"use client";

import { authClient } from "@crm/auth/client";
import { Button } from "@crm/ui/components/button";
import { Input } from "@crm/ui/components/input";
import { Label } from "@crm/ui/components/label";
import { Spinner } from "@crm/ui/components/spinner";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function ResetPasswordForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const token = searchParams.get("token");

	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [pending, setPending] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!password || !confirmPassword) {
			toast.error("Please fill in all fields.");
			return;
		}

		if (password !== confirmPassword) {
			toast.error("Passwords do not match.");
			return;
		}

		if (password.length < 8) {
			toast.error("Password must be at least 8 characters.");
			return;
		}

		if (!token) {
			toast.error("Reset token is missing or invalid.");
			return;
		}

		setPending(true);
		try {
			const res = await authClient.resetPassword({
				newPassword: password,
				token,
			});

			if (res.error) {
				toast.error(res.error.message ?? "Could not reset password.");
			} else {
				toast.success("Password updated successfully! Please sign in.");
				router.push("/sign-in");
			}
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Could not reset password.",
			);
		} finally {
			setPending(false);
		}
	}

	if (!token) {
		return (
			<div className="flex flex-col gap-4 text-center">
				<p className="text-sm text-destructive">
					Invalid or missing password reset token.
				</p>
				<Button asChild variant="outline" className="w-full">
					<Link href="/forgot-password">Request New Reset Link</Link>
				</Button>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
			<div className="flex flex-col gap-1.5">
				<Label htmlFor="reset-new-password">New Password</Label>
				<Input
					id="reset-new-password"
					type="password"
					placeholder="••••••••"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					disabled={pending}
					required
					autoComplete="new-password"
				/>
			</div>

			<div className="flex flex-col gap-1.5">
				<Label htmlFor="reset-confirm-password">Confirm New Password</Label>
				<Input
					id="reset-confirm-password"
					type="password"
					placeholder="••••••••"
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
					disabled={pending}
					required
					autoComplete="new-password"
				/>
			</div>

			<Button type="submit" disabled={pending} className="w-full mt-2">
				{pending ? <Spinner data-icon="inline-start" /> : null}
				Update Password
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
