// import tradeExecutedTemplate from '@/app/utils/emailHtmlTemplates/tradeExecutedTemplate';

export async function POST(request) {
  try {
    const body = await request.json();
    const emailBody = {
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
      // bcc: [
      //   { name: 'Reinhart', email: 'reinhartsams@gmail.com' },
      //   {name : 'Edwin', email : 'edwinfardyanto@gmail.com'},
      // ],
      subject:body.subject,
      htmlContent:body.htmlContent,
    };
    if (body?.bcc) emailBody.bcc = body.bcc;
    if (body?.to) emailBody.to = body.to;

    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'post',
      body: JSON.stringify(emailBody),
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
      message: 'Email successuflly sent',
      ...result,
    });
  } catch (error) {
    return Response.json({
      status: false,
      message: error.message,
      data: 'Internal server error',
      error: error,
    }, { status: 500 });
  }
}
