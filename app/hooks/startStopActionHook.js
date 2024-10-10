import { updateDocumentFirebase } from '../utils/firebaseApi';
import Swal from 'sweetalert2/dist/sweetalert2.js';

export default function useStartStopAction({ setLoading, detail, setDetail }) {
    async function handleStartStop(action) {
      // return console.log(detail, 'this is detail');
      setLoading(true);
      try {
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
          console.log('id bot:::::::', detail?.id);
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
          });
          setDetail({
            ...detail,
            status: action === 'start' ? 'ACTIVE' : 'STOPPED',
          });
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'update bot to 3commas seems failed',
            text: `status code : ${res.status || 'unknown'}`,
          });
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