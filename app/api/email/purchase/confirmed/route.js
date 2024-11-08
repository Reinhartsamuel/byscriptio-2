import userPurchaseConfirmedTemplate from '@/app/utils/emailHtmlTemplates/userPurchaseConfirmedTemplate';

export async function POST(request) {
  try {
    const body = await request.json();
    const emailBodyUser = {
      sender: {
        name: 'byScript.io',
        email: 'edwinfardyanto@gmail.com',
      },
      to: [
        {
          email: body?.email,
          name: body?.name,
        },
      ],
      subject: `Payment Confirmed ${body?.productName} on byScript`,
      htmlContent: userPurchaseConfirmedTemplate({
        name: body?.name,
        productName: body?.productName,
        productPrice: body?.price,
        paymentStatus: 'PAID',
        receiptUrl: body?.receiptUrl,
      }),
    };
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'post',
      body: JSON.stringify(emailBodyUser),
      headers: {
        accept: 'application/json',
        // eslint-disable-next-line no-undef
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json',
      },
    });

    const result = await res.json();
    return Response.json({
      status: true,
      result,
    });
  } catch (error) {
    return Response.json({
      status: false,
      error: error.message,
    });
  }
}
