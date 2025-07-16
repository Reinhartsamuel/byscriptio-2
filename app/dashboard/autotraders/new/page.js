'use client';
import { authFirebase } from '@/app/config/firebase';
import { addDocumentFirebase } from '@/app/utils/firebaseApi';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';
import Swal from 'sweetalert2/dist/sweetalert2.js';

const page = () => {
  const router = useRouter();
  const tradeAmount = useRef(null);
  const [loading, setLoading] = useState(false);
  const handleAdd = async () => {
    setLoading(true);
    try {
      if (!authFirebase.currentUser) {
        router.push('/');
        throw new Error('Sesi kamu telah habis');
      }
      const docId = await addDocumentFirebase('dca_bots', {
        tradeAmount: tradeAmount.current,
        uid: authFirebase.currentUser.uid,
        status: 'REQUESTED',
        requestedAt: new Date(),
        name : authFirebase?.currentUser?.displayName,
        email : authFirebase?.currentUser?.email
      });

      if (docId) {
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
                  name: authFirebase?.currentUser?.displayName || authFirebase?.currentUser?.email?.split('@')[0],
                  email: authFirebase?.currentUser?.email
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
              htmlContent: `<p>${authFirebase.currentUser.email} ${authFirebase.currentUser.displayName} telah melakukann pendaftaran akun Autotrader pada ${moment().format('dddd, DD MMM YYYY HH:mm')} dengan ID ${docId}. Pastikan memberi notifikasi via email ketika dca bot sudah aktif</p>`,
            }),
          }),
        ]);
      }
      Swal.fire({
        icon: 'success',
        title: 'Requested',
        text: `Akun AutoTrader berhasil direquest. Kami akan menginformasikan jika autotrader sudah aktif (1-2 hari kerja)
        [id:${docId}].`,
        showCancelButton: false,
        confirmButtonText: "Kembali",
        reverseButtons: false
      })
      // router.back();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className='w-screen min-h-screen flex justify-center mx-auto px-5'>
      <div className='mx-2 w-full mt-10 lg:w-[60%]'>
        <div className='flex w-full justify-center'>
          <p className='font-thin font-sans text-5xl'>Buat akun AutoTrader</p>
        </div>
        <div className='flex flex-col mt-10 gap-2 w-[90%] mx-auto'>
          <p>Jumlah nominal trading (USD)</p>
          <form>
            <input
              type='text'
              className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              placeholder='100 USD'
              required
              onChange={(e) => {
                tradeAmount.current = parseInt(e.target.value);
              }}
            />
            <button
              color='purple'
              onClick={handleAdd}
              disabled={loading}
              className='mt-2 w-full'
            >
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default page;
