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
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f6f8;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f6f8; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);">
                <!-- Header - Slate Blue -->
                <tr>
                  <td style="background: linear-gradient(135deg, #5a6f8c 0%, #4a5d78 100%); padding: 35px 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; letter-spacing: 0.5px;">MeYounger</h1>
                    <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px;">Official UK Distributor</p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 45px 35px;">
                    <h2 style="color: #3d4f5f; margin: 0 0 24px; font-size: 24px; font-weight: 600;">Hi ${name},</h2>
                    
                    <p style="color: #4a5568; font-size: 16px; line-height: 1.7; margin: 0 0 20px;">
                      Thank you for registering your interest in our upcoming medical-grade skincare range!
                    </p>
                    
                    <p style="color: #4a5568; font-size: 16px; line-height: 1.7; margin: 0 0 20px;">
                      We're working hard to bring you an exceptional selection of professional skincare products. 
                      As soon as they're available, you'll be the first to know.
                    </p>
                    
                    <div style="background-color: #f0f4f8; border-radius: 10px; padding: 24px; margin: 30px 0; border-left: 4px solid #5a6f8c;">
                      <p style="color: #3d4f5f; font-size: 15px; font-weight: 600; margin: 0 0 12px;">What to expect:</p>
                      <ul style="color: #4a5568; font-size: 15px; line-height: 2; margin: 0; padding-left: 20px;">
                        <li>Medical-grade formulations</li>
                        <li>Dermatologist-approved products</li>
                        <li>Exclusive launch offers</li>
                      </ul>
                    </div>
                    
                    <p style="color: #4a5568; font-size: 16px; line-height: 1.7; margin: 0 0 35px;">
                      In the meantime, explore our other ranges including F+NCTION supplements and Sedona Wellness devices.
                    </p>
                    
                    <div style="text-align: center;">
                      <a href="https://meyounger.lovable.app/#products" style="display: inline-block; background: linear-gradient(135deg, #5a6f8c 0%, #4a5d78 100%); color: #ffffff; text-decoration: none; padding: 18px 40px; border-radius: 10px; font-size: 16px; font-weight: 600; letter-spacing: 0.3px;">
                        Shop F+NCTION Supplements
                      </a>
                    </div>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f0f4f8; padding: 30px; text-align: center;">
                    <p style="color: #5a6f8c; font-size: 13px; font-weight: 500; margin: 0 0 8px;">
                      MeYounger - Official UK Distributor
                    </p>
                    <p style="color: #718096; font-size: 12px; margin: 0;">
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
      ["info@meyounger.co.uk"],
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
