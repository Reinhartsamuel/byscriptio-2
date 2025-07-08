// File: dokuCheckoutHandler.ts
import crypto from "crypto";

/**
 * Generate SHA256 digest of a JSON string (Base64 encoded)
 */
function createDigest(body) {
  const bodyStr = typeof body === "string" ? body : JSON.stringify(body);
  const hash = crypto
    .createHash("sha256")
    .update(bodyStr, "utf8")
    .digest("base64");
  return hash;
}

/**
 * Create a properly formatted ISO 8601 UTC timestamp
 */
function getTimestamp() {
  return new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
}

/**
 * Generate HMAC-SHA256 signature using DOKU spec
 */
function generateDokuSignature({
  clientId,
  requestId,
  timestamp,
  requestTarget,
  body,
  secretKey,
}) {
  const digest = createDigest(body);
  const components = [
    `Client-Id:${clientId}`,
    `Request-Id:${requestId}`,
    `Request-Timestamp:${timestamp}`,
    `Request-Target:${requestTarget}`,
    `Digest:${digest}`,
  ];

  const stringToSign = components.join("\n");
  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(stringToSign, "utf8")
    .digest("base64");
  return `HMACSHA256=${signature}`;
}

/**
 * Example POST handler for creating a DOKU Checkout payment
 */
export async function POST(req) {
  try {
    const { price, subscriptionId } = await req.json();

    const DOKU_CLIENT_ID = process.env.DOKU_CLIENT_ID;
    const DOKU_SECRET_KEY = process.env.DOKU_SECRET_KEY;

    console.log(DOKU_SECRET_KEY, "DOKU_SECRET_KEY");
    console.log(DOKU_CLIENT_ID, "DOKU_CLIENT_ID");
    const endpoint = "https://api.doku.com/checkout/v1/payment";
    const requestTarget = "/checkout/v1/payment";
    const requestId = `inv-${subscriptionId}-${crypto.randomUUID().slice(0, 12)}`;
    const timestamp = getTimestamp();

    const payload = {
      order: {
        amount: price,
        invoice_number: subscriptionId,
        currency: "IDR",
        callback_url: "https://www.byscript.io/api/callback/doku",
        language: "EN",
        auto_redirect: true,
        disable_retry_payment: true,
        recover_abandoned_cart: true,
        line_items: [
          {
            id: "001",
            name: "Item Name",
            quantity: 1,
            price: price,
            sku: "SKU-001",
            category: "general",
          },
        ],
      },
      payment: {
        payment_due_date: 60,
        type: "SALE",
        payment_method_types: [
          "VIRTUAL_ACCOUNT_BCA",
          "VIRTUAL_ACCOUNT_BANK_MANDIRI",
          "EMONEY_OVO",
          "QRIS",
          "CREDIT_CARD",
        ],
      },
      customer: {
        id: "CUSTOMER-1",
        name: "Jane",
        last_name: "Doe",
        phone: "628123456789",
        email: "jane.doe@example.com",
        address: "Jl. Mawar No. 1",
        postcode: "12345",
        city: "Jakarta",
        country: "ID",
      },
    };

    const signature = generateDokuSignature({
      clientId: DOKU_CLIENT_ID,
      requestId,
      timestamp,
      requestTarget,
      body: payload,
      secretKey: DOKU_SECRET_KEY,
    });

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Client-Id": DOKU_CLIENT_ID,
        "Request-Id": requestId,
        "Request-Timestamp": timestamp,
        Signature: signature,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("DOKU Error:", data);
      return new Response(
        JSON.stringify({
          status: false,
          message: data?.error?.message || "API Error",
        }),
        {
          status: 400,
        },
      );
    }

    return new Response(JSON.stringify({ status: true, data }), {
      status: 201,
    });
  } catch (err) {
    console.error("Fatal Error:", err);
    return new Response(
      JSON.stringify({ status: false, message: err.message }),
      { status: 500 },
    );
  }
}
