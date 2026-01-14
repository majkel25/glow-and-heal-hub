import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PAYPAL_CLIENT_ID = Deno.env.get('PAYPAL_CLIENT_ID')!;
const PAYPAL_CLIENT_SECRET = Deno.env.get('PAYPAL_CLIENT_SECRET')!;

// Production PayPal API
const PAYPAL_API_BASE = 'https://api-m.paypal.com';

async function getAccessToken(): Promise<string> {
  const auth = btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`);
  
  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Failed to get PayPal access token:', error);
    throw new Error('Failed to authenticate with PayPal');
  }

  const data = await response.json();
  return data.access_token;
}

async function createOrder(
  accessToken: string,
  orderData: {
    amount: number;
    currency: string;
    items: Array<{ name: string; quantity: number; unit_amount: number }>;
    returnUrl?: string;
    cancelUrl?: string;
  },
): Promise<{ ok: true; id: string; status: string } | { ok: false; error: string }> {
  const { amount, currency, items, returnUrl, cancelUrl } = orderData;

  const itemTotal = items.reduce((sum, item) => sum + item.unit_amount * item.quantity, 0);
  const shipping = amount - itemTotal;

  const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      application_context: {
        landing_page: 'BILLING',
        user_action: 'PAY_NOW',
        ...(returnUrl ? { return_url: returnUrl } : {}),
        ...(cancelUrl ? { cancel_url: cancelUrl } : {}),
      },
      purchase_units: [{
        amount: {
          currency_code: currency,
          value: amount.toFixed(2),
          breakdown: {
            item_total: {
              currency_code: currency,
              value: itemTotal.toFixed(2),
            },
            shipping: {
              currency_code: currency,
              value: shipping.toFixed(2),
            },
          },
        },
        items: items.map(item => ({
          name: item.name,
          category: 'PHYSICAL_GOODS',
          quantity: item.quantity.toString(),
          unit_amount: {
            currency_code: currency,
            value: item.unit_amount.toFixed(2),
          },
        })),
      }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Failed to create PayPal order:', errorText);
    return { ok: false, error: errorText || 'Failed to create PayPal order' };
  }

  const data = await response.json();
  return { ok: true, id: data.id, status: data.status };
}

async function getOrder(
  accessToken: string,
  orderId: string,
): Promise<{ ok: true; id: string; status: string } | { ok: false; error: string }> {
  const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Failed to get PayPal order:', errorText);
    return { ok: false, error: errorText || 'Failed to get PayPal order' };
  }

  const data = await response.json();
  return { ok: true, id: data.id, status: data.status };
}

async function captureOrder(
  accessToken: string,
  orderId: string,
): Promise<{ ok: true; id: string; status: string } | { ok: false; error: string }> {
  const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Failed to capture PayPal order:', errorText);
    return { ok: false, error: errorText || 'Failed to capture PayPal order' };
  }

  const data = await response.json();
  return { ok: true, id: data.id, status: data.status };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, orderData, orderId } = await req.json();

    console.log(`PayPal action: ${action}`);

    const accessToken = await getAccessToken();

    if (action === 'create') {
      if (!orderData) {
        return new Response(JSON.stringify({ success: false, error: 'Order data is required for create action' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const created = await createOrder(accessToken, orderData);
      if (!created.ok) {
        return new Response(JSON.stringify({ success: false, error: created.error }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log('PayPal order created:', created.id, created.status);

      return new Response(JSON.stringify({ orderId: created.id, status: created.status }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'get') {
      if (!orderId) {
        return new Response(JSON.stringify({ success: false, error: 'Order ID is required for get action' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const order = await getOrder(accessToken, orderId);
      if (!order.ok) {
        return new Response(JSON.stringify({ success: false, error: order.error }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ success: true, orderId: order.id, status: order.status }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'capture') {
      if (!orderId) {
        return new Response(JSON.stringify({ success: false, error: 'Order ID is required for capture action' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const captured = await captureOrder(accessToken, orderId);
      if (!captured.ok) {
        return new Response(JSON.stringify({ success: false, error: captured.error }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log('PayPal order captured:', captured.id, captured.status);

      return new Response(JSON.stringify({
        success: captured.status === 'COMPLETED',
        orderId: captured.id,
        status: captured.status,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: false, error: `Unknown action: ${action}` }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('PayPal edge function error:', errorMessage);
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
