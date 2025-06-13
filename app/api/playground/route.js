import { adminDb } from "@/lib/firebase-admin-config";

const htmlContent = ({
  name,
  autotraders
}) => (`
        <!DOCTYPE html>
          <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Document</title>
                <style>
                  * {
                  padding: 0;
                  margin: 0;
                  font-family: Arial, Helvetica, sans-serif;
                  }
                  .gradient-text {
                  background-image: linear-gradient(to right, #6c5ce7, #7a29cb);
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                  font-weight: bold;
                  margin-left: 10px;
                  font-family: 'eco_coding', Arial, Helvetica, sans-serif;
                  }
                  .nav {
                  width: 100%;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  align-items: center;
                  background-color: white;
                  padding-top: 1rem;
                  padding-bottom: 1rem;
                  }
                  .container {
                  line-height:1.5rem;
                  border-radius: 1rem;
                  padding: 1rem;
                  color:black;
                  }
                  .button-container {
                  text-align: center;
                  margin-top: 1rem;
                  }
                  .button {
                  background-color: #6c5ce7;
                  color: white;
                  padding: 10px 20px;
                  text-decoration: none;
                  border-radius: 5px;
                  font-weight: bold;
                  }
                  @font-face {
                  font-family: 'eco_coding';
                  src: url('https://db.onlinewebfonts.com/t/fce1ae337c2b8b2bf2518b7d5127e030.eot');
                  src: url('https://db.onlinewebfonts.com/t/fce1ae337c2b8b2bf2518b7d5127e030.eot?#iefix')
                  format('embedded-opentype'),
                  url('https://db.onlinewebfonts.com/t/fce1ae337c2b8b2bf2518b7d5127e030.woff2')
                  format('woff2'),
                  url('https://db.onlinewebfonts.com/t/fce1ae337c2b8b2bf2518b7d5127e030.woff')
                  format('woff'),
                  url('https://db.onlinewebfonts.com/t/fce1ae337c2b8b2bf2518b7d5127e030.ttf')
                  format('truetype'),
                  url('https://db.onlinewebfonts.com/t/fce1ae337c2b8b2bf2518b7d5127e030.svg#Eco Coding WGL4 W01 Regular')
                  format('svg');
                  }
                </style>
            </head>
            <body>
                <div class="nav">
                  <img 
                      src='https://firebasestorage.googleapis.com/v0/b/byscript-io.appspot.com/o/emailheadercropped-min.png?alt=media&token=1d82bcf0-f21e-429a-99e5-d1b7eb922ccd' 
                      width='100%'
                      style='padding:0;background-color:white;' />
                </div>
                <div class="main">
                  <div class="container">
                      <p>
                        Dear <span style="font-weight:bold">${name}</span>,
                        <br />
                        Your byScript.io subscription has ended or hasn't been renewed. Your active autotraders will be deactivated. To reactivate, head to your dashboard and renew your subscription.
                      </p>
                      <br />
                      ${autotraders?.length > 0 &&
                      `<>
                        <p>
                          Your active autotraders:
                        </p>
                        <ul>
                          ${autotraders?.map((item, i) => (` <li>${item.trading_plan_pair[0]} - $${item.tradeAmount}</li>`))}
                        </ul>
                        <br />
                      </>`
                      }
                      <p>"Every trade is made byScript"🚀🚀</p>
                      <div class="button-container">
                        <a href="https://byscript.io/auth/login" class="button">Go to my dashboard</a>
                      </div>
                  </div>
                </div>
            </body>
          </html>
  `)

export async function POST() {
  try {
    // let result = [];
    // let q = adminDb
    //   .collection('webhooks_safe_preview')

    // const querySnapshot = await q
    //   .limit(2)
    //   .get();


    // const snapshot = await q
    //   .count()
    //   .get();
    // console.log(snapshot.data().count);
    // querySnapshot.forEach((doc) => {
    //   result.push({ ...doc.data(), id: doc.id });
    // })
    const emailBody = {
      sender: {
        name: 'byScript.io',
        email: 'info@byscript.io',
      },
      to: [
        {
          email: 'reinhartsams@gmail.com',
          name: 'reyn',
        },
      ],
      // bcc: [
      //   { name: 'Reinhart', email: 'reinhartsams@gmail.com' },
      //   {name : 'Edwin', email : 'edwinfardyanto@gmail.com'},
      // ],
      subject: 'Subscription Expired',
      htmlContent: htmlContent({
        name: 'Reyn',
        autotraders: [
          {
            "uid": "RomXA3UVAbMZB55BLWzE42Dh3kz2",
            "name": "Reinhart Samuel",
            "email": "reinhartsams@gmail.com",
            "tradeAmount": 10,
            "initialInvestment": 10,
            "exchange_name": "BINANCE",
            "exchange_external_name": "BINANCE FUTURES USDT-M",
            "market_code": "binance_futures",
            "exchange_external_id": 33190286,
            "exchange_thumbnail": "https://firebasestorage.googleapis.com/v0/b/byscript-io.appspot.com/o/exchange_logos%2FBinance-Logo.wine%20(1).png?alt=media&token=8e85962a-5728-44e2-a93a-388d0421e88d",
            "trading_plan_pair": [
              "XMA FUTURES_USDT_DOGE"
            ],
            "autotrader_name": "2025-05-26-1748257528",
            "marketType": "futures",
            "resultString": "USDT_DOGE",
            "smart_trade": true,
            "autocompound": true,
            "createdAt": {
              "_seconds": 1748257528,
              "_nanoseconds": 569000000
            },
            "createdBy": "RomXA3UVAbMZB55BLWzE42Dh3kz2",
            "companyId": "byScript",
            "lastUpdatedBy": {
              "uid": "RomXA3UVAbMZB55BLWzE42Dh3kz2",
              "email": "reinhartsams@gmail.com"
            },
            "lastSignal": {
              "account_id": "all",
              "pair": "USDT_DOGE",
              "position": {
                "type": "sell",
                "order_type": "market",
                "units": {
                  "value": "trade_amount"
                },
                "price": {
                  "value": "0.2164"
                }
              },
              "leverage": {
                "enabled": true,
                "type": "custom",
                "value": "1"
              },
              "take_profit": {
                "enabled": false
              },
              "stop_loss": {
                "enabled": false
              },
              "method": "CREATE",
              "trading_plan_id": "XMA FUTURES",
              "market_type": "futures",
              "timestamp": "1748548801311",
              "compound": "admin"
            },
            "lastUpdated": {
              "_seconds": 1748667596,
              "_nanoseconds": 69000000
            },
            "status": "STOPPED",
            "id": "5ycgtNiSm4O9qXBSEQlM"
          },
          {
            "trading_plan_pair": [
              "XMA_USDT_ADA"
            ],
            "smart_trade": true,
            "status": "ACTIVE",
            "exchange_name": "BINANCE",
            "name": "reinh",
            "email": "reinhartsams@gmail.com",
            "tradeAmount": 8.992081575,
            "market_code": null,
            "exchange_external_id": "33100833",
            "lastSignal": {
              "account_id": "all",
              "pair": "USDT_ADA",
              "position": {
                "type": "buy",
                "order_type": "market",
                "units": {
                  "value": "trade_amount"
                },
                "price": {
                  "value": "0.6896"
                }
              },
              "leverage": {
                "enabled": false
              },
              "take_profit": {
                "enabled": false
              },
              "stop_loss": {
                "enabled": false
              },
              "method": "CREATE",
              "trading_plan_id": "XMA",
              "market_type": "spot",
              "timestamp": "1748908801221",
              "compound": "admin"
            },
            "id": "TESTING_SMART_TRADE"
          }
        ]
      })
    };
    // const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    //   method: 'POST',
    //   body: JSON.stringify(emailBody),
    //   headers: {
    //     accept: 'application/json',
    //     // eslint-disable-next-line no-undef
    //     'api-key': process.env.BREVO_API_KEY,
    //     'content-type': 'application/json',
    //   },
    // })
    // const resemail = await res.json();
    // console.log('resemail', resemail);
    return Response.json({
      status: true,
      // resemail
    })
    // const resultPromise = await Promise.allSettled(result.map(async (item, i) => {
    //   // console.log(item, `indexxx: ${i}`);
    //   let autotraders = [];
    //   let autotradersQuery = adminDb
    //     .collection('dca_bots')
    //     .where('email', '==', item.email)
    //   const autotradersSnapshot = await autotradersQuery
    //     .get();

    //   autotradersSnapshot.forEach((doc) => {
    //     autotraders.push({ ...doc.data(), id: doc.id });
    //   })


    //   return autotraders;
    // }));

    // return Response.json({
    //   result,
    //   status: true,
    //   resultPromise,
    //   // htmlContent: htmlContent({
    //   //   name: 'Reyn',
    //   //   autotraders: resultPromise[0].value
    //   // })
    // });


    // return Response.json({
    //   // result,
    //   status: true,
    // });

  } catch (error) {
    return Response.json({
      error: error.message,
      status: false,
    });
  }
}