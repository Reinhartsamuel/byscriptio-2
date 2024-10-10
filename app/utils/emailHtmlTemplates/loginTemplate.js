export default function loginTemplate(props) {
  const { name, ip, loginTime, userAgent } = props;
  return `
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
        background-color: #f3f4f6;
        border-radius: 1rem;
        padding: 1rem;
        color:black;
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
A successful login to your account has been
recorded.        
</p>
<br />
<ul>
<li><span style="font-weight:bold">Login Time</span>:${loginTime}</li>
<li><span style="font-weight:bold">IP Address</span>: ${ip}</li>
<li><span style="font-weight:bold">Device Details</span>: ${userAgent}</li>
</ul>
<br />
<p>
If this login wasn't authorized by you or you notice
any suspicious activity, please deactivate your
account immediately and contact our support team
at support@byScript.io
</p>
      </div>
    </div>
  </body>
</html>
  `;
}
