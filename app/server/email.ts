import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import { render } from "@react-email/components";
import { ReactElement } from "react";
import { Resource } from "sst";

export const ses = new SESv2Client({
	region: process.env.AWS_REGION,
});

export async function sendEmail(
	to: string[],
	subject: string,
	content: ReactElement,
): Promise<void> {
	console.log("Sending email to", to);
	console.log("Subject", subject);
	const html = await render(content);
	console.log("Content", html);
	const command = new SendEmailCommand({
		FromEmailAddress: `noreply@${Resource["bread-email"].sender}`,
		Destination: {
			ToAddresses: to,
		},
		Content: {
			Simple: {
				Subject: { Data: subject, Charset: "UTF-8" },
				Body: {
					Html: { Data: html, Charset: "UTF-8" },
				},
			},
		},
	});
	await ses.send(command);
}
