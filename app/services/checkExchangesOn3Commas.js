import { exchanges } from '../dummy';
import {
  addDocumentFirebase,
  getCollectionFirebase,
} from '../utils/firebaseApi';
import { authFirebase } from '../config/firebase';
import Swal from 'sweetalert2/dist/sweetalert2.js';

function getType(exchange_type) {
  const lowercase = exchange_type.toLowerCase();
  if (lowercase.includes('spot')) return 'SPOT';
  if (lowercase.includes('futures')) return 'FUTURES';
  if (lowercase.includes('margin')) return 'MARGIN';
}
function getName(exchange_type) {
  const lowercase = exchange_type.toLowerCase();
  if (lowercase.includes('binance')) return 'BINANCE';
  if (lowercase.includes('bybit')) return 'BYBIT';
  if (lowercase.includes('okx')) return 'OKX';
  if (lowercase.includes('kraken')) return 'KRAKEN';
  if (lowercase.includes('coinex')) return 'COINEX';
  if (lowercase.includes('gate')) return 'GATE';
  if (lowercase.includes('kucoin')) return 'KUCOIN';
  if (lowercase.includes('bitget')) return 'BITGET';
  if (lowercase.includes('gemini')) return 'GEMINI';
  if (lowercase.includes('bitfinex')) return 'BITFINEX';
}

export async function onCheck3CApi({
  setLoading,
  customer,
  exchangeThumbnail,
  exchangeName,
}) {
  setLoading(true);
  try {
    await fetch('/api/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          email: 'info@byscript.io',
          name: 'byScript',
        },
        to: [
          {
            name: 'Edwin Ardyanto',
            email: 'edwinfardyanto@gmail.com',
          },
          {
            name: 'Reinhart Samuel',
            email: 'reinhartsams@gmail.com',
          },
        ],
        subject: 'Info User Connect Exchange',
        htmlContent: `<p>${
          authFirebase?.currentUser?.displayName || customer?.name
        } ${
          authFirebase.currentUser?.email &&
          `(${authFirebase.currentUser?.email})`
        } ${
          customer?.id && `(id: ${customer?.id})`
        } tried to connect exchange ${exchangeName} on ${new Date().toDateString()}</p>`,
      }),
    });
    const res = await fetch(
      '/api/3commas/accounts/user-connected-exchanges/rsa'
    );
    const { data, error } = await res.json();
    if (error) throw new Error(error);
    console.log(
      data.map((x) => ({
        name: x.name,
        id: x.id,
        type: getType(x.exchange_name),
        exchange_name: getName(x.exchange_name),
        exchange_thumbnail: exchanges.find(
          (y) => y.exchange_name === getName(x.exchange_name)
        ).exchange_thumbnail,
      })),
      'onCheck3CApi'
    );
    const myExchange = data?.filter((x) => x.name === customer?.id);
    console.log({ myExchange });
    if (myExchange?.length > 0) {
      const ids = await Promise.all(
        myExchange.map(async (exchange) => {
          const find = await getCollectionFirebase('exchange_accounts', [
            {
              field: 'external_id',
              operator: '==',
              value: exchange.id,
            },
          ]);
          console.log(find, 'find');
          if (find.length > 0) {
            return 'found';
          } else {
            const addData = {
              customerId: customer.id,
              external_id: exchange.id,
              uid: authFirebase.currentUser?.uid,
              email: authFirebase.currentUser?.email || customer?.email,
              name: authFirebase?.currentUser?.displayName || customer?.name,
              exchange_name: exchangeName,
              exchange_thumbnail: exchangeThumbnail,
              type: getType(exchange.exchange_name),
            };
            console.log(addData, 'addData');
            return await addDocumentFirebase(
              'exchange_accounts',
              addData,
              'byscript'
            );
          }
        })
      );
      if (ids.length > 0) window.location.reload();
    } else {
      console.log('not found');
      Swal.fire({
        title: 'Not Found',
        text: `Please make sure you already copied the above id (${customer?.id}) to exchange portal!`,
        icon: 'error',
      });
    }
  } catch (error) {
    Swal.fire({
      title: 'Something went wrong',
      text: error.message,
      icon: 'error',
    });
  } finally {
    setLoading(false);
  }
}
