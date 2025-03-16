import Swal from 'sweetalert2/dist/sweetalert2.js';

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
      const sendBodyTo3Commas = {
        message_type: 'bot',
        bot_id: detail?.bot_id.toString(),
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
