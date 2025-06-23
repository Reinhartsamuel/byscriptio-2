import CryptoJS from "crypto-js";
import { adminDb } from "../../../lib/firebase-admin-config";
import { headers } from "next/headers";

// const appMode = process.env.NEXT_PUBLIC_APP_MODE;
const API_KEY = process.env.NOWPAYMENTS_API_KEY_REINHART;
const IPN_SECRET_KEY = process.env.NOWPAYMENTS_IPN_SECRET_KEY_REINHART;


export async function POST(request) {
  try {
    const body = await request.json();
    console.log('boddddyyyyyy', body,);
    const headersList = await headers();
    const requestSignature = headersList.get('x-nowpayments-sig');
    console.log(requestSignature, 'requestSignature');

    const res1 = await fetch(`https://api.nowpayments.io/v1/payment/${body.payment_id}`,{
      method : 'GET',
      headers: { 
        'x-api-key': API_KEY
      }
    });
    const data = await res1.json();
    console.log(data, 'data to be matched');
    console.log(API_KEY,'API_KEY');
    console.log(IPN_SECRET_KEY,'IPN_SECRET_KEY');

    const hmac = crypto.createHmac('sha512', requestSignature);
    hmac.update(JSON.stringify(body, Object.keys(body).sort()));
    const signature = hmac.digest('hex');
    console.log(signature, 'calculated signature');
    const isSignatureValid = requestSignature === signature;
    console.log('isSignatureValid:', isSignatureValid);
    const isStatusValid = data.payment_status === data.payment_status;
    console.log(`
      status from body: ${body.payment_status}, 
      status from getrequest: ${data.payment_status}, 
      are the status the same??: ${isStatusValid}
      `);

    return new Response(JSON.stringify({
      status: true,
      message: 'Hello!',
      body
    }, { status: 200 }))
  } catch (error) {
    return new Response(JSON.stringify({
      status: false,
      error: error.message,
      message: 'Error on internal server!',
      errorCode: error.errorCode
    }), {
      status: 500
    })
  }

}