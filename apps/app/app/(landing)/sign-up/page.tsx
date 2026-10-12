import type { Metadata } from "next";
import { redirect, unstable_rethrow } from "next/navigation";
import { Suspense } from "react";
import { AuthHeading, AuthShell } from "@/components/auth-shell";
import { getSession } from "@/lib/session";
import { SignUpForm } from "./sign-up-form";

export const metadata: Metadata = {
	title: "Sign up",
};

export const instant = false;

async function currentSession() {
	try {
		return await getSession();
	} catch (error) {
		unstable_rethrow(error);
		console.error("Sign-up: could not read the session.", error);
		return null;
	}
}

async function SignUp() {
	const session = await currentSession();

	if (session) {
		redirect("/");
	}

	return (
		<>
			<AuthHeading
				title="Get started"
				description="Create an account to access the workspace."
			/>
			<Suspense fallback={null}>
				<SignUpForm />
			</Suspense>
		</>
	);
}

export default function SignUpPage() {
	return (
		<AuthShell>
			<Suspense fallback={null}>
				<SignUp />
			</Suspense>
		</AuthShell>
	);
}
