import tradeExecutedTemplate from '@/app/utils/emailHtmlTemplates/tradeExecutedTemplate';

export async function POST(request) {
  try {
    const body = await request.json();

    // let htmlContent = '';
    // const emailBody = {
    //   ...body,
    //   sender: {
    //     name: 'byScript.io',
    //     email: 'edwinfardyanto@mgail.com',
    //   },
    //   bcc: [
    //     {
    //       name: 'reieie',
    //       email: 'reinhartsams@gmail.com',
    //     },
    //   ],
    //   to: [
    //     {
    //       email: body?.email,
    //       name: body?.name,
    //     },
    //   ],
    //   subject: 'Kamu Telah Login di byScript',
    //   htmlContent: htmlContent,
    // };

    // console.log(body);
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
      subject: 'Request Autotrader',
      htmlContent: tradeExecutedTemplate({
        autotrader_name: 'autotradername',
        exchange_thumbnail: 'https://static.airpackapp.com/fe-next/homepage/prod/_next/static/media/open_sesame_night.47e06968.png?w=750&q=75',
        trading_plan_id : 'XMA-testsaja',
        signal_type : 'BUY',
        tradeAmount : '1000',
        price : '2657',
        pair : 'USDT_ETH'
      }),
    
    };

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
