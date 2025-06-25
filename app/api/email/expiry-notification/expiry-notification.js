export const expiredNotification = ({
    name,
    autotraders,
    daysLeft = 0,
    downgradeCustomer = false,
}) => {
    return  (`
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
                  src: url('https://adminDb.onlinewebfonts.com/t/fce1ae337c2b8b2bf2518b7d5127e030.eot');
                  src: url('https://adminDb.onlinewebfonts.com/t/fce1ae337c2b8b2bf2518b7d5127e030.eot?#iefix')
                  format('embedded-opentype'),
                  url('https://adminDb.onlinewebfonts.com/t/fce1ae337c2b8b2bf2518b7d5127e030.woff2')
                  format('woff2'),
                  url('https://adminDb.onlinewebfonts.com/t/fce1ae337c2b8b2bf2518b7d5127e030.woff')
                  format('woff'),
                  url('https://adminDb.onlinewebfonts.com/t/fce1ae337c2b8b2bf2518b7d5127e030.ttf')
                  format('truetype'),
                  url('https://adminDb.onlinewebfonts.com/t/fce1ae337c2b8b2bf2518b7d5127e030.svg#Eco Coding WGL4 W01 Regular')
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
                        ${downgradeCustomer ? 
                    `Your byScript.io subscription has ended or hasn't been renewed. Your active autotraders will be deactivated. To reactivate, head to your dashboard and renew your subscription.` : 
                    `Your byScript subscription expires in ${daysLeft} day(s). Renew your subscription before expiry date to continue using byScript.`
                    }
                      </p>
                      <br />
                      ${autotraders?.length > 0 ?
                        `<p>
                          Your active autotraders:
                        </p>
                        <ul>
                          ${autotraders?.map((item) => (` <li>${item.trading_plan_pair[0]} - $${item.tradeAmount}</li>`)).join('')}
                        </ul>
                        <br />` : ''}
                      <div class="button-container">
                        <a href="https://byscript.io/auth/login" class="button">Go to my dashboard</a>
                      </div>
                  </div>
                </div>
            </body>
          </html>
  `)
}
    