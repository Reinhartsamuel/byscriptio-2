import Swal from 'sweetalert2/dist/sweetalert2.js';
import { addDocumentFirebase, getCollectionFirebase } from '../utils/firebaseApi';

export default function useForceAction({ detail, setLoading, pair }) {
  const handleForce = async (action) => {
    console.log(pair);
    if (!pair)
      return Swal.fire({
        icon: 'warning',
        text: `Please select pair to force ${action} first!`,
      });
    const { isConfirmed, isDenied } = await Swal.fire({
      title: `Confirm force ${action} ${pair?.split('_')?.join(' ')}?`,
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: action,
      denyButtonText: 'cancel',
    });

    if (isDenied || !isConfirmed) return;
    setLoading(true);
    try {

      if (detail?.smart_trade && action == 'exit') {
        // find the latest smart trade on 3commas_logs where autotrader_id = detail?.id
        const latestSmartTrade = await getCollectionFirebase('3commas_logs', [
          {
            field: 'autotrader_id',
            operator: '==',
            value: detail?.id
          },
          {
            field: 'smart_trade_id',
            operator: '==',
            value: true
          }
        ],
        {
          field: 'createdAt',
          operator: 'desc',
        },
        1
      );
        console.log(latestSmartTrade, 'latestSmartTrade');
        if (latestSmartTrade?.length > 0) {
          const latestTrade = latestSmartTrade[0];
          const res = await fetch('/api/3commas/smart-trade/execute/close-at-market-price-test',{
            method : 'POST',
            body: JSON.stringify({
              id : latestTrade?.smart_trade_id
            })
          })
          const result = await res.json();
          await addDocumentFirebase('3commas_logs', {
            name: detail?.name || '',
            email: detail?.email || '',
            uid: detail.uid || '',
            trading_plan_id: detail.trading_plan_id,
            autotrader_id: detail.id || '',
            createdAt: new Date(),
            action: action.toUpperCase(),
            type: `CLOSE_${latestTrade.action}`,
            smart_trade_id: String(result?.id),
            exchange_external_id: String(latestTrade?.exchange_external_id) || '',
            exchange_thumbnail: latestTrade?.exchange_thumbnail || '',
            exchange_name: latestTrade?.exchange_name || '',
            pair: pair,
            smart_trade: true,
            ...result
          })
          Swal.fire({
            title: 'Success',
            text: `${action} smart trade success`,
            icon: 'success',
          });
        } else {
          Swal.fire({
            title: 'Oops',
            text: `Smart trade cannot be found`,
            icon: 'error',
          });
        }
        return;
      }
      const sendBodyTo3Commas = {
        message_type: 'bot',
        bot_id: detail?.bot_id.toString() || '',
        email_token: '52c6860e-5814-47ed-a5ae-663d78446439',
        delay_seconds: 0,
        pair: pair,
      };
      if (action === 'exit') {
        sendBodyTo3Commas.action = 'close_at_market_price';
      }
      console.log(sendBodyTo3Commas, 'body to 3commas');
      const res = await fetch('/api/signal/force-entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sendBodyTo3Commas),
      });

      const result = await res.json();
      if (!res.status == 200 && !result.status == 200)
        throw new Error('action not successful!');
      // console.log(result, 'result');

      Swal.fire({
        title: 'Success',
        text: `${action} autotrader success`,
        icon: 'success',
      });
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
      });
    } finally {
      setLoading(false);
    }
  };
  return { handleForce };
}
