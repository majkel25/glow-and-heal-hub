import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface CallbackRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  productInterest: string;
  useCase: string;
  message?: string;
}

async function sendEmail(
  to: string[],
  from: string,
  subject: string,
  html: string
) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to send email: ${errorText}`);
  }

  return response.json();
}

function generateCallbackEmailHtml(data: CallbackRequest): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 40px 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
        
        <!-- Header -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#8b7355" style="background-color: #8b7355;">
          <tr>
            <td align="center" style="padding: 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">New Callback Request</h1>
              <p style="margin: 8px 0 0 0; color: #ffffff; font-size: 14px;">Sedona Wellness Enquiry</p>
            </td>
          </tr>
        </table>
        
        <!-- Content -->
        <div style="padding: 32px;">
          <h2 style="margin: 0 0 24px 0; color: #374151; font-size: 18px; font-weight: 600;">Contact Details</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #eee; color: #6b7280; font-size: 14px; width: 35%;">Name</td>
              <td style="padding: 12px; border-bottom: 1px solid #eee; color: #111827; font-size: 14px; font-weight: 500;">${data.firstName} ${data.lastName}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #eee; color: #6b7280; font-size: 14px;">Email</td>
              <td style="padding: 12px; border-bottom: 1px solid #eee; color: #111827; font-size: 14px;"><a href="mailto:${data.email}" style="color: #a78b7d; text-decoration: none;">${data.email}</a></td>
            </tr>
            ${data.phone ? `
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #eee; color: #6b7280; font-size: 14px;">Phone</td>
              <td style="padding: 12px; border-bottom: 1px solid #eee; color: #111827; font-size: 14px;"><a href="tel:${data.phone}" style="color: #a78b7d; text-decoration: none;">${data.phone}</a></td>
            </tr>
            ` : ''}
            ${data.company ? `
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #eee; color: #6b7280; font-size: 14px;">Company</td>
              <td style="padding: 12px; border-bottom: 1px solid #eee; color: #111827; font-size: 14px;">${data.company}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #eee; color: #6b7280; font-size: 14px;">Product Interest</td>
              <td style="padding: 12px; border-bottom: 1px solid #eee; color: #111827; font-size: 14px; font-weight: 500;">${data.productInterest}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #eee; color: #6b7280; font-size: 14px;">Intended Use</td>
              <td style="padding: 12px; border-bottom: 1px solid #eee; color: #111827; font-size: 14px;">${data.useCase}</td>
            </tr>
          </table>
          
          ${data.message ? `
          <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
            <h3 style="margin: 0 0 12px 0; color: #374151; font-size: 14px; font-weight: 600;">Additional Message</h3>
            <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${data.message}</p>
          </div>
          ` : ''}
          
          <div style="background: #fef3c7; border-radius: 8px; padding: 16px;">
            <p style="margin: 0; color: #92400e; font-size: 14px; font-weight: 500;">⏰ Please respond within 24-48 hours</p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background: #f9fafb; padding: 24px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0; color: #9ca3af; font-size: 12px;">
            © ${new Date().getFullYear()} MeYounger. Callback request received via website.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateCustomerConfirmationHtml(data: CallbackRequest): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 40px 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
        
        <!-- Header -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#8b7355" style="background-color: #8b7355;">
          <tr>
            <td align="center" style="padding: 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">Callback Request Received</h1>
              <p style="margin: 8px 0 0 0; color: #ffffff; font-size: 14px;">Thank you for your interest!</p>
            </td>
          </tr>
        </table>
        
        <!-- Content -->
        <div style="padding: 32px;">
          <p style="margin: 0 0 24px 0; color: #374151; font-size: 16px;">
            Hi ${data.firstName},
          </p>
          <p style="margin: 0 0 24px 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
            Thank you for your interest in Sedona Wellness PEMF therapy devices. We've received your callback request and one of our specialists will be in touch within 24-48 hours.
          </p>
          
          <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
            <h3 style="margin: 0 0 12px 0; color: #374151; font-size: 14px; font-weight: 600;">Your Enquiry Details</h3>
            <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
              <strong>Product Interest:</strong> ${data.productInterest}<br>
              <strong>Intended Use:</strong> ${data.useCase}
            </p>
          </div>
          
          <p style="margin: 0 0 24px 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
            In the meantime, if you have any urgent questions, please don't hesitate to contact us directly:
          </p>
          
          <table style="width: 100%;">
            <tr>
              <td style="padding: 8px 0;">
                <a href="tel:+442039082012" style="color: #a78b7d; text-decoration: none; font-size: 14px;">📞 +44 203 908 2012</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0;">
                <a href="mailto:hello@meyounger.co.uk" style="color: #a78b7d; text-decoration: none; font-size: 14px;">✉️ hello@meyounger.co.uk</a>
              </td>
            </tr>
          </table>
        </div>
        
        <!-- Footer -->
        <div style="background: #f9fafb; padding: 24px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">
            MeYounger - Official UK Distributor
          </p>
          <p style="margin: 0; color: #9ca3af; font-size: 12px;">
            © ${new Date().getFullYear()} MeYounger. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: CallbackRequest = await req.json();
    
    console.log("Sending callback request email for:", data.email);

    // Send notification to business
    const businessEmailHtml = generateCallbackEmailHtml(data);
    const businessEmailResponse = await sendEmail(
      ["hello@meyounger.co.uk"],
      "MeYounger Website <noreply@orders.meyounger.co.uk>",
      `New Callback Request - ${data.firstName} ${data.lastName} - ${data.productInterest}`,
      businessEmailHtml
    );

    console.log("Business notification email sent:", businessEmailResponse);

    // Send confirmation to customer
    const customerEmailHtml = generateCustomerConfirmationHtml(data);
    const customerEmailResponse = await sendEmail(
      [data.email],
      "MeYounger <noreply@orders.meyounger.co.uk>",
      "We've Received Your Callback Request - MeYounger",
      customerEmailHtml
    );

    console.log("Customer confirmation email sent:", customerEmailResponse);

    return new Response(
      JSON.stringify({
        success: true,
        businessEmail: businessEmailResponse,
        customerEmail: customerEmailResponse,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in send-callback-email function:", error);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
