import { headers } from "next/headers";
import CryptoJS from 'crypto-js';
import * as crypto from "crypto"
import { adminDb } from "@/lib/firebase-admin-config";
import { Timestamp } from "firebase-admin/firestore";
import moment from "moment";
import userPurchaseTemplate from "@/app/utils/emailHtmlTemplates/userPurchaseTemplate";
import newPurchaseNotificationTemplate from "@/app/utils/emailHtmlTemplates/newPurchaseNotificationTemplate";

// const appMode = process.env.NEXT_PUBLIC_APP_MODE;
const API_KEY = process.env.NOWPAYMENTS_API_KEY;
const IPN_SECRET_KEY = process.env.NOWPAYMENTS_IPN_SECRET_KEY;

function generateSignature(data, secret) {
  const hash = CryptoJS.HmacSHA512(data, secret);
  return hash.toString(CryptoJS.enc.Hex); // This is correct for browsers
}

function anjay(data, secret) {
  const hmac = crypto.createHmac('sha512', secret);
  hmac.update(JSON.stringify(data, Object.keys(data).sort()));
  const signature = hmac.digest('hex');
  return signature;
}

function sortObjectAlphabetically(obj) {
  const sorted = {};
  Object.keys(obj).sort().forEach((key) => {
    sorted[key] = obj[key];
  });
  return sorted;
}

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('boddddyyyyyy', body);
    const headersList = headers();
    const requestSignature = headersList.get('x-nowpayments-sig');
    console.log(requestSignature, 'requestSignature');

    const res1 = await fetch(`https://api.nowpayments.io/v1/payment/${body.payment_id}`, {
      method: 'GET',
      headers: {
        'x-api-key': API_KEY
      }
    });
    const data = await res1.json();
    console.log(data, `check data for order_id ${body.order_id}`);

    // Step 3: Sort the body object alphabetically by keys
    const sortedBody = sortObjectAlphabetically(body);
    // Step 4: Stringify the sorted object deterministically
    const canonicalizedData = JSON.stringify(sortedBody);
    // Step 5: Generate HMAC-SHA512 signature using IPN secret
    const generatedSignature = generateSignature(canonicalizedData, IPN_SECRET_KEY);
    const _anjay = anjay(sortedBody, IPN_SECRET_KEY);

    const isSignatureValid = requestSignature === generatedSignature;
    const isStatusValid = body.payment_status === data.payment_status;
    const isPaymentValid = isSignatureValid || isStatusValid;
        const doc1 = await adminDb
      .collection('subscriptions')
      .doc(body.order_id)
      .get();
    const paymentDocument = { ...doc1.data(), id: doc1.id };

    console.log(`status for order_id ${body.order_id} user ${paymentDocument.name} ${paymentDocument.email} from body:  ${body.payment_status}, 
      status from getrequest: ${data.payment_status}, 
      isSignatureValid? ${isSignatureValid},
      isStatusValid? ${isStatusValid},
      isPaymentValid? ${isPaymentValid}`);


    if (!isPaymentValid) {
      // console.log(`returned message : 'payment not valid!'`);
      return new Response(JSON.stringify({
        message: 'payment not valid!'
      }), { status: 400 });
    }
     if (data.payment_status !== 'finished') {
      // console.log(`returned message : payment status : ${data.payment_status}`);
      // send email to user regardless of payment status
      await sendEmailToUser({
        name: paymentDocument?.name,
        email: paymentDocument?.email,
        productName: paymentDocument.productName,
        price: paymentDocument.price,
        paymentStatus: data.payment_status === 'finished' ? 'PAID' : data.payment_status.toUpperCase(),
        payInAddress: data?.pay_address,
        orderId: paymentDocument.id,
        payAmount: body.actually_paid,
      })

      return new Response(JSON.stringify({
        message: `payment status : ${data.payment_status}`
      }), { status: 200 });
    }

    const doc2 = await adminDb
      .collection('products')
      .doc(paymentDocument.productId)
      .get();
    const productDocument = { ...doc2.data(), id: doc2.id };
    // update database and customer isPremium, expiredAt, lastSubscriptionId
    const now = moment();
    const expiredTime = now.clone().add(productDocument.months, 'month').endOf('day');

    const expiredTimeTimestamp = Timestamp.fromDate(expiredTime.toDate());
    const promises = [
      await adminDb
        .collection('subscriptions')
        .doc(body.order_id)
        .update({
          paymentStatus: 'PAID',
          paidAt: new Date(),
          updatedAt: new Date(),
          paymentId: body.payment_id,
          amountUsd: body.actually_paid,
          invoice_id: body.invoice_id,
          expiredAt: expiredTimeTimestamp,
          metadata: data
        }),
      await adminDb
        .collection('customers')
        .doc(paymentDocument.customerId)
        .update({
          isPremium: true,
          expiredAt: expiredTimeTimestamp,
          lastSubscriptionId: paymentDocument.id,
          productName: paymentDocument.productName,
          productId: paymentDocument.productId,
          paymentStatus: 'PAID',
        }),
    ];
    const promisesResult = await Promise.allSettled(promises);
    console.log(promisesResult, `promisesResult order_id ${body.order_id} user ${paymentDocument.name} ${paymentDocument.email}`);

    // send email to admin
    await sendEmailToAdmin({
      name: paymentDocument?.name,
      email: paymentDocument?.email,
      productName: paymentDocument?.productName,
      productPrice: paymentDocument?.price,
      paymentStatus: data?.payment_status,
      orderId: paymentDocument?.id,
      price:paymentDocument?.price,
      payment_id : body.payment_id
    })

    return new Response(JSON.stringify({
      status: true,
      message: 'Hello!',
      requestSignature,
      generatedSignature,
      _anjay,
      // body,
    }), { status: 200 })
  } catch (error) {
    console.log('Internal server error::::', error.message);
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



async function sendEmailToUser(data) {
  console.log('called sendEmailToUser');
  const emailBodyUser = {
    sender: {
      name: 'byScript.io',
      email: 'edwinfardyanto@gmail.com',
    },
    to: [
      {
        email: data?.email,
        name: data?.name,
      },
    ],
    subject: `Purchase ${data?.productName} on byScript`,
    htmlContent: userPurchaseTemplate({
      name: data?.name,
      productName: data?.productName,
      productPrice: data?.price,
      paymentStatus: data.paymentStatus,
      payInAddress: data.payInAddress,
      orderId: data.orderId,
      payAmount: data.payAmount,
    }),
  };
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    body: JSON.stringify(emailBodyUser),
    headers: {
      accept: 'application/json',
      // eslint-disable-next-line no-undef
      'api-key': process.env.BREVO_API_KEY,
      'content-type': 'application/json',
    },
  });
  const resultSendEmailUser = await res.json();
  console.log(resultSendEmailUser, 'resultSendEmailUser');
  return resultSendEmailUser;
}
async function sendEmailToAdmin(data) {
  console.log('calledsendEmailToAdmin')
  const emailBodyAdmin = {
    sender: {
      name: 'byScript.io',
      email: 'edwinfardyanto@gmail.com',
    },
    to: [
      {
        email: 'edwinfardyanto@gmail.com',
        name: 'Edwin',
      },
      {
        email: 'reinhartsams@gmail.com',
        name: 'Reinhart',
      },
    ],
    subject: `NEW PURCHASE PAID - ${data?.productName} - ${data?.name}`,
    htmlContent: newPurchaseNotificationTemplate({
      name: data?.name,
      email: data?.email,
      productName: data?.productName,
      productPrice: data?.price,
      paymentStatus: data?.paymentStatus,
      orderId: data?.orderId,
      paymentId : data.payment_id
    }),
  };
  const res =await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    body: JSON.stringify(emailBodyAdmin),
    headers: {
      accept: 'application/json',
      // eslint-disable-next-line no-undef
      'api-key': process.env.BREVO_API_KEY,
      'content-type': 'application/json',
    },
  });
  const resAdminEmail = await res.json();
  console.log(resAdminEmail,'resAdminEmail');
  return resAdminEmail;
}