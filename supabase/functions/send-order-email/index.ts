import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// MeYounger logo as base64 - fetched and cached in-memory
let logoBase64: string | null = null;

async function getLogoBase64(): Promise<string> {
  if (logoBase64) return logoBase64;

  try {
    // Use the correctly-sized email logo asset
    const response = await fetch("https://glow-and-heal-hub.lovable.app/email-logo.png");
    if (response.ok) {
      const arrayBuffer = await response.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      let binary = "";
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      logoBase64 = btoa(binary);
      return logoBase64;
    }
  } catch (e) {
    console.error("Failed to fetch logo:", e);
  }

  return "";
}

async function sendEmail(
  to: string[],
  from: string,
  subject: string,
  html: string,
  attachments?: Array<{
    filename: string;
    content: string; // base64
    content_type: string;
    content_id?: string;
  }>
) {
  const payload: Record<string, unknown> = { from, to, subject, html };
  if (attachments?.length) payload.attachments = attachments;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to send email: ${errorText}`);
  }

  return response.json();
}

interface OrderItem {
  name: string;
  quantity: number;
  unit_amount: number;
}

interface OrderEmailRequest {
  orderId: string;
  customerEmail: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  currency: string;
  shippingAddress?: {
    address: string;
    city: string;
    postcode: string;
    country: string;
  };
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

async function generateOrderEmailHtml(order: OrderEmailRequest, hasLogo: boolean): Promise<string> {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(item.unit_amount, order.currency)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(item.unit_amount * item.quantity, order.currency)}</td>
    </tr>
  `).join('');

  const shippingAddressHtml = order.shippingAddress ? `
    <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin-top: 24px;">
      <h3 style="margin: 0 0 12px 0; color: #374151; font-size: 14px; font-weight: 600;">Shipping Address</h3>
      <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
        ${order.customerName}<br>
        ${order.shippingAddress.address}<br>
        ${order.shippingAddress.city}, ${order.shippingAddress.postcode}<br>
        ${order.shippingAddress.country}
      </p>
    </div>
  ` : '';

  // Use CID-referenced image for best Outlook compatibility - no resizing, use natural size
  const logoHtml = hasLogo
    ? `<img src="cid:meyoungerlogo" alt="MeYounger" style="display: block; margin: 0 auto 12px auto; -ms-interpolation-mode: bicubic;" />`
    : `<div style="font-size: 16px; font-weight: bold; color: white; margin-bottom: 12px;">MeYounger</div>`;

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
        <div style="background: linear-gradient(135deg, #a78b7d 0%, #8b7355 100%); padding: 32px; text-align: center;">
          ${logoHtml}
          <h1 style="margin: 0; color: white; font-size: 24px; font-weight: 600;">Order Confirmed</h1>
          <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Thank you for your purchase!</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 32px;">
          <p style="margin: 0 0 24px 0; color: #374151; font-size: 16px;">
            Hi ${order.customerName},
          </p>
          <p style="margin: 0 0 24px 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
            We're excited to confirm your order. You'll receive another email with tracking information once your order ships.
          </p>
          
          <!-- Order ID -->
          <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
            <p style="margin: 0; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Order ID</p>
            <p style="margin: 4px 0 0 0; color: #111827; font-size: 14px; font-family: monospace; font-weight: 600;">${order.orderId}</p>
          </div>
          
          <!-- Order Items -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <thead>
              <tr style="background: #f9fafb;">
                <th style="padding: 12px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Item</th>
                <th style="padding: 12px; text-align: center; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Qty</th>
                <th style="padding: 12px; text-align: right; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Price</th>
                <th style="padding: 12px; text-align: right; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          
          <!-- Totals -->
          <div style="border-top: 2px solid #e5e7eb; padding-top: 16px;">
            <table style="width: 100%;">
              <tr>
                <td style="color: #6b7280; font-size: 14px; padding: 4px 0;">Subtotal</td>
                <td style="color: #374151; font-size: 14px; text-align: right; padding: 4px 0;">${formatCurrency(order.subtotal, order.currency)}</td>
              </tr>
              <tr>
                <td style="color: #6b7280; font-size: 14px; padding: 4px 0;">Shipping</td>
                <td style="color: #374151; font-size: 14px; text-align: right; padding: 4px 0;">${order.shipping === 0 ? 'Free' : formatCurrency(order.shipping, order.currency)}</td>
              </tr>
              <tr style="border-top: 1px solid #e5e7eb;">
                <td style="color: #111827; font-size: 16px; font-weight: 600; padding: 12px 0 4px 0;">Total</td>
                <td style="color: #111827; font-size: 16px; font-weight: 600; text-align: right; padding: 12px 0 4px 0;">${formatCurrency(order.total, order.currency)}</td>
              </tr>
            </table>
          </div>
          
          ${shippingAddressHtml}
        </div>
        
        <!-- Footer -->
        <div style="background: #f9fafb; padding: 24px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">
            Questions about your order?
          </p>
          <a href="mailto:orders@meyounger.co.uk" style="color: #a78b7d; text-decoration: none; font-size: 14px; font-weight: 500;">orders@meyounger.co.uk</a>
          <p style="margin: 16px 0 0 0; color: #9ca3af; font-size: 12px;">
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
    const orderData: OrderEmailRequest = await req.json();
    
    console.log("Sending order confirmation email for order:", orderData.orderId);

    const logoAttachmentBase64 = await getLogoBase64();
    console.log(
      "Logo attachment present:",
      Boolean(logoAttachmentBase64),
      "base64Length:",
      logoAttachmentBase64?.length ?? 0
    );

    const attachments = logoAttachmentBase64
      ? [
          {
            filename: "logo.png",
            content: logoAttachmentBase64,
            content_type: "image/png",
            content_id: "meyoungerlogo",
          },
        ]
      : undefined;

    const emailHtml = await generateOrderEmailHtml(orderData, Boolean(logoAttachmentBase64));

    // Send to customer - using verified subdomain orders.meyounger.co.uk
    const customerEmailResponse = await sendEmail(
      [orderData.customerEmail],
      "MeYounger Orders <noreply@orders.meyounger.co.uk>",
      `Order Confirmed - ${orderData.orderId}`,
      emailHtml,
      attachments
    );

    console.log("Customer email sent:", customerEmailResponse);

    // Send copy to business
    const businessEmailResponse = await sendEmail(
      ["orders@meyounger.co.uk"],
      "MeYounger Orders <noreply@orders.meyounger.co.uk>",
      `New Order Received - ${orderData.orderId}`,
      emailHtml,
      attachments
    );

    console.log("Business email sent:", businessEmailResponse);

    return new Response(
      JSON.stringify({
        success: true,
        customerEmail: customerEmailResponse,
        businessEmail: businessEmailResponse,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in send-order-email function:", error);
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
