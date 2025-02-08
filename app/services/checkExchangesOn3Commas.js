import {
  getCollectionFirebase,
  setDocumentFirebase,
} from '../utils/firebaseApi';
import { authFirebase } from '../config/firebase';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import exchangeConnectTemplate from '../utils/emailHtmlTemplates/exchangeConnectTemplate';
import moment from 'moment';

function getType(exchange_type) {
  const type = exchange_type.toLowerCase();
  if (type.includes('spot')) return 'SPOT';
  if (type.includes('futures')) return 'FUTURES';
  if (type.includes('margin')) return 'MARGIN';
}
function getName(exchange_type) {
  const type = exchange_type.toLowerCase();
  if (type.includes('binance')) return 'BINANCE';
  if (type.includes('bybit')) return 'BYBIT';
  if (type.includes('okx')) return 'OKX';
  if (type.includes('kraken')) return 'KRAKEN';
  if (type.includes('coinex')) return 'COINEX';
  if (type.includes('gate')) return 'GATE';
  if (type.includes('kucoin')) return 'KUCOIN';
  if (type.includes('bitget')) return 'BITGET';
  if (type.includes('gemini')) return 'GEMINI';
  if (type.includes('bitfinex')) return 'BITFINEX';
}

export async function onCheck3CApi({
  setLoading,
  customer,
  exchangeThumbnail,
  exchangeName,
  newlyCreatedId
}) {
  setLoading(true);
  try {
    const res = await fetch(
      `/api/3commas/accounts/user-connected-exchanges/rsa?time=${new Date().getTime()}`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
      cache : 'no-store'
    });
    const { data, error } = await res.json();

    if (error) throw new Error(error);

    console.log(`checking accounts with name ${newlyCreatedId}`);
    const myExchange = data?.filter((x) => x.name === newlyCreatedId);
    console.log({ myExchange });


    if (myExchange?.length > 0) {
      const exchangeData = myExchange[0];

      const find = await getCollectionFirebase('exchange_accounts', [
        {
          field: 'external_id',
          operator: '==',
          value: exchangeData.id,
        },
      ]);

      if (find?.length > 0) {
        throw new Error('Already connected');
      }
      const addData = {
        customerId: customer.id,
        external_id: exchangeData.id,
        uid: authFirebase.currentUser?.uid,
        email: authFirebase.currentUser?.email || customer?.email,
        name: authFirebase?.currentUser?.displayName || customer?.name,
        exchange_name: getName(exchangeData.exchange_name),
        exchange_thumbnail: exchangeThumbnail,
        type: getType(exchangeData.exchange_name),
      };

      await setDocumentFirebase(
        'exchange_accounts',
        newlyCreatedId,
        addData,
      );
      await Promise.allSettled([
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
            htmlContent: `<p>${authFirebase?.currentUser?.displayName || customer?.name
              } ${authFirebase.currentUser?.email &&
              `(${authFirebase.currentUser?.email})`
              } ${customer?.id && `(id: ${customer?.id})`
              } tried to connect exchange ${exchangeName} on ${new Date().toDateString()}</p>
              <p>Account Id : ${exchangeData.id}</p> 
              <p>Exhcange name : ${exchangeData.name}</p> 
              <p>Type : ${getType(exchangeData.exchange_name)}</p> 
              <p>Balance : USD ${exchangeData?.primary_display_currency_amount?.amount}</p> 
              `,
          }),
        }),
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
                name: customer.name,
                email: customer.email
              }
            ],
            subject: `${getName(exchangeData.exchange_name)} Exchange Connected to byScript`,
            htmlContent: exchangeConnectTemplate({
              connectedAt: moment().format('dddd, DD MMM YYYY HH:mm'),
              exchange_thumbnail: exchangeThumbnail,
              balance: exchangeData?.primary_display_currency_amount?.amount
            })
          })
        })
      ])
      Swal.fire({
        title: "Exchange connected",
        showDenyButton: false,
        showCancelButton: false,
        confirmButtonText: "Close",
      }).then(() => {
        /* Read more about isConfirmed, isDenied below */
        window.location.reload()
      })
    } else {
      console.log('not found');
      Swal.fire({
        title: 'Not Found',
        text: `Please make sure you already copied the above id (${newlyCreatedId}) to exchange portal!`,
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
