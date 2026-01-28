import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InterestRequest {
  name: string;
  email: string;
}

async function sendEmail(to: string[], subject: string, html: string) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "MeYounger <noreply@orders.meyounger.co.uk>",
      to,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to send email: ${error}`);
  }

  return response.json();
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email }: InterestRequest = await req.json();

    if (!name || !email) {
      throw new Error("Missing required fields: name and email");
    }

    // Send confirmation email to customer
    const customerEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <!-- Header -->
                <tr>
                  <td style="background-color: #8b7355; padding: 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">MeYounger</h1>
                    <p style="color: #ffffff; margin: 10px 0 0; font-size: 14px; opacity: 0.9;">Official UK Distributor</p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="color: #333333; margin: 0 0 20px; font-size: 22px;">Hi ${name},</h2>
                    
                    <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                      Thank you for registering your interest in our upcoming medical-grade skincare range!
                    </p>
                    
                    <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                      We're working hard to bring you an exceptional selection of professional skincare products. 
                      As soon as they're available, you'll be the first to know.
                    </p>
                    
                    <div style="background-color: #f8f6f3; border-radius: 8px; padding: 20px; margin: 30px 0;">
                      <p style="color: #8b7355; font-size: 14px; font-weight: 600; margin: 0 0 10px;">What to expect:</p>
                      <ul style="color: #666666; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                        <li>Medical-grade formulations</li>
                        <li>Dermatologist-approved products</li>
                        <li>Exclusive launch offers</li>
                      </ul>
                    </div>
                    
                    <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0;">
                      In the meantime, explore our other ranges including F+NCTION supplements and Sedona Wellness devices.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8f6f3; padding: 30px; text-align: center;">
                    <p style="color: #999999; font-size: 12px; margin: 0 0 10px;">
                      MeYounger - Official UK Distributor
                    </p>
                    <p style="color: #999999; font-size: 12px; margin: 0;">
                      48 Warwick Way, London, SW1V 1RY
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    await sendEmail(
      [email],
      "You're on the list! - MeYounger Medical Skincare",
      customerEmailHtml
    );

    console.log("Customer confirmation email sent to:", email);

    // Send notification to business
    const businessEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <h2 style="color: #333;">New Medical Skincare Interest Registration</h2>
        
        <table style="border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 8px 16px 8px 0; font-weight: 600; color: #666;">Name:</td>
            <td style="padding: 8px 0; color: #333;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 16px 8px 0; font-weight: 600; color: #666;">Email:</td>
            <td style="padding: 8px 0; color: #333;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 8px 16px 8px 0; font-weight: 600; color: #666;">Date:</td>
            <td style="padding: 8px 0; color: #333;">${new Date().toISOString()}</td>
          </tr>
        </table>
        
        <p style="color: #666; font-size: 14px;">
          This person has registered interest in the upcoming medical skincare range.
        </p>
      </body>
      </html>
    `;

    await sendEmail(
      ["hello@meyounger.co.uk"],
      `New Interest Registration: ${name}`,
      businessEmailHtml
    );

    console.log("Business notification email sent");

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-interest-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
