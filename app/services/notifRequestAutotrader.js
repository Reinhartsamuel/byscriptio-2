import moment from 'moment';
import { authFirebase } from '../config/firebase';

export default async function notifRequestAutotrader(docId) {
  await Promise.all([
    await fetch('/api/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          email: 'byscript@gmail.com',
          name: 'byScript',
        },
        to: [
          {
            name:
              authFirebase?.currentUser?.displayName ||
              authFirebase?.currentUser?.email?.split('@')[0],
            email: authFirebase?.currentUser?.email,
          },
        ],
        subject: 'Request Akun Autotrader Baru',
        htmlContent: `<p>Kamu telah melakukan pendaftaran akun Autotrader baru. Kami akan informasikan via email ketika akun Autotrader sudah aktif. [id: ${docId}]</p>`,
      }),
    }),
    await fetch('/api/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          email: 'byscript@gmail.com',
          name: 'byScript',
        },
        to: [
          {
            name: 'Reinhart Samuel',
            email: 'reinhartsams@gmail.com',
          },
          {
            name: 'Edwin Ardyanto',
            email: 'edwinfardyanto@gmail.com',
          },
        ],
        subject: 'Permintaan akun Autotrader baru (dca_bot)',
        htmlContent: `<p>${authFirebase.currentUser.email} ${
          authFirebase.currentUser.displayName
        } telah melakukann pendaftaran akun Autotrader pada ${moment().format(
          'dddd, DD MMM YYYY HH:mm'
        )} dengan ID ${docId}. Pastikan memberi notifikasi via email ketika dca bot sudah aktif</p>`,
      }),
    }),
  ]);
}
