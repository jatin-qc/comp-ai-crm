"use client";

import { authClient } from "@crm/auth/client";
import { Button } from "@crm/ui/components/button";
import { Input } from "@crm/ui/components/input";
import { Label } from "@crm/ui/components/label";
import { Spinner } from "@crm/ui/components/spinner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function ForgotPasswordForm() {
	const router = useRouter();
	const [step, setStep] = useState<"email" | "otp">("email");
	const [email, setEmail] = useState("");
	const [otp, setOtp] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [pending, setPending] = useState(false);
	const [resending, setResending] = useState(false);

	async function handleSendOtp(e: React.FormEvent) {
		e.preventDefault();

		const cleanEmail = email.trim().toLowerCase();
		if (!cleanEmail) {
			toast.error("Please enter your email address.");
			return;
		}

		setPending(true);
		try {
			const res = await authClient.emailOtp.sendVerificationOtp({
				email: cleanEmail,
				type: "forget-password",
			});

			if (res.error) {
				toast.error(res.error.message ?? "Could not send verification code.");
			} else {
				setStep("otp");
				toast.success("Verification code sent to your email!");
			}
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Could not send verification code.",
			);
		} finally {
			setPending(false);
		}
	}

	async function handleResendOtp() {
		const cleanEmail = email.trim().toLowerCase();
		if (!cleanEmail) return;

		setResending(true);
		try {
			const res = await authClient.emailOtp.sendVerificationOtp({
				email: cleanEmail,
				type: "forget-password",
			});

			if (res.error) {
				toast.error(res.error.message ?? "Could not resend code.");
			} else {
				toast.success("New verification code sent!");
			}
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Could not resend code.",
			);
		} finally {
			setResending(false);
		}
	}

	async function handleResetPassword(e: React.FormEvent) {
		e.preventDefault();

		const cleanOtp = otp.trim();
		if (!cleanOtp) {
			toast.error("Please enter the verification code.");
			return;
		}

		if (password.length < 8) {
			toast.error("Password must be at least 8 characters long.");
			return;
		}

		if (password !== confirmPassword) {
			toast.error("Passwords do not match.");
			return;
		}

		setPending(true);
		try {
			const res = await authClient.emailOtp.resetPassword({
				email: email.trim().toLowerCase(),
				otp: cleanOtp,
				password,
			});

			if (res.error) {
				toast.error(res.error.message ?? "Invalid or expired code.");
			} else {
				toast.success("Password reset successfully! Please sign in.");
				router.push("/sign-in");
			}
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Could not reset password.",
			);
		} finally {
			setPending(false);
		}
	}

	if (step === "otp") {
		return (
			<form onSubmit={handleResetPassword} className="flex flex-col gap-3 w-full">
				<div className="rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground flex items-center justify-between">
					<span>
						Code sent to <strong className="text-foreground">{email}</strong>
					</span>
					<button
						type="button"
						onClick={() => {
							setStep("email");
							setOtp("");
						}}
						className="text-foreground underline underline-offset-4 hover:text-primary transition-colors"
					>
						Change
					</button>
				</div>

				<div className="flex flex-col gap-1.5">
					<Label htmlFor="reset-otp">Verification Code (OTP)</Label>
					<Input
						id="reset-otp"
						type="text"
						inputMode="numeric"
						placeholder="123456"
						value={otp}
						onChange={(e) => setOtp(e.target.value)}
						disabled={pending}
						required
						autoFocus
						autoComplete="one-time-code"
						className="tracking-widest font-mono text-center text-lg"
					/>
				</div>

				<div className="flex flex-col gap-1.5">
					<Label htmlFor="reset-password">New Password</Label>
					<Input
						id="reset-password"
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

				<Button type="submit" disabled={pending} className="w-full mt-1">
					{pending ? <Spinner data-icon="inline-start" /> : null}
					Reset Password
				</Button>

				<div className="flex items-center justify-between text-xs mt-2">
					<button
						type="button"
						onClick={handleResendOtp}
						disabled={resending || pending}
						className="text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
					>
						{resending ? "Sending..." : "Resend code"}
					</button>

					<Link
						href="/sign-in"
						className="text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
					>
						Back to Sign In
					</Link>
				</div>
			</form>
		);
	}

	return (
		<form onSubmit={handleSendOtp} className="flex flex-col gap-3 w-full">
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
					autoFocus
					autoComplete="email"
				/>
			</div>

			<Button type="submit" disabled={pending} className="w-full mt-2">
				{pending ? <Spinner data-icon="inline-start" /> : null}
				Send Verification Code
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
