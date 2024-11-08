import newPurchaseNotificationTemplate from '@/app/utils/emailHtmlTemplates/newPurchaseNotificationTemplate';
import userPurchaseTemplate from '@/app/utils/emailHtmlTemplates/userPurchaseTemplate';

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
      subject: `Purchase ${body?.productName} on byScript`,
      htmlContent: userPurchaseTemplate({
        name: body?.name,
        productName: body?.productName,
        productPrice: body?.price,
        paymentStatus: 'WAITING CONFIRMATION',
        receiptUrl: body?.receiptUrl,
      }),
    };
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
      subject: `NEW PURCHASE - ${body?.productName} - ${body?.name}`,
      htmlContent: newPurchaseNotificationTemplate({
        name: body?.name,
        email: body?.email,
        productName: body?.productName,
        productPrice: body?.price,
        paymentStatus: body?.paymentStatus,
        receiptUrl: body?.receiptUrl,
      }),
    };

    const res = await Promise.all([
      await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'post',
        body: JSON.stringify(emailBodyUser),
        headers: {
          accept: 'application/json',
          // eslint-disable-next-line no-undef
          'api-key': process.env.BREVO_API_KEY,
          'content-type': 'application/json',
        },
      }),
      await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'post',
        body: JSON.stringify(emailBodyAdmin),
        headers: {
          accept: 'application/json',
          // eslint-disable-next-line no-undef
          'api-key': process.env.BREVO_API_KEY,
          'content-type': 'application/json',
        },
      })
    ]);
    const result = await res.map((res) => res.json());
    return Response.json({
        status : true,
        result
    })
  } catch (error) {
    return Response.json({
        status : false,
        error:error.message
    })
  }
}
