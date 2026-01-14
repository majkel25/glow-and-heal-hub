import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PAYPAL_CLIENT_ID = Deno.env.get('PAYPAL_CLIENT_ID')!;
const PAYPAL_CLIENT_SECRET = Deno.env.get('PAYPAL_CLIENT_SECRET')!;

// Use sandbox for testing, change to https://api-m.paypal.com for production
const PAYPAL_API_BASE = 'https://api-m.sandbox.paypal.com';

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

async function createOrder(accessToken: string, orderData: {
  amount: number;
  currency: string;
  items: Array<{ name: string; quantity: number; unit_amount: number }>;
}): Promise<{ id: string; status: string }> {
  const { amount, currency, items } = orderData;
  
  const itemTotal = items.reduce((sum, item) => sum + (item.unit_amount * item.quantity), 0);
  const shipping = amount - itemTotal;

  const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
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
    const error = await response.text();
    console.error('Failed to create PayPal order:', error);
    throw new Error('Failed to create PayPal order');
  }

  return await response.json();
}

async function captureOrder(accessToken: string, orderId: string): Promise<{ id: string; status: string; payer?: unknown }> {
  const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Failed to capture PayPal order:', error);
    throw new Error('Failed to capture PayPal order');
  }

  return await response.json();
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
        throw new Error('Order data is required for create action');
      }
      
      const order = await createOrder(accessToken, orderData);
      console.log('PayPal order created:', order.id);
      
      return new Response(JSON.stringify({ orderId: order.id }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } 
    
    if (action === 'capture') {
      if (!orderId) {
        throw new Error('Order ID is required for capture action');
      }
      
      const captureData = await captureOrder(accessToken, orderId);
      console.log('PayPal order captured:', captureData.id, captureData.status);
      
      return new Response(JSON.stringify({ 
        success: captureData.status === 'COMPLETED',
        orderId: captureData.id,
        status: captureData.status,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error(`Unknown action: ${action}`);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('PayPal edge function error:', errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
