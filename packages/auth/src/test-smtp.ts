import "@crm/env";
import { getEmailTransporter, sendOtpEmail, verifySmtpConnection } from "./email";

async function main() {
	const recipient = process.argv[2] ?? "test@quesscorp.com";

	console.log("=== Quess CRM SMTP Diagnostic ===");
	console.log(`SMTP_HOST: ${process.env.SMTP_HOST || "(not configured)"}`);
	console.log(`SMTP_PORT: ${process.env.SMTP_PORT || "587"}`);
	console.log(`SMTP_USER: ${process.env.SMTP_USER || "(not configured)"}`);
	console.log(`SMTP_SECURE: ${process.env.SMTP_SECURE || "false"}`);
	console.log(`EMAIL_FROM: ${process.env.EMAIL_FROM || "Quess Agentic CRM <noreply@quesscorp.com>"}`);

	const transporter = getEmailTransporter();
	if (!transporter) {
		console.log("\n[STATUS] SMTP_HOST is not set. Emails log to terminal only.");
		await sendOtpEmail(recipient, "123456");
		return;
	}

	console.log("\n[1/2] Testing connection to SMTP server...");
	const verified = await verifySmtpConnection();
	if (!verified) {
		console.error("[ERROR] Could not connect or authenticate to SMTP server.");
		process.exit(1);
	}
	console.log("[SUCCESS] SMTP server connection verified.");

	console.log(`\n[2/2] Sending test email to ${recipient}...`);
	const sent = await sendOtpEmail(recipient, "849201");
	if (sent) {
		console.log(`[SUCCESS] Test email dispatched successfully to ${recipient}.`);
	} else {
		console.error("[ERROR] Failed to send email via SMTP.");
		process.exit(1);
	}
}

main().catch((error) => {
	console.error("[FATAL]", error);
	process.exit(1);
});
