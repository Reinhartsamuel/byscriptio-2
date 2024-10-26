'use client';
import { authFirebase } from '@/app/config/firebase';
import { useUserStore } from '@/app/store/userStore';
import { addActivityLog } from '@/app/utils/activityLog';
import { getCollectionFirebase } from '@/app/utils/firebaseApi';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import React from 'react';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Pricing', href: '/#pricing' },
  // { name: "Events", href: "/event" },
  // { name: 'Subscription', href: '/subscriptions' },
  // { name: 'Marketplace', href: '/marketplace' },
  // { name: 'Affiliate', href: '/affiliate' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const { customer, ipLocation, clearIpLocation, setCustomer } = useUserStore();
  const handleLogout = async () => {
    try {
      await authFirebase.signOut();
      await addActivityLog({
        customerId: customer.id || null,
        uid: user.id || null,
        ipLocation: ipLocation,
        type: 'LOGOUT',
      });
      clearIpLocation();
      router.push('/');
    } catch (error) {
      window.alert(error.message);
    }
  };

  useEffect(() => {
    onAuthStateChanged(authFirebase, (user) => {
      if (user) {
        setUser(user);
        const name = user?.displayName || user?.email?.split('@')[0];
        router.push(`/${name?.toLowerCase()?.split(' ')?.join('-')}`);
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        // ...
      } else {
        setUser(null);
        router.push('/');
        // User is signed out
        // ...
      }
    });
  }, []);

  useEffect(() => {
    (async function () {
      if (!customer) {
        try {
          const customerFromDatabase = await getCollectionFirebase(
            'customers',
            [
              {
                field: 'email',
                operator: '==',
                value: authFirebase.currentUser?.email,
              },
            ]
          );
          setCustomer(customerFromDatabase[0]);
        } catch (error) {
          console.log(error.message);
        }
      }
    })();
  }, [authFirebase.currentUser]);
  return (
    <Disclosure as='nav'>
      <div className='px-2 border-b-[1px] border-b-slate-700 md:px-5'>
        <div className='relative flex h-16 items-center justify-between'>
          <div className='absolute inset-y-0 left-0 flex items-center sm:hidden'>
            {/* Mobile menu button*/}
            <DisclosureButton className='group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'>
              <span className='absolute -inset-0.5' />
              <span className='sr-only'>Open main menu</span>
              <Bars3Icon
                aria-hidden='true'
                className='block h-6 w-6 group-data-[open]:hidden'
              />
              <XMarkIcon
                aria-hidden='true'
                className='hidden h-6 w-6 group-data-[open]:block'
              />
            </DisclosureButton>
          </div>
          <div className='flex flex-1 items-center justify-center sm:items-stretch sm:justify-start'>
            <div className='flex flex-shrink-0 items-center'>
              <img
                alt='byScript'
                src='https://i.ibb.co.com/RB9rQy3/Whats-App-Image-2024-05-19-at-16-02-06.jpg'
                className='h-8 w-auto rounded-lg'
              />
            </div>
            <div className='hidden sm:ml-6 sm:block'>
              <div className='flex space-x-4'>
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    aria-current={item.current ? 'page' : undefined}
                    className={classNames(
                      item.current
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'rounded-md px-3 py-2 text-sm font-medium'
                    )}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className='absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0'>
            {/* Profile dropdown */}
            <div className='flex gap-4 items-center justify-center'>
              {/* <button onClick={() => console.log(user)}>cek</button> */}
              {!user ? (
                <button
                  className='relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50'
                  onClick={() => router.push('auth/login')}
                >
                  <span className='absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]' />
                  <span className='inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 text-sm font-medium text-white backdrop-blur-3xl'>
                    Sign In
                  </span>
                </button>
              ) : (
                <Menu as='div' className='relative ml-3'>
                  <MenuButton className='relative text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'>
                    <span className='absolute -inset-1.5' />
                    <span className='sr-only'>Open user menu</span>

                    <div className='flex gap-2'>
                      {user && (
                        <div className='flex flex-col items-center'>
                          <p className='text-gray-200'>{user?.displayName}</p>
                          <p className='text-gray-300 text-sm font-light'>
                            Pro plan
                          </p>
                        </div>
                      )}
                      <img
                        alt=''
                        src={
                          user?.photoURL ||
                          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
                        }
                        className='h-8 w-8 rounded-full'
                      />
                    </div>
                  </MenuButton>

                  <MenuItems
                    transition
                    className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-slate-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in'
                  >
                    <MenuItem cursor={'pointer'}>
                      <a
                        href={
                          user &&
                          (
                            user?.displayName?.replace(' ', '-') ||
                            user?.email?.split('@')[0]
                          )?.toLowerCase()
                        }
                        className='block px-4 py-2 text-sm text-gray-100 data-[focus]:bg-slate-600'
                      >
                        Dashboard
                      </a>
                    </MenuItem>
                    <MenuItem cursor={'pointer'}>
                      <a
                        href='#'
                        className='block px-4 py-2 text-sm text-gray-100 data-[focus]:bg-slate-600'
                      >
                        Settings
                      </a>
                    </MenuItem>
                    <MenuItem cursor={'pointer'}>
                      <a
                        onClick={handleLogout}
                        className='block px-4 py-2 text-sm text-gray-100 data-[focus]:bg-slate-600 cursor-pointer'
                      >
                        Sign out
                      </a>
                    </MenuItem>
                  </MenuItems>
                </Menu>
              )}
            </div>
          </div>
        </div>
      </div>

      <DisclosurePanel className='sm:hidden'>
        <div className='space-y-1 px-2 pb-3 pt-2'>
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as='a'
              href={item.href}
              aria-current={item.current ? 'page' : undefined}
              className={classNames(
                item.current
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                'block rounded-md px-3 py-2 text-base font-medium'
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
