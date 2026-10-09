import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

export function getEmailTransporter(): Transporter | null {
	const host = process.env.SMTP_HOST;
	if (!host) {
		return null;
	}

	const port = Number.parseInt(process.env.SMTP_PORT ?? "587", 10);
	const user = process.env.SMTP_USER;
	const pass = process.env.SMTP_PASS;
	const secure = process.env.SMTP_SECURE === "true" || port === 465;
	const ignoreTls = process.env.SMTP_IGNORE_TLS_ERRORS === "true";

	return nodemailer.createTransport({
		host,
		port,
		secure,
		...(user && pass ? { auth: { user, pass } } : {}),
		...(ignoreTls ? { tls: { rejectUnauthorized: false } } : {}),
	});
}

export async function verifySmtpConnection(): Promise<boolean> {
	const transporter = getEmailTransporter();
	if (!transporter) {
		return false;
	}

	try {
		await transporter.verify();
		return true;
	} catch (error) {
		console.error("SMTP verification error:", error);
		return false;
	}
}

export async function sendOtpEmail(email: string, otp: string): Promise<boolean> {
	const from = process.env.EMAIL_FROM ?? "Quess Agentic CRM <noreply-crm@quesscorp.com>";

	console.log(`\n========================================`);
	console.log(`[AUTH OTP] Password Reset Code for ${email}: ${otp}`);
	console.log(`========================================\n`);

	const transporter = getEmailTransporter();
	if (!transporter) {
		return false;
	}

	try {
		await transporter.sendMail({
			from,
			to: email,
			subject: `${otp} is your Quess CRM verification code`,
			text: `Your Quess CRM verification code is: ${otp}. It expires in 5 minutes. If you did not request this, please ignore this email.`,
			html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Quess CRM Verification Code</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 32px 16px;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center">
        <table width="100%" style="max-width: 500px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);">
          <tr>
            <td style="padding-bottom: 20px; border-bottom: 1px solid #f3f4f6;">
              <span style="font-size: 22px; font-weight: 700; color: #111827; letter-spacing: -0.5px;">QUESS</span>
              <span style="display: block; font-size: 11px; text-transform: uppercase; color: #6b7280; font-weight: 600; margin-top: 2px;">Agentic CRM</span>
            </td>
          </tr>
          <tr>
            <td style="padding-top: 24px;">
              <h1 style="font-size: 18px; font-weight: 600; color: #111827; margin: 0 0 12px 0;">Password Reset Verification</h1>
              <p style="font-size: 14px; line-height: 22px; color: #4b5563; margin: 0 0 24px 0;">We received a request to reset your password. Use the verification code below to complete the reset:</p>
              <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 24px;">
                <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #111827; font-family: monospace;">${otp}</span>
              </div>
              <p style="font-size: 13px; line-height: 20px; color: #6b7280; margin: 0 0 16px 0;">This code is valid for <strong>5 minutes</strong>. If you did not make this request, you can safely ignore this email.</p>
            </td>
          </tr>
          <tr>
            <td style="padding-top: 24px; border-top: 1px solid #f3f4f6; font-size: 12px; color: #9ca3af; text-align: center;">
              This is an automated message from Quess Corp CRM. Please do not reply directly to this email.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
		});

		console.log(`[AUTH EMAIL] Successfully delivered OTP email via SMTP to ${email}`);
		return true;
	} catch (error) {
		console.error("Failed to deliver OTP email via SMTP:", error);
		return false;
	}
}
