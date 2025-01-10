import { authFirebase } from '../config/firebase';
import { useAutotraderStore } from '../store/autotraderStore';
import { useUserStore } from '../store/userStore';
import { getCollectionFirebase, getSingleDocumentFirebase, updateDocumentFirebase } from '../utils/firebaseApi';
import Swal from 'sweetalert2/dist/sweetalert2.js';

export default function useStartStopAction({ setLoading, detail, setDetail }) {
  const { userPackage } = useUserStore();
  const { autotraders, getAutotraders } = useAutotraderStore();
    async function handleStartStop(action) {
      const productDataFromUserPackage = await getSingleDocumentFirebase('products', userPackage?.productId);
      const activeAutotrader = autotraders?.filter((autotrader) => autotrader?.status === 'ACTIVE');
      console.log(autotraders,'autotraders')
      if (activeAutotrader?.length > productDataFromUserPackage?.autotraders) {
        return Swal.fire({
          icon : 'warning',
          title: `Your account already activated ${productDataFromUserPackage?.autotraders} autotrader`,
          text : `You only have maximum of ${productDataFromUserPackage?.autotraders} active autotrader, please contact our support team for further information`
        })
      }
      // return console.log(productDataFromUserPackage, 'this is productDataFromUserPackage');
      // if (detail?.status === 'REQUESTED') return Swal.fire({
      //   icon : 'warning',
      //   title: 'Autotrader is on REQUESTED status',
      // })
      setLoading(true);
      try {
        // check if action === 'start', only 1 active autotrader is allowed
        // check if action === 'start', only 1 active autotrader is allowed
        // check if action === 'start', only 1 active autotrader is allowed
        // check if action === 'start', only 1 active autotrader is allowed
        if (action === 'start') {
          const findActiveAutotrader =  await getCollectionFirebase('dca_bots', [{field : 'status', operator :'==', value : 'ACTIVE'}, {field : 'email', operator : '==', value : authFirebase.currentUser?.email}]);
          console.log({findActiveAutotrader});
          if (Array.isArray(findActiveAutotrader) && findActiveAutotrader?.length > 0) {
            setLoading(false);
            return Swal.fire({
              icon : 'warning',
              title: 'Your account already activated one autotrader',
              text : 'You only have maximum of 1 (one) active autotrader, please contact our support team for further information'
            })
          }
        }

        const body = {
          action,
          bot_id: detail.bot_id,
        };
        const result = await fetch('/api/3commas/bot-activation', {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const res = await result.json();
        if (result.status === 200 || res.status === 'success') {
          // console.log('id bot:::::::', detail?.id);
          await updateDocumentFirebase('dca_bots', detail?.id, {
            status:
              action === 'start'
                ? 'ACTIVE'
                : action === 'stop'
                ? 'STOPPED'
                : 'invalid status',
          });
          Swal.fire({
            icon: 'success',
            title: `${action} bot success`,
            showConfirmButton: true,
            confirmButtonText: 'Close',
            
          }).then(() => {
            window.location.reload();
          })
          setDetail({
            ...detail,
            status: action === 'start' ? 'ACTIVE' : 'STOPPED',
          });
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'Update bot failed',
            text: `status code : ${res.status || 'unknown'}. ${res?.error || res?.data?.error}`,
          });
        }
        getAutotraders();
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