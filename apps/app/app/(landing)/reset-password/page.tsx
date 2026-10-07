import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthHeading, AuthShell } from "@/components/auth-shell";
import { ResetPasswordForm } from "./reset-password-form";

export const metadata: Metadata = {
	title: "Reset password",
};

export default function ResetPasswordPage() {
	return (
		<AuthShell>
			<AuthHeading
				title="Create new password"
				description="Please enter your new password below."
			/>
			<Suspense fallback={<div>Loading...</div>}>
				<ResetPasswordForm />
			</Suspense>
		</AuthShell>
	);
}
