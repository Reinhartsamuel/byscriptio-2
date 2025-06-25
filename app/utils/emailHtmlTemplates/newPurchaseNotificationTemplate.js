export default function newPurchaseNotificationTemplate(props) {
  const {
    name,
    email,
    productName,
    productPrice,
    paymentStatus,
    orderId,
    paymentId
  } = props;
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
      line-height: 1.5rem;
      background-color: #f3f4f6;
      border-radius: 1rem;
      padding: 1rem;
      color: black;
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
  <div class="nav">
    <img
        src="https://firebasestorage.googleapis.com/v0/b/byscript-io.appspot.com/o/emailheadercropped-min.png?alt=media&token=1d82bcf0-f21e-429a-99e5-d1b7eb922ccd"
        width="100%"
        style="padding:0;background-color:white;"
      />
  </div>
  <div class="main">
    <div class="container">
      <p>
        New Purchase!!
      </p>
      <br />
      <ul>
        <li>Name: <span style="font-weight:bold">${name}</span></li>
        <li>Email: <span style="font-weight:bold">${email}</span></li>
        <li>Product: <span style="font-weight:bold">${productName}</span></li>
        <li>Order ID: <span style="font-weight:bold">${orderId}</span></li>
        <li>
          Price: IDR <span style="font-weight:bold">${productPrice}</span>
        </li>
        <li>
          Status :<span style="font-weight:bold">${paymentStatus}</span>
        </li>
      </ul>
      <br />
      <p>User already finished purchase, check subscription id ${orderId} on admin dashboard, payment id ${paymentId} on NOWPAYMENTS dashboard</p>
      <br />
      <br />
      <p>Receipt:</p>
      
      <br />

    </div>
  </div>
</body>

</html>`;
}
