'use client';
import React, { useState } from 'react';
import Modal from './ui/Modal';
import { cn } from '@/lib/util';
import Spinner from './ui/Spinner';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { FaRegCopy } from 'react-icons/fa6';
import { useUserStore } from '../store/userStore';
import calculateCommission from '../utils/calculateCommission';
import { uploadFileCompressed } from '../utils/imageUpload';
import { authFirebase } from '../config/firebase';
import { addDocumentFirebase } from '../utils/firebaseApi';

const ModalPurchasePlan = ({ purchaseModal, setPurchaseModal, detail }) => {
  const { customer } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [data, setData] = useState({
    productId: detail?.id,
    productName: detail?.name,
    price: parseInt(detail?.price || 0),
    affiliateCommission: customer?.affiliatorCustomerId
      ? calculateCommission(
          customer?.affiliateLevel,
          parseInt(detail?.price) || 0
        ).amount
      : 0,
    affiliatePercentage: customer?.affiliatorCustomerId
      ? calculateCommission(
          customer?.affiliateLevel,
          parseInt(detail?.price) || 0
        ).percentage
      : 0,
      affiliator : customer?.affiliator || {},
    receiptUrl: '',
    uid: authFirebase.currentUser?.uid || customer?.uid,
    name: authFirebase.currentUser?.displayName || customer?.name,
    email: authFirebase.currentUser?.email || customer?.email,
    customerId: customer?.id,
    paymentStatus : 'WAITING'
  });

  async function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      Swal.fire({
        icon: 'success',
        title: 'Copied!',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message,
      });
    }
  }
  const handleUpload = async (e) => {
    setUploading(true);
    // console.log(e.target.files[0], 'this is filesss');
    try {
      const { url, error } = await uploadFileCompressed(e.target.files[0]);
      if (error) throw new Error(error);
      if (url) setData({ ...data, receiptUrl: url });
    } catch (error) {
      console.error(error.message, '::::errorrr!!!');
      Swal.fire('Error', error.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  async function handleSubmit() {
    setLoading(true);
    try {
      console.log(data);
      await addDocumentFirebase('subscriptions', {...data}, 'byscript')
      Swal.fire('Your purchase is being processed. Please wait until we confirm your payment. For help please contact WA 0813 1338 3848 - Edwin');
      setPurchaseModal(false);
    } catch (error) {
      console.error(error.message, 'errrorrr handleupload');
    } finally {
      setLoading(false);
    }
  }
  return (
    <Modal open={purchaseModal} onClose={() => setPurchaseModal(false)}>
      <div className='flex items-center justify-between p-4 md:p-5 rounded-t dark:border-gray-600'>
        <div className='flex flex-col gap-2'>
          <h3 className='text-xl font-semibold text-gray-500 dark:text-white'>
            Purchase {detail?.name}
          </h3>
          <p className='font-extralight text-sm text-slate-400 whitespace-wrap'>
            Before purchasing anything on{' '}
            <span className='font-ecoCoding'>byScript.io</span>, please read the{' '}
            <a
              href={`https://byscript.io/termsConditions`}
              target='_blank'
              rel='noreferrer'
              className='underline text-blue-500'
            >
              Terms and Conditions
            </a>{' '}
            of our <span className='font-ecoCoding'>byScript.io</span>
          </p>
          <div className='flex gap-2'>
            <input type='checkbox' />
            <p>
              I have read and agree to the{' '}
              <a
                href={`https://byscript.io/termsConditions`}
                target='_blank'
                rel='noreferrer'
                className='underline text-blue-500'
              >
                Terms and Conditions
              </a>{' '}
            </p>
          </div>
        </div>
      </div>
      {/* <pre>{JSON.stringify(detail, null, 2)}</pre> */}
      <div className='flex flex-col items-center gap-4 mt-5'>
        <div className='flex flex-col border-2 rounded-sm border-gray-500 p-4'>
          <h2 className='text-xl text-orange-400'>{detail?.name}</h2>
          <div className='flex items-center'>
            <h2 className='text-3xl font-bold text-gray-50'>{detail?.price}</h2>
            <button
              onClick={() => copyTextToClipboard(detail?.price)}
              className='ease-out duration-100 hover:scale-105 hover:shadow-lg active:scale-95 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700'
            >
              <FaRegCopy size={20} />
            </button>
          </div>
          <div className='flex flex-col gap-0'>
            {detail?.features?.map((feature, j) => {
              // Use regex to split the string around numbers
              const parts = feature.split(/(\d+)/);
              return (
                <li className='flex gap-1' key={j}>
                  <svg
                    className='flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      fillRule='evenodd'
                      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                      clipRule='evenodd'
                    ></path>
                  </svg>
                  {parts.map((part, index) => {
                    // Check if the part is a number
                    if (!isNaN(part) && part.trim() !== '') {
                      // Determine spaces based on position of the number in the string
                      const isAtStart = index === 0;
                      const isAtEnd = index === parts.length - 1;
                      return (
                        <React.Fragment key={index}>
                          {!isAtStart && ' '}{' '}
                          {/* space before if not at start */}
                          <strong>{part}</strong>
                          {!isAtEnd && ' '} {/* space after if not at end */}
                        </React.Fragment>
                      );
                    }
                    return part; // For non-number parts, return as is
                  })}
                </li>
              );
            })}
          </div>
        </div>
      </div>

      <div className='w-full p-4 flex flex-col items-center justify-center my-5'>
        <img
          src='https://scontent.fcgk3-2.fna.fbcdn.net/v/t39.30808-6/359784941_583814940593962_1863910751664855921_n.jpg?_nc_cat=1&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeH-EjxDm-e-eSzlUIShsU-VxMSLvjfuHF7ExIu-N-4cXqgkgYT-s3yNIgMoGxyrFznU7d3M88tBJymz-rsliTqU&_nc_ohc=UZ0oBvvyaMcQ7kNvgFs55HL&_nc_zt=23&_nc_ht=scontent.fcgk3-2.fna&_nc_gid=AreQzIbPVBDEEc3f-JaTez8&oh=00_AYD0fNEQMy7MQvuJ4-o2oJRv49eZ9ifyOFKvmRTi5W_l-w&oe=6730F92B'
          className='w-20'
        />
        <p className='font-bold text-gray-300 text-sm'>BLU by BCA DIGITAL</p>
        <div className='flex items-center'>
          <p className='font-bold text-2xl'>EDWIN FATHUDIN ARDYANTO</p>
          <button
            onClick={() => copyTextToClipboard('Edwin Fathudin Ardyanto')}
            className='ease-out duration-100 hover:scale-105 hover:shadow-lg active:scale-95 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700'
          >
            <FaRegCopy size={20} />
          </button>
        </div>
        <div className='flex items-center'>
          <p className='font-bold text-yellow-300 text-xl'>090000000080</p>
          <button
            onClick={() => copyTextToClipboard('090000000080')}
            className='ease-out duration-100 hover:scale-105 hover:shadow-lg active:scale-95 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700'
          >
            <FaRegCopy size={20} />
          </button>
        </div>
      </div>

      <div className='flex justify-center'>
        <p>{uploading ? 'Uploading...' : 'Payment Receipt / bukti transfer'}</p>
        {uploading && <Spinner />}
      </div>

      {data?.receiptUrl ? (
        <div className='flex w-full justify-center'>
          <img src={data?.receiptUrl} className='w-3/4' />
        </div>
      ) : (
        <div className='flex items-center justify-center w-full'>
          <label
            htmlFor='dropzone-file'
            className='flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600'
          >
            <div className='flex flex-col items-center justify-center pt-5 pb-6'>
              <svg
                className='w-8 h-8 mb-4 text-gray-500 dark:text-gray-400'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 20 16'
              >
                <path
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2'
                />
              </svg>
              <p className='mb-2 text-sm text-gray-500 dark:text-gray-400'>
                <span className='font-semibold'>Click to upload</span> or drag
                and drop
              </p>
              <p className='text-xs text-gray-500 dark:text-gray-400'>
                SVG, PNG, or JPG
              </p>
            </div>
            <input
              id='dropzone-file'
              type='file'
              className='hidden'
              onChange={handleUpload}
            />
          </label>
        </div>
      )}

      <div className='flex flex-wrap gap-1 justify-end items-center p-4 md:p-5 border-t border-gray-200 dark:border-gray-600'>
        <button
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-600 text-white bg-green-600 hover:bg-green-700 active:bg-green-500 transition duration-200',
            loading ? 'opacity-50 cursor-not-allowed whitespace-nowrap' : '',
            'whitespace-nowrap' // add this to prevent text from breaking into a new line
          )}
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading ? <Spinner /> : <p>Submit</p>}
        </button>
      </div>
    </Modal>
  );
};

export default ModalPurchasePlan;

ModalPurchasePlan.propTypes = {
  purchaseModal: PropTypes.bool,
  setPurchaseModal: PropTypes.any,
  detail: PropTypes.any,
};
