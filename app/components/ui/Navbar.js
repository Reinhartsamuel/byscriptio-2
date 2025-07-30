"use client";
import { authFirebase } from "@/app/config/firebase";
import { useUserStore } from "@/app/store/userStore";
import { addActivityLog } from "@/app/utils/activityLog";
import { getCollectionFirebase } from "@/app/utils/firebaseApi";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { onAuthStateChanged } from "firebase/auth";
import moment from "moment";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import React from "react";
// import logo from "../../../public/logo_byScript_white_green.svg";
import logo from "../../../public/combination-mini.png";
import Image from "next/image";
import { setCookie } from "cookies-next";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Pricing", href: "/#pricing" },
  { name: "Announcements", href: "/announcement" },
  { name: "Documentation", href: `https://docs.byscript.io`, target: "_blank" },
  // { name: 'Strategy Backtest', href: '/backtest'},
  // { name: 'Subscription', href: '/subscriptions' },
  // { name: 'Marketplace', href: '/marketplace' },
  // { name: 'Affiliate', href: '/affiliate' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [menuNavigation, setMenuNavigation] = useState(navigation);
  const [userPackage, setUserPackage] = useState(null);
  const router = useRouter();
  const {
    customer,
    ipLocation,
    clearIpLocation,
    setCustomer,
    setUserPackage: setUserPackageToStore,
    // userPackage: userPackageFromStore,
  } = useUserStore();

  const searchParams = useSearchParams();
  const affiliateId = searchParams.get("c"); // c represents customer id in database
  const handleLogout = async () => {
    try {
      await authFirebase.signOut();
      await addActivityLog({
        customerId: customer?.id || null,
        uid: authFirebase.currentUser?.uid || user?.id || null,
        ipLocation: ipLocation,
        type: "LOGOUT",
      });
      clearIpLocation();
      router.push("/");
    } catch (error) {
      window?.alert(error.message);
    }
  };

  async function saveCookies() {
    if (!affiliateId) return;
    setCookie("affiliateId", affiliateId);
  }

  useEffect(() => {
    saveCookies();
  }, []);

  useEffect(() => {
    onAuthStateChanged(authFirebase, (user) => {
      if (user) {
        setUser(user);

        setMenuNavigation([
          { name: "Dashboard", href: `/dashboard` },
          { name: "Profile", href: `/dashboard/profile` },
          { name: "Subscription", href: `/dashboard/payment` },
          { name: "Affiliate", href: `/dashboard/affiliate` },
          {
            name: "Documentation",
            href: `https://docs.byscript.io`,
            target: "_blank",
          },
          { name: "Announcement", href: "/announcement", target: "_blank" },
          { name: "Strategy Backtest", href: "/backtest" },
          // { name: 'Autotraders', href: `/dashboard/autotraders` },
          // { name: 'Exchanges', href: `/dashboard/exchanges` },
        ]);
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        // ...
        addActivityLog({
          customerId: customer?.id || null,
          uid: authFirebase.currentUser?.uid || user?.id || null,
          ipLocation: ipLocation,
          type: "ONLINE",
        });
      } else {
        setUser(null);
        router.push("/");
        // User is signed out
        // ...
      }
    });
  }, []);

  useEffect(() => {
    (async function () {
      if (!customer) {
        try {
          let findLastSubscription = await getCollectionFirebase(
            "subscriptions",
            [
              {
                field: "email",
                operator: "==",
                value: authFirebase.currentUser?.email,
              },
              {
                field: "paymentStatus",
                operator: "==",
                value: "PAID",
              },
            ],
            { field: "createdAt", direction: "desc" },
            1,
          );
          // console.log(findLastSubscription, 'findLastSubscription');
          const activeSubscription = moment(new Date()).isBefore(
            moment.unix(findLastSubscription[0]?.expiredAt?.seconds),
          );
          // console.log(activeSubscription, 'activeSubscription');
          const customerFromDatabase = await getCollectionFirebase(
            "customers",
            [
              {
                field: "email",
                operator: "==",
                value: authFirebase.currentUser?.email,
              },
            ],
          );
          setCustomer(customerFromDatabase[0]);
        } catch (error) {
          console.log(error.message);
        }
      }
    })();
  }, [authFirebase.currentUser]);
  useEffect(() => {
    (async function () {
      if (customer?.id) {
        try {
          const findLastSubscription = await getCollectionFirebase(
            "subscriptions",
            [
              {
                field: "email",
                operator: "==",
                value: authFirebase.currentUser?.email,
              },
              {
                field: "paymentStatus",
                operator: "==",
                value: "PAID",
              },
            ],
            { field: "createdAt", direction: "desc" },
            20,
          );
          if (findLastSubscription?.length > 0)
            setUserPackage(findLastSubscription[0]);
          setUserPackageToStore(findLastSubscription[0]);
        } catch (error) {
          console.log(error.message);
        }
      }
    })();
  }, [customer?.id]);
  return (
    <Disclosure as="nav" className="bg-black dark:bg-transparent">
      <div className="px-2 border-b-[1px] border-b-slate-700 md:px-5">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                aria-hidden="true"
                className="block h-6 w-6 group-data-[open]:hidden"
              />
              <XMarkIcon
                aria-hidden="true"
                className="hidden h-6 w-6 group-data-[open]:block"
              />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">
              <a href="/">
                <Image
                  alt="byScript"
                  src={logo}
                  className="h-8 w-auto rounded-lg"
                />
              </a>
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {menuNavigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    aria-current={item.current ? "page" : undefined}
                    className={classNames(
                      item.current
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "rounded-md px-3 py-2 text-sm font-medium",
                    )}
                    target={item.target ?? ""}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* Profile dropdown */}
            <div className="flex gap-4 items-center justify-center">
              {/* <button onClick={() => {
                // console.log(userPackageFromStore,'userPackageFromStore')
                console.log(customer,'customer')
                }}>cek</button> */}
              {!user ? (
                <a href="/auth/login">
                  <button className="p-[3px] relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
                    <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
                      Sign Up
                    </div>
                  </button>
                </a>
              ) : (
                <Menu as="div" className="relative ml-3">
                  <MenuButton className="relative text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>

                    <div className="flex gap-2">
                      <div className="hidden lg:block">
                        {user && (
                          <div className="flex flex-col items-center">
                            <p className="text-gray-200">{user?.displayName}</p>
                            {userPackage &&
                              moment(new Date()).isBefore(
                                moment.unix(userPackage?.expiredAt?.seconds),
                              ) && (
                                <p className="text-gray-400 text-sm font-light">
                                  {userPackage?.productName}
                                </p>
                              )}
                          </div>
                        )}
                      </div>
                      <img
                        alt=""
                        src={user.photoURL || authFirebase.currentUser.photoURL}
                        className="h-8 w-8 rounded-full"
                      />
                    </div>
                  </MenuButton>

                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-slate-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                  >
                    {/* <MenuItem cursor={'pointer'} onClick={() => router.push(`/`)}>
                      <a
                        href={'https://'+ window?.location?.origin +'/'+
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
                    </MenuItem> */}
                    <MenuItem cursor={"pointer"}>
                      {moment(new Date()).isBefore(
                        moment.unix(userPackage?.expiredAt?.seconds),
                      ) ? (
                        <a
                          href=""
                          className="block px-4 py-2 text-sm text-gray-100 data-[focus]:bg-slate-600 cursor-pointer"
                        >
                          <div className="flex flex-col">
                            <p className="text-gray-400 text-sm font-light">
                              {userPackage?.productName}
                            </p>
                            <p className="text-xs text-gray-400">
                              Until{" "}
                              {moment
                                .unix(userPackage?.expiredAt?.seconds)
                                .format("DD MMM YYYY")}
                            </p>
                          </div>
                        </a>
                      ) : (
                        <a
                          href={"dashboard/payment"}
                          className="block px-4 py-2 text-sm text-gray-100 data-[focus]:bg-slate-600 cursor-pointer"
                        >
                          <div className="flex flex-col">
                            <p className="text-gray-400 text-sm font-light">
                              No active subscription
                            </p>
                            Go to payment
                          </div>
                        </a>
                      )}
                    </MenuItem>
                    {menuNavigation.map((x, i) => (
                      <MenuItem key={i} cursor={"pointer"}>
                        <a
                          href={x?.href}
                          className="block px-4 py-2 text-sm text-gray-100 data-[focus]:bg-slate-600 cursor-pointer"
                        >
                          {x?.name}
                        </a>
                      </MenuItem>
                    ))}
                    <MenuItem cursor={"pointer"}>
                      <a
                        onClick={handleLogout}
                        className="block px-4 py-2 text-sm text-gray-100 data-[focus]:bg-slate-600 cursor-pointer"
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

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2">
          {menuNavigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              aria-current={item.current ? "page" : undefined}
              className={classNames(
                item.current
                  ? "bg-gray-900 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white",
                "block rounded-md px-3 py-2 text-base font-medium",
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
