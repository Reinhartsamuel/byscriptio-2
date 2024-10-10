import loginTemplate from '@/app/utils/emailHtmlTemplates/loginTemplate';
import moment from 'moment';
import { headers } from 'next/headers';
import { userAgent } from 'next/server';

export async function POST(request) {
  const body = await request.json();
  const ipAddress = IP();
  const {ua} =  userAgent(request);


  const emailBody = {
    sender: {
      name: 'byScript.io',
      email: 'edwinfardyanto@gmail.com',
    },
    // bcc: [
    //   // {
    //   //   name: 'reieie',
    //   //   email: 'reinhartsams@gmail.com',
    //   // },
    // ],
    to: [
      {
        email: body?.email,
        name: body?.name,
      },
    ],
    subject: 'Successful Login on byScript',
    htmlContent: loginTemplate({
      name : body?.name,
      loginTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      ip: ipAddress,
      userAgent: ua,
    }),
  };

  if (body?.content) emailBody.htmlContent = body?.content;
  if (body?.subject) emailBody.subject = body?.subject;

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


function IP() {
  const FALLBACK_IP_ADDRESS = '0.0.0.0'
  const forwardedFor = headers().get('x-forwarded-for')
 
  if (forwardedFor) {
    return forwardedFor.split(',')[0] ?? FALLBACK_IP_ADDRESS
  }
 
  return headers().get('x-real-ip') ?? FALLBACK_IP_ADDRESS
}