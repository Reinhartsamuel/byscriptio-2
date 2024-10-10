'use client';
import React, { useEffect, useRef, useState } from 'react';
import Calendar from 'react-calendar';
import moment from 'moment';
import './calendar.css';
import { localeId } from './momentLocale';
import { FaRegCalendarCheck, FaRegClock } from 'react-icons/fa';
import { SiGooglemeet } from 'react-icons/si';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import PrevNextButton from '../components/PrevNextButton';

const images = [
  'https://firebasestorage.googleapis.com/v0/b/saudagar-staging.appspot.com/o/transfer-receipt%2FKrTqD6lD4yQtTW0SyKe2pFTUFbx2%2FWhatsApp%20Image%202024-07-03%20at%2016.47.07%20(1).jpeg?alt=media&token=adc17bb9-b5fd-4164-ad9a-ffc1f5a4b731',
  'https://firebasestorage.googleapis.com/v0/b/saudagar-staging.appspot.com/o/transfer-receipt%2FKrTqD6lD4yQtTW0SyKe2pFTUFbx2%2FWhatsApp%20Image%202024-07-03%20at%2016.47.07.jpeg?alt=media&token=2ffe2868-5089-4c0e-86e9-4fa1a2cbbcb1',
  'https://firebasestorage.googleapis.com/v0/b/saudagar-staging.appspot.com/o/transfer-receipt%2FKrTqD6lD4yQtTW0SyKe2pFTUFbx2%2Fstory.jpg?alt=media&token=1efc590d-b2d7-4f6f-8402-319cf15b3d82',
  'https://i.ibb.co.com/X7kP5mR/gmeet.jpg',
];
const meet =
  'https://firebasestorage.googleapis.com/v0/b/saudagar-staging.appspot.com/o/transfer-receipt%2FKrTqD6lD4yQtTW0SyKe2pFTUFbx2%2Fgoogle-meet.256x256.png?alt=media&token=34ef05de-b914-4adf-8444-11d27bec8fdc';

const MeetingBookingComponent = ({ setIndex, data, setData }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const inputDateRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const cancelRef = useRef(null);
  const toast = (message) => {
    console.log(message);
  };

  const handleNext = () => {
    console.log(data);
    setIndex((prev) => prev + 1);
    setIsOpen(false);
  };

  const handleOpenModal = () => {
    const inTimeWindow =
      moment(selectedDate).format('HH') >= '11' &&
      moment(selectedDate).format('HH') <= '17' &&
      moment(selectedDate).format('mm') <= '59';
    console.log(moment(selectedDate).format('HH:mm'));
    console.log(inTimeWindow, 'inTimeWindow');
    if (!inTimeWindow)
      return Swal.fire({
        icon: 'error',
        title: 'Tidak tersedia',
        text: 'Mohon pilih waktu antara Senin - Jumat pukul 11:00 - 17:00 WIB',
      });
    setIsOpen(true);
    setData({
      ...data,
      conferenceStart: moment(selectedDate)
        .utcOffset(7 * 60)
        .format(),
      conferenceEnd: moment(selectedDate)
        .utcOffset(7 * 60)
        .add(1, 'hours')
        .format(),
    });

    Swal.fire({
      title: 'Apakah tanggal onboarding sudah sesuai?',
      html: `<div style:'display:flex; flex-direction:column; justify-items:center;'>
      <p style='color:white;'>${moment(selectedDate).format(
        'dddd, D MMMM YYYY'
      )}</p>
      <p style='color:white;'>${moment(selectedDate).format('HH:mm')} WIB</p>
      </div>`,
      text: 'Tanggal onboarding dapat disesuaikan kembali dengan tim kami sesuai ketersediaan jadwal',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Lanjut',
      denyButtonText: `Batal`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        handleNext();
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info');
      }
    });
  };

  useEffect(() => {
    localeId();
  }, []);

  return (
    <div className='max-w-7xl pt-20'>
      <div className='flex flex-col items-center justify-center mb-20'>
        <div className='flex justify-center mb-5 gap-5'>
          <img src={meet} alt='meet' className='w-14 h-14' />
          <p className='text-xl font-bold text-start'>
            Pilih tanggal online meeting onboarding 1 on 1 dengan tim kami:
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-10 mt-20'>
          <Calendar
            onChange={(e) => setSelectedDate(e)}
            minDate={new Date()}
            maxDate={moment().add(7, 'days').toDate()}
            activeStartDate={new Date()}
          />
          <div className='flex flex-col items-center'>
            <h2 className='text-2xl text-gray-100'>
              {moment(selectedDate).format('dddd, D MMMM YYYY')}
            </h2>
            <h2 className='text-2xl text-gray-100'>
              {moment(selectedDate).format('HH:mm')} WIB
            </h2>
            <p className='text-gray-500 text-thin'>Pilih Jam :</p>
            <input
              type='time'
              ref={inputDateRef}
              className='mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              onChange={(e) => {
                setSelectedDate((prev) =>
                  moment(prev).set({
                    hour: parseInt(e.target.value.split(':')[0]),
                    minute: parseInt(e.target.value.split(':')[1]),
                  })
                );
              }}
              value={moment(selectedDate).format('HH:mm')}
            />
            <p className='text-yellow-500 font-bold'>
              Harap memilih antara pukul 11:00 - 17:00
            </p>
          </div>
        </div>
        <p className='text-center text-gray-400 italic'>
          <sup>*</sup>Kamu akan menerima undangan Google Meet via email untuk
          onboarding auto trade bersama byScript. GRATIS satu bulan subscription
          trading plan untuk satu akun exchange
        </p>
      </div>
      <div className='flex justify-end'>
        <PrevNextButton setIndex={setIndex} nextFunction={handleOpenModal} />
      </div>

      <div className='divider my-50'></div>

      <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10 mt-10'>
        {images.map((x, i) => (
          <img
            key={i}
            src={x}
            alt='onboarding'
            className='w-full object-cover'
          />
        ))}
      </div>
    </div>
  );
};

export default MeetingBookingComponent;
