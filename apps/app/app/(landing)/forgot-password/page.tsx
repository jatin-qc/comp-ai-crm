import type { Metadata } from "next";
import { AuthHeading, AuthShell } from "@/components/auth-shell";
import { ForgotPasswordForm } from "./forgot-password-form";

export const metadata: Metadata = {
	title: "Forgot password",
};

export default function ForgotPasswordPage() {
	return (
		<AuthShell>
			<AuthHeading
				title="Reset your password"
				description="Enter your email address and we will send you a link to reset your password."
			/>
			<ForgotPasswordForm />
		</AuthShell>
	);
}
