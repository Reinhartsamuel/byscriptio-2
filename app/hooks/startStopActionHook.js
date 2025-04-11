import { authFirebase } from '../config/firebase';
import { useAutotraderStore } from '../store/autotraderStore';
import { useUserStore } from '../store/userStore';
import { getCollectionFirebase, getSingleDocumentFirebase, updateDocumentFirebase } from '../utils/firebaseApi';
import Swal from 'sweetalert2/dist/sweetalert2.js';

export default function useStartStopAction({ setLoading, detail, setDetail }) {
  const { userPackage } = useUserStore();
  const {
    autotraders,
    getAutotraders
  } = useAutotraderStore();

  async function updateStatus(action) {
    // update dca_bots
    await updateDocumentFirebase('dca_bots', detail?.id, {
      status: action === 'start' ? 'ACTIVE' : 'STOPPED'
    })
    setDetail({
      ...detail,
      status:action === 'start' ? 'ACTIVE' : 'STOPPED'
    });

    Swal.fire({
      icon: 'success',
      title: `${action} bot success`,
      showConfirmButton: true,
      confirmButtonText: 'Close',
    }).then(() => {
      // window.location.reload();
      getAutotraders(authFirebase.currentUser?.email);
    })
  }

  async function handleStartStop(action) {
    setLoading(true);
    try {
      if (action === 'stop') {
        // detail.status has to be 'ACTIVE'
        if (detail?.status !== 'ACTIVE') {
          return Swal.fire({
            icon: 'warning',
            title: `Bot is not active`,
            text: `Bot status is ${detail?.status}`,
          })
        }

        // check latest 3commas_logs
        const latestLogs = await getCollectionFirebase(
          '3commas_logs',
          [{ field: 'autotrader_id', operator: '==', value: detail?.id }],
          { field: 'createdAt', direction: 'desc' },
          1
        );
        // console.log('latestLogs:::::::', latestLogs);
        if (latestLogs.length > 0) {
          // check the smart trade entity
          const res = await fetch(`/api/signal/smart-trade/get?id=${latestLogs[0]?.smart_trade_id}`);
          const { data, error } = await res.json();
          // console.log('resData:::::::', data);
          if (error) {
            // console.log('error:::::::', error);
            throw new Error(error);
          }

          if (String(data?.status?.type)?.toLower !== 'finished') {
            // smart trade has to be panic_sold
            const res2 = await fetch(`/api/3commas/smart-trade/execute/close-at-market-price-test`, {
              method: 'POST',
              body: JSON.stringify({
                id: latestLogs[0]?.smart_trade_id,
              }),
              headers: {
                'Content-Type': 'application/json',
              },
            });
            // const result2 =
            await res2.json();
            // console.log('result2:::::::', result2);
            // if (result2?.status?.type !== '') {
            //   //
            // }
            // perform close at market price

          }
          await updateStatus(action);
        } else {
          await updateStatus(action);
        }
      } else if (action === 'start') {
        // detail.status must not be 'ACTIVE'
        if (detail?.status === 'ACTIVE') {
          return Swal.fire({
            icon: 'warning',
            title: `Bot is already active`,
            text: `Bot status is ${detail?.status}`,
          })
        }
        // get package details to see limit 
        const productDataFromUserPackage = await getSingleDocumentFirebase('products', userPackage?.productId);

        // get active autotraders
        const activeAutotrader = autotraders?.filter((autotrader) => autotrader?.status === 'ACTIVE');

        // determine if limit reached
        const limitReached = activeAutotrader?.length >= productDataFromUserPackage?.autotraders;
        if (limitReached) {
          return Swal.fire({
            icon: 'warning',
            title: `Your account already activated ${activeAutotrader?.length} autotrader(s)`,
            text: `You only have maximum of ${productDataFromUserPackage?.autotraders} active autotrader(s), please contact our support team for further information`
          })
        }
        await updateDocumentFirebase('dca_bots', detail?.id, {
          status: 'ACTIVE'
        })
        await updateStatus(action);
        return;
      } else {
        return Swal.fire({
          icon: 'warning',
          title: `Invalid action`,
          text: `Action must be start or stop`,
        })
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: `Error ${action} bot`,
        text: error.message + '!',
      });
    } finally {
      setLoading(false);
    }
  }

  return { handleStartStop };
}