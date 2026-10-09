import type { Metadata } from "next";
import { redirect, unstable_rethrow } from "next/navigation";
import { Suspense } from "react";
import { AuthHeading, AuthShell } from "@/components/auth-shell";
import { getSession } from "@/lib/session";
import { ResetPasswordForm } from "./reset-password-form";

export const metadata: Metadata = {
	title: "Reset password",
};

async function currentSession() {
	try {
		return await getSession();
	} catch (error) {
		unstable_rethrow(error);
		console.error("Reset-password: could not read the session.", error);
		return null;
	}
}

export default async function ResetPasswordPage() {
	const session = await currentSession();

	if (session) {
		redirect("/");
	}

	return (
		<AuthShell>
			<AuthHeading
				title="Create new password"
				description="Please enter your new password below."
			/>
			<Suspense fallback={null}>
				<ResetPasswordForm />
			</Suspense>
		</AuthShell>
	);
}
