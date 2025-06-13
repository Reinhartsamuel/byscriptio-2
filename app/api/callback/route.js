import CryptoJS from "crypto-js";
import { adminDb } from "../../../lib/firebase-admin-config";

// const appMode = process.env.NEXT_PUBLIC_APP_MODE;

export async function POST(request) {
  const body = await request.json();
  console.log('boddddyyyyyy',body,)
  const { order_id, status_code, gross_amount,transaction_status, signature_key, transaction_time } = body;

  const serverKey = process.env.NEXT_PUBLIC_MIDTRANS_SERVER_KEY_SANDBOX
  let errorData = undefined;

  //create hash 
  const hash = CryptoJS.SHA512(order_id + status_code + gross_amount + serverKey)
  const hashString = hash.toString(CryptoJS.enc.Hex);
  
  //compare signature key
  if (signature_key !== hashString) {
    console.log("Invalid signature key", order_id);
    return Response.json({ status: false, message: "Invalid signature key", serverKey, hashString, signature_key});
  }

  let orderData = {};
  try {
    const docSnap = await adminDb.collection("orders").doc(order_id).get();
    orderData = {id : docSnap.id, ...docSnap.data()};
    // return Response.json({...orderData})
  } catch (error) {
    console.log(error.message);
  }
  // update payment status only if transaction status is settlement
  if (transaction_status === "settlement") {
    try {
      const res = await adminDb.collection("orders").doc(order_id).update({
        paymentStatus: "PAID",
      });
      console.log(res, 'res');
      try {
        await fetch({
          url : 'https://autotrade-tau.vercel.app/api/email',
          // url : 'http://localhost:3000/api/email',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type : 'callback',
            email : orderData?.email || '',
            name : orderData?.name || '',
            time : transaction_time
          })
        })
      } catch (error) {
        console.log(error.message, 'error sending email create order');
        errorData = error.message
        // return Response.json({status : false, message : error.message, data : "Error sending email create order", body})
      }
      return Response.json({ message : "success", error: errorData });
    } catch (error) {
      return Response.json({ status: false, message: JSON.stringify(error) });
    }
  } else {
    return Response.json({ status: false, message: "Transaction status not settlement" });
  }
}