import type { Metadata } from "next";
import { redirect, unstable_rethrow } from "next/navigation";
import { Suspense } from "react";
import { AuthHeading, AuthShell } from "@/components/auth-shell";
import { getSession } from "@/lib/session";
import { ForgotPasswordForm } from "./forgot-password-form";

export const metadata: Metadata = {
	title: "Forgot password",
};

export const instant = false;

async function currentSession() {
	try {
		return await getSession();
	} catch (error) {
		unstable_rethrow(error);
		console.error("Forgot-password: could not read the session.", error);
		return null;
	}
}

async function ForgotPassword() {
	const session = await currentSession();

	if (session) {
		redirect("/");
	}

	return (
		<>
			<AuthHeading
				title="Reset your password"
				description="Enter your email address to receive a verification code."
			/>
			<Suspense fallback={null}>
				<ForgotPasswordForm />
			</Suspense>
		</>
	);
}

export default function ForgotPasswordPage() {
	return (
		<AuthShell>
			<Suspense fallback={null}>
				<ForgotPassword />
			</Suspense>
		</AuthShell>
	);
}
