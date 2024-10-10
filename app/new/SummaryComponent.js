'use client';

import React, { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import moment from 'moment';
import {
  addDocumentFirebase,
  getCollectionFirebase,
  updateDocumentFirebase,
} from '../utils/firebaseApi';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import Spinner from '../components/ui/Spinner';

const SummaryComponent = ({ setIndex, data, setData }) => {
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async () => {
    console.log(data);
    setLoading(true);
    try {
      const findCustomer = await getCollectionFirebase('customers', [
        { field: 'email', operator: '==', value: data.email },
      ]);
      const customerAlreadyExists = findCustomer?.length > 0;

      // console.log(findCustomer, 'findCustomer');
      // console.log(customerAlreadyExists, 'customerAlreadyExists');

      if (customerAlreadyExists) {
        await updateDocumentFirebase('customers', findCustomer[0]?.id, data);
      } else {
        await addDocumentFirebase('customers', {
          ...data,
          isNewUser: true,
          joinedAt: new Date(),
        });
      }

      const postData = {
        ...data,
        summary: `Onboarding 1 on 1 ${data?.name} bersama byScript`,
        location: 'Online',
        description: `Onboarding 1 on 1 ${data?.name} bersama byScript`,
        start: { dateTime: data?.conferenceStart, timeZone: 'Asia/Jakarta' },
        end: { dateTime: data?.conferenceEnd, timeZone: 'Asia/Jakarta' },
        attendees: [
          { email: 'edwinfardyanto@gmail.com' },
          { email: 'reinhartsams@gmail.com' },
          { email: data?.email },
        ],
      };
      const res = await fetch('/api/calendar/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
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
          cc: [
            {
              name: 'Reinhart',
              email: 'reinhartsams@gmail.com',
            },
          ],
          to: [
            {
              name: 'Edwin Ardyanto',
              email: 'edwinfardyanto@gmail.com',
            },
          ],
          subject: 'Pendaftar Baru',
          htmlContent: `<p>Seseorang telah mendaftar di byScript nama : <strong>${data?.name}</strong> email : ${data?.email}, onboarding : ${data?.conferenceStart}</p>`,
        }),
      });

      const result = await res.json();
      if (!result.status) throw new Error(result.message);
      setData({ ...data, response: result?.data });
      setIsSubmitted(true);
      console.log(result, 'result bikin calendar');
      Swal.fire({
        title: 'Calendar reminder for onboarding successfully created',
        icon: 'success',
      });
    } catch (error) {
      Swal.fire({
        title: error.message,
        icon: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className='max-w-4xl pt-20'>
        {!isSubmitted && (
          <>
            <h1 className='mx-auto text-center text-3xl font-bold'>Summary</h1>
            <div className='mt-10'>
              <div className='flex gap-2'>
                <p className='text-gray-400'>Nama :</p>
                <p className='font-bold text-uppercase'>{data?.name}</p>
              </div>
              <div className='flex gap-2'>
                <p className='text-gray-400'>Email :</p>
                <p className='font-bold'>{data?.email}</p>
              </div>
              <div className='flex gap-2'>
                <p className='text-gray-400'>Nomor HP :</p>
                <p className='font-bold'>{data?.phoneNumber}</p>
              </div>
              <div className='flex gap-2'>
                <p className='text-gray-400'>Onboarding :</p>
                <p className='font-bold'>
                  {moment(data?.conferenceStart)?.format(
                    'dddd, D MMMM YYYY HH:mm'
                  )}
                  {' - '}
                  {moment(data?.conferenceEnd)?.format('HH:mm')}
                </p>
              </div>
            </div>
            <button
              className='bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-2 px-4 rounded mt-10 w-full disabled:opacity-50'
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? <Spinner /> : <p>Submit</p>}
            </button>
          </>
        )}

        {isSubmitted && data?.response?.htmlLink && (
          <>
            <div className='flex flex-col justify-center'>
              <p
                className='text-3xl font-bold text-center'
                style={{
                  lineHeight: 1.2,
                }}
              >
                Terima kasih{' '}
                <span
                  className='bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text'
                  style={{
                    fontWeight: 'bold',
                  }}
                >
                  {data?.name}
                </span>
                , untuk mendaftar onboarding, silakan tekan tombol di bawah ini
                untuk konfirmasi ke Whatsapp. Sampai bertemu di onboarding, ya!!
              </p>
              <p className='text-gray-400 text-center mt-5'>
                <sup>*</sup>
                <span
                  className='text-red-500 font-bold'
                  style={{
                    fontWeight: 'bold',
                  }}
                >
                  PENTING!!
                </span>
                Mohon untuk konfirmasi via Whatsapp pada tombol di bawah, jika
                tidak maka meeting onboarding dapat kami batalkan sepihak.
              </p>
            </div>

            <div className='flex flex-col justify-center mx-auto items-center'>
              <img
                src={
                  'https://i0.wp.com/sifugadget.com/wp-content/uploads/2024/02/Arrows-3-pointing-down-arrow-down-animated.gif?fit=300%2C158&ssl=1'
                }
                width={200}
              />
              <button
                className='bg-green-500 text-white font-bold py-2 px-4 rounded'
                onClick={() =>
                  window.open(
                    `https://wa.me/6281313383848/?text=Halo kak, saya ${
                      data?.name
                    } sudah mendaftar onboarding byScript dan pada hari ${moment(
                      data?.conferenceStart
                    ).format(
                      'dddd, D MMMM YYYY HH:mm'
                    )} WIB. Mohon dikonfirmasi ya kak. Terima kasih!`
                  )
                }
                size={'lg'}
              >
                <div className='flex gap-2'>
                  <FaWhatsapp color={'white'} size={20} />
                  <p>Konfirmasi Whatsapp</p>
                </div>
              </button>
              <img
                transform={'rotate(180deg)'}
                className='rotate-180'
                src={
                  'https://i0.wp.com/sifugadget.com/wp-content/uploads/2024/02/Arrows-3-pointing-down-arrow-down-animated.gif?fit=300%2C158&ssl=1'
                }
                width={200}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SummaryComponent;
