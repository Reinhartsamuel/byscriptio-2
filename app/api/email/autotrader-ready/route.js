import autotraderReadyTemplate from '@/app/utils/emailHtmlTemplates/autotraderReadyTemplate';
import extractUniqueStrategies from '@/app/utils/extractUniqueStrategies';
import moment from 'moment';

export async function POST(request) {
  const body = await request.json();
  try {
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
      subject: 'Autotrader Ready to be Activated',
      htmlContent: autotraderReadyTemplate({
        name: body?.name,
        requestedAt : moment.unix(body?.createdAt?.seconds).format('ddd DD MMM YYYY HH:mm:ss'),
        approvedAt : moment().format('ddd DD MMM YYYY HH:mm:ss'),
        trading_plan_id : extractUniqueStrategies(body?.trading_plan_pair),
        ...body
      }),
    };
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
    // return Response.json({status : 'ok',emailBody})
    } catch (error) {
      return Response.json({ status: false, message: error.message });
    }
  } catch (error) {
    return Response.json({ status: false, message: error.message });
  }
}
