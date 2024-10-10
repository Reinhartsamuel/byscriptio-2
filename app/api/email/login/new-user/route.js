import signUpTemplate from '@/app/utils/emailHtmlTemplates/signUpTemplate';

export async function POST(request) {
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
    //   // { name: 'Reinhart', email: 'reinhartsams@gmail.com' },
    //   // {name : 'Edwin', email : 'edwinfardyanto@gmail.com'},
    // ],
    subject: 'Registration Successful on byScript',
    htmlContent: signUpTemplate({name :body?.name}),
  };

  if (body?.content) emailBody.htmlContent = body?.content;

  try {
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
    return Response.json({ ...result });
  } catch (error) {
    return Response.json({ status: false, message: error.message });
  }
}
