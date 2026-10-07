"use client";

import { signUp } from "@crm/auth/client";
import { Button } from "@crm/ui/components/button";
import { Input } from "@crm/ui/components/input";
import { Label } from "@crm/ui/components/label";
import { Spinner } from "@crm/ui/components/spinner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function SignUpForm() {
	const router = useRouter();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [pending, setPending] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!name || !email || !password || !confirmPassword) {
			toast.error("Please fill in all fields.");
			return;
		}

		if (password !== confirmPassword) {
			toast.error("Passwords do not match.");
			return;
		}

		if (password.length < 8) {
			toast.error("Password must be at least 8 characters long.");
			return;
		}

		setPending(true);
		try {
			const res = await signUp.email({
				name: name.trim(),
				email: email.trim().toLowerCase(),
				password,
			});

			if (res.error) {
				toast.error(res.error.message ?? "Failed to create account.");
			} else {
				toast.success("Account created successfully!");
				router.push("/");
				router.refresh();
			}
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Failed to sign up.",
			);
		} finally {
			setPending(false);
		}
	}

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
			<div className="flex flex-col gap-1.5">
				<Label htmlFor="signup-name">Full Name</Label>
				<Input
					id="signup-name"
					type="text"
					placeholder="John Doe"
					value={name}
					onChange={(e) => setName(e.target.value)}
					disabled={pending}
					required
					autoComplete="name"
				/>
			</div>

			<div className="flex flex-col gap-1.5">
				<Label htmlFor="signup-email">Email Address</Label>
				<Input
					id="signup-email"
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
				<Label htmlFor="signup-password">Password</Label>
				<Input
					id="signup-password"
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
				<Label htmlFor="signup-confirm-password">Confirm Password</Label>
				<Input
					id="signup-confirm-password"
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
				Create Account
			</Button>

			<div className="text-center mt-2 text-xs text-muted-foreground">
				Already have an account?{" "}
				<Link
					href="/sign-in"
					className="text-foreground underline-offset-4 hover:underline font-medium"
				>
					Sign In
				</Link>
			</div>
		</form>
	);
}
