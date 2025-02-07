export default function exchangeConnectTemplate(props) {
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

      .subtitle {
        color: white;
        font-style: italic;
        letter-spacing: 1px;
        font-size: 12px;
        font-weight: 200;
      }

      .main {}

      .container {
        line-height: 1.5rem;
        background-color: #f3f4f6;
        border-radius: 1rem;
        padding: 1rem;
      }

      table {
        font-family: arial, sans-serif;
        border-collapse: collapse;
        width: 100%;
      }

      td,
      th {
        border: 1px solid #3e3e3e;
        text-align: left;
        padding: 8px;
        font-weight: 500;
      }

      @font-face {
        font-family: 'eco_coding';
        src: url('https://db.onlinewebfonts.com/t/fce1ae337c2b8b2bf2518b7d5127e030.eot');
        src: url('https://db.onlinewebfonts.com/t/fce1ae337c2b8b2bf2518b7d5127e030.eot?#iefix') format('embedded-opentype'),
          url('https://db.onlinewebfonts.com/t/fce1ae337c2b8b2bf2518b7d5127e030.woff2') format('woff2'),
          url('https://db.onlinewebfonts.com/t/fce1ae337c2b8b2bf2518b7d5127e030.woff') format('woff'),
          url('https://db.onlinewebfonts.com/t/fce1ae337c2b8b2bf2518b7d5127e030.ttf') format('truetype'),
          url('https://db.onlinewebfonts.com/t/fce1ae337c2b8b2bf2518b7d5127e030.svg#Eco Coding WGL4 W01 Regular') format('svg');
      }
    </style>
  </head>
  <body>
    <!--  <div class="nav"><img 
    src='https://firebasestorage.googleapis.com/v0/b/byscript-io.appspot.com/o/emailheadercropped-min.png?alt=media&token=1d82bcf0-f21e-429a-99e5-d1b7eb922ccd' 
    width='100%'
    style='padding:0;background-color:white;' /></div> -->
    <div class="main">
      <div class="container">
        <h2> New Exchange Connected! </h2>
        <br />
        <br />
        <table>
          <tr>
            <th>Connected at</th>
            <th>${props?.connectedAt}</th>
          </tr>
          <tr>
            <td>Exchange</td>
            <td>
              <img alt='exchange' src=${props?.exchange_thumbnail} style='width:5rem;object-fit:contain;' />
            </td>
          </tr>
          <tr>
            <td>Balance</td>
            <td>
             USD ${props?.balance}
            </td>
          </tr>
        </table>
        <div style="width:100%; display:flex; justify-content:center; align-items:center;">
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <div style="display:flex;">
            <img src='https://firebasestorage.googleapis.com/v0/b/byscript-io.appspot.com/o/byscriptlogo.jpeg?alt=media&token=bb0a63ce-cdf7-4f67-b0f6-32f4f686fbc7' style='width:2rem;height:2rem;margin-right:0.5em' />
          </div>
          <p style='font-family:eco_coding; font-weight:bold;'> byScript.io </p>
        </div>
      </div>
    </div>
  </body>
</html>
    `;
  }
  