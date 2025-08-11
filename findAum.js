async function calculateTotalUsd() {
  console.log('initiating...')
  const res = await fetch('https://byscript.io/api/playground/3commas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "queryParams": "/ver1/accounts",
      "method": "GET"
    })
  });
  const { data: accounts } = await res.json();
  const totalUsd = accounts.reduce((acc, account) => acc + parseFloat(account.usd_amount), 0);

	console.log(totalUsd, 'totalUsd');
}
calculateTotalUsd()
