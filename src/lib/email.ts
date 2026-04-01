import "server-only";

import { Resend } from "resend";

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }
  return new Resend(apiKey);
}

type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  const resend = getResendClient();

  const { error } = await resend.emails.send({
    from: "Tajine2Go <noreply@tajine2go.be>",
    to,
    subject,
    html,
  });

  if (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
}

export function orderConfirmationHtml(params: {
  orderNumber: string;
  customerName: string;
  totalFormatted: string;
  fulfillment: string;
  pickupSlot: string | null;
  statusUrl: string;
}) {
  return `
    <div style="font-family: 'Source Sans 3', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #D97B1A; font-family: 'Bebas Neue', sans-serif; font-size: 28px;">Tajine2Go</h1>
      <h2 style="color: #2D1B0A;">Bedankt voor je bestelling!</h2>
      <p>Hallo ${params.customerName},</p>
      <p>Je bestelling <strong>${params.orderNumber}</strong> is bevestigd.</p>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <tr>
          <td style="padding: 8px 0; color: #5C4023;">Totaal:</td>
          <td style="padding: 8px 0; font-weight: bold; color: #D97B1A;">${params.totalFormatted}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #5C4023;">Type:</td>
          <td style="padding: 8px 0;">${params.fulfillment === "pickup" ? "Afhalen" : "Levering"}</td>
        </tr>
        ${params.pickupSlot ? `
        <tr>
          <td style="padding: 8px 0; color: #5C4023;">Tijdstip:</td>
          <td style="padding: 8px 0;">${params.pickupSlot}</td>
        </tr>
        ` : ""}
      </table>
      <p>
        <a href="${params.statusUrl}" style="display: inline-block; background: #D97B1A; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
          Bekijk je bestelling
        </a>
      </p>
      <p style="color: #9C8468; font-size: 14px; margin-top: 24px;">
        Tot snel!<br>Team Tajine2Go
      </p>
    </div>
  `;
}

export function adminNewOrderHtml(params: {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  totalFormatted: string;
  fulfillment: string;
  paymentMethod: string;
  itemCount: number;
}) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #D97B1A;">Nieuwe bestelling ${params.orderNumber}</h1>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 6px 0; color: #666;">Klant:</td><td>${params.customerName} (${params.customerEmail})</td></tr>
        <tr><td style="padding: 6px 0; color: #666;">Totaal:</td><td style="font-weight: bold;">${params.totalFormatted}</td></tr>
        <tr><td style="padding: 6px 0; color: #666;">Type:</td><td>${params.fulfillment}</td></tr>
        <tr><td style="padding: 6px 0; color: #666;">Betaling:</td><td>${params.paymentMethod}</td></tr>
        <tr><td style="padding: 6px 0; color: #666;">Items:</td><td>${params.itemCount}</td></tr>
      </table>
    </div>
  `;
}
