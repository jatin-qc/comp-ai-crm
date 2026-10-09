import type { Metadata } from "next";
import { redirect, unstable_rethrow } from "next/navigation";
import { Suspense } from "react";
import { AuthHeading, AuthShell } from "@/components/auth-shell";
import { getSession } from "@/lib/session";
import { SignUpForm } from "./sign-up-form";

export const metadata: Metadata = {
	title: "Sign up",
};

async function currentSession() {
	try {
		return await getSession();
	} catch (error) {
		unstable_rethrow(error);
		console.error("Sign-up: could not read the session.", error);
		return null;
	}
}

export default async function SignUpPage() {
	const session = await currentSession();

	if (session) {
		redirect("/");
	}

	return (
		<AuthShell>
			<AuthHeading
				title="Get started"
				description="Create an account to access the workspace."
			/>
			<Suspense fallback={null}>
				<SignUpForm />
			</Suspense>
		</AuthShell>
	);
}
