import type { Metadata } from "next";
import { AuthHeading, AuthShell } from "@/components/auth-shell";
import { SignUpForm } from "./sign-up-form";

export const metadata: Metadata = {
	title: "Sign up",
};

export default function SignUpPage() {
	return (
		<AuthShell>
			<AuthHeading
				title="Create an account"
				description="Sign up with your work email to get started."
			/>
			<SignUpForm />
		</AuthShell>
	);
}
