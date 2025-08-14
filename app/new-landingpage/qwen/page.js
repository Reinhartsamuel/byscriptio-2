'use client'
import React, { useEffect, useRef, useState } from 'react';
import {
  ShieldCheckIcon,
  LockClosedIcon,
} from "@heroicons/react/24/solid";
import { FaRobot, FaPlug } from "react-icons/fa6";
import logo from "../../../public/combination-mini.png";
import discord_logo from "../../../public/Discord-logo.png";
import logo_mark from "../../../public/Logo-Mark.png";
import Image from 'next/image';
import herobackground from "../../../public/herobackground.png";
import { FaLink } from "react-icons/fa6"; // Link icon
import { BsGraphUp } from "react-icons/bs";
import { testimonials1, TestimonialsComponent } from "../../components/TestimonialsComponent";
import TestimonialScrollingCards from "../../components/TestimonialScrollingCards";
import CountUp from 'react-countup';
import { getCollectionFirebase } from '@/app/utils/firebaseApi';
import useCountDocuments from '@/app/hooks/CountHook';
import Spinner from '@/app/components/ui/Spinner';
import { InfiniteMovingCards } from '@/app/components/ui/InfiniteMovingCards';
import { InfiniteMovingCards2 } from '@/app/components/ui/InfiniteMovingCards2';
import useFetchData from '@/app/hooks/QueryHook';
import { cn } from '@/lib/util';


const Navbar2 = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex flex-col border-b border-white/10 bg-black">
      {/* Top Bar: Logo + Hamburger (Mobile) + Desktop Buttons */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="hidden md:flex items-center gap-6">
          {/* Logo */}
          <a href="/">
            <Image
              alt="byScript"
              src={logo}
              className="h-8 w-auto"
            />
          </a>
          {/* Navigation Links */}
          <ul className="flex gap-6 text-sm font-medium">
            <li className="hover:text-cyan-400 cursor-pointer">Home</li>
            <li className="hover:text-cyan-400 cursor-pointer">Strategies</li>
            <li className="hover:text-cyan-400 cursor-pointer">Performance</li>
            <li className="hover:text-cyan-400 cursor-pointer">How It Works</li>
            <li className="hover:text-cyan-400 cursor-pointer">FAQ</li>
          </ul>
        </div>
        {/* Desktop Nav Links & Buttons (visible only on md and up) */}
        <div className="hidden md:flex items-center gap-6">
          {/* Action Buttons */}
          <div className="flex gap-4">
            <a href="/auth/login">
              <button className="border border-white/20 px-4 py-1.5 rounded-md hover:bg-white/10 transition">
                Login
              </button>
            </a>

            <a href="/dashboard/profile">
              <button className="bg-brand_primary text-black px-4 py-1.5 rounded-md font-semibold hover:bg-cyan-300 transition">
                Start Trading
              </button>
            </a>
          </div>
        </div>

        {/* Logo */}
        <a className='md:hidden' href="/">
          <Image
            alt="byScript"
            src={logo}
            className="h-8 w-auto"
          />
        </a>
        {/* Hamburger Button (visible only on mobile) */}
        <button
          onClick={toggleMenu}
          className="md:hidden flex flex-col space-y-1"
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''
              }`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-white transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : ''
              }`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
              }`}
          ></span>
        </button>
      </div>

      {/* Mobile Menu Dropdown (only visible when open) */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        <ul className="px-6 pb-4 gap-2 flex flex-col text-sm font-medium">
          <li
            className="py-3 hover:text-cyan-400 border-b border-white/10 cursor-pointer"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </li>
          <li
            className="py-3 hover:text-cyan-400 border-b border-white/10 cursor-pointer"
            onClick={() => setIsMenuOpen(false)}
          >
            Strategies
          </li>
          <li
            className="py-3 hover:text-cyan-400 border-b border-white/10 cursor-pointer"
            onClick={() => setIsMenuOpen(false)}
          >
            Performance
          </li>
          <li
            className="py-3 hover:text-cyan-400 border-b border-white/10 cursor-pointer"
            onClick={() => setIsMenuOpen(false)}
          >
            How It Works
          </li>
          <li
            className="py-3 hover:text-cyan-400 border-b border-white/10 cursor-pointer"
            onClick={() => setIsMenuOpen(false)}
          >
            FAQ
          </li>
        </ul>

        {/* Mobile Action Buttons */}
        <div className="flex flex-col px-6 pb-6 gap-3">
          <button
            className="border border-white/20 px-4 py-1.5 rounded-md hover:bg-white/10 transition text-left"
            onClick={() => setIsMenuOpen(false)}
          >
            Login
          </button>
          <button
            className="bg-brand_primary text-black px-4 py-1.5 rounded-md font-semibold hover:bg-cyan-300 transition text-left"
            onClick={() => setIsMenuOpen(false)}
          >
            Start Trading
          </button>
        </div>
      </div>
    </nav>
  );
};

const Hero = () => {
  const { count:activeAutotradesCount = 200, loading: loadingActiveAutotrades } = useCountDocuments({
    collectionName: 'dca_bots',
    conditions: [{ field: 'status', operator: '==', value: 'ACTIVE' }],
    authRequired: false
  })
  const { count:exchangeCount = 200, loading: loadingExchangeAccounts } = useCountDocuments({
    collectionName: 'exchange_accounts',
    conditions: [],
    authRequired: false
  })
  return (<>
    {/* Hero Section */}
    <section className="relative flex flex-col items-center justify-center md:h-screen bg-cover bg-center pt-20 md:pt-24" style={{ backgroundImage: `url(${herobackground.src})` }}>
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className='w-full flex flex-col md:flex-row md:justify-between'>
        <div className="w-full z-10 max-w-8xl px-6 py-32 lg:ml-[5%] text-left">
          <h1 className="text-5xl font-bold leading-tight sm:text-6xl">
            Let the Algorithm <span className="text-brand_primary">Trade</span> for You.
          </h1>
          <p className="mt-4 text-xl">
            No guesswork. No sleepless nights. Just strategy.
          </p>
          <div className="mt-8 flex flex-col md:flex-row justify-start gap-2">
            <a href='/dashboard/profile' className="px-6 py-3 text-white font-bold rounded-full hover:bg-green-600"style={{
              background: 'linear-gradient(120deg, var(--brand_primary), black, var(--brand_primary))'
            }}>
              Start Auto Trading Now
            </a>
            <a href='/dashboard' className="px-6 py-3 text-brand_primary border border-brand_primary rounded-full hover:bg-brand_primary hover:text-white">
              View Strategies
            </a>
          </div>
        </div>
        <div className='w-full flex justify-center items-center '>

        </div>
      </div>
      {/* Stats Section */}
      <div className="w-full md:max-w-6xl px-6 py-12 mx-auto space-y-8 md:space-y-0 md:grid md:grid-cols-3 md:gap-3">
        <div className="flex flex-col items-center justify-center p-6 space-y-2 bg-transparent border-gray-700 border-2 rounded-lg">
          {/* <h2 className="text-4xl font-bold text-brand_primary">$330K+</h2>*/}
          <CountUp
            className='text-4xl font-bold text-brand_primary'
            separator={','}
            start={0}
            end={364}
            delay={0}
            prefix={'$'}
            suffix={'k+'}
          />
          <p className="text-sm">Assets Under Management</p>
        </div>
        <div className="flex flex-col items-center justify-center p-6 space-y-2 bg-transparent border-gray-700 border-2 rounded-lg">
          {/* <h2 className="text-4xl font-bold text-brand_primary">200+</h2>*/}
          {loadingExchangeAccounts ? <Spinner /> : <CountUp
            className='text-4xl font-bold text-brand_primary'
            separator={','}
            start={0}
            end={exchangeCount}
            delay={0}
            prefix={''}
            suffix={''}
          />}
          <p className="text-sm">Exchange Accounts Connected</p>
        </div>
        <div className="flex flex-col items-center justify-center p-6 space-y-2 bg-transparent border-gray-700 border-2 rounded-lg">
          {/* <h2 className="text-4xl font-bold text-brand_primary">500+</h2>*/}
          { loadingActiveAutotrades ? <Spinner /> :
          <CountUp
            className='text-4xl font-bold text-brand_primary'
            separator={','}
            start={0}
            end={activeAutotradesCount}
            delay={0}
            prefix={''}
            suffix={''}
          />
          }
          <p className="text-sm">Active Autotrades</p>
        </div>

      </div>
    </section>
  </>)
}

const ProvenPerformance = () => {
  const { count = 200, loading: loadingRunningAlgo } = useCountDocuments({
    collectionName: 'trading_plan_pair',
    conditions: [],
    authRequired: false
  })
  return (
    <div className='w-full bg-gradient-to-t from-gray-900 to-transparent grid grid-cols-1 md:grid-cols-2 items-center justify-center md:h-screen p-4'>
      {/* Left Section: Title and Description */}
      <div className="py-10 px-6 mx-auto flex justify-center">
        <div className='md:w-[80%] w-full'>
          <h2 className="text-4xl font-bold mb-4">
            Proven Performance
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Our strategies are backtested and battle-tested with real money. No fake promises, just transparent results.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-2 text-green-500">
                +127%
              </h3>
              <p className="text-gray-300">
                Best Strategy Return
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-2 text-orange-400">
                99.3%
              </h3>
              <p className="text-gray-300">
                Uptime Reliablilty
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-2 text-blue-400">
                {count}+
              </h3>
              <p className="text-gray-300">
                Running Algo
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-2 text-purple-500">
                24/7
              </h3>
              <p className="text-gray-300">
                Autotrade Active
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section: Existing Dashboard */}
      <div className="bg-gray-900 text-white p-6 rounded-lg md:w-[80%] mx-auto h-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Top Running Autotrade Performance</h2>
          <span className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-faster-pulse"></span>
            <span className="text-green-500">Active</span>
          </span>
        </div>

        {/* BTC/USDT Strategy Card */}
        <div className="bg-gray-800 p-4 mb-4 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold">BTC/USDT Strategy</p>
              <p className="text-sm text-gray-400">24h Performance</p>
            </div>
            <div className="flex flex-col items-end">
              <p className="text-green-500 font-bold">+2.4%</p>
              <p className="text-sm">$1,240</p>
            </div>
          </div>
        </div>

        {/* ETH/USDT Strategy Card */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold">ETH/USDT Strategy</p>
              <p className="text-sm text-gray-400">24h Performance</p>
            </div>
            <div className="flex flex-col items-end">
              <p className="text-green-500 font-bold">+1.8%</p>
              <p className="text-sm">$890</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const WhyByScript = () => {
  const features = [
    {
      icon: <FaRobot className="w-6 h-6 text-brand_primary" />,
      title: "Fully Automated",
      desc: "Trade while you sleep — seriously. The algorithm works 24/7 so you don't have to.",
    },
    {
      icon: <ShieldCheckIcon className="w-6 h-6 text-brand_primary" />,
      title: "Battle-tested",
      desc: "Used by real traders, not paper bots. Every strategy is backtested and live-proven.",
    },
    {
      icon: <FaPlug className="w-6 h-6 text-brand_primary" />,
      title: "Plug & Play",
      desc: "Three clicks. The algo handles the rest. No coding or technical setup required.",
    },
    {
      icon: <LockClosedIcon className="w-6 h-6 text-brand_primary" />,
      title: "Your Funds, Your Control",
      desc: "We don't hold your money. Just your strategy brain. Funds stay in your exchange account.",
    },
  ];
  return (
    <section className=" text-white py-16  bg-slate-950">
      {/* Section Title */}
      <div className="max-w-6xl px-6 mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">
          Why <span className="text-brand_primary">by</span>Script?
        </h2>
        <p className="text-xl max-w-3xl mx-auto">
          Last year, byScript users grew their assets by 300% — no noisy signals, no endless charts.
        </p>
      </div>
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-[5%] md:mx-auto">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="bg-white/5 border border-white/10 rounded-lg p-6 text-left"
          >
            {feature.icon}
            <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
            <p className="mt-2 text-sm text-white/70">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const HowItWorks2 = () => {
  return (
    <section className="bg-gray-900 text-white py-20">
      <div className="container mx-auto px-4 flex flex-col items-center">
        {/* Title */}
        <h1 className="text-4xl font-bold mb-6">How It Works</h1>
        <p className="text-xl mb-12">Get started in 3 simple steps</p>

        {/* Steps Container */}
        <div className="flex justify-around max-w-5xl">
          {/* Step 1: Connect Exchange */}
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-green-500 rounded-full p-4">
              <FaLink size={32} className="text-white" />
            </div>
            <h2 className="text-xl font-bold">1. Connect Exchange</h2>
            <p className="text-center">
              Link your exchange account securely via 3Commas integration
            </p>
          </div>

          {/* Step 2: Choose Strategy */}
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-red-500 rounded-full p-4">
              <BsGraphUp size={32} className="text-white" />
            </div>
            <h2 className="text-xl font-bold">2. Choose Strategy</h2>
            <p className="text-center">
              Select from our battle-tested trading plans across 20+ pairs
            </p>
          </div>

          {/* Step 3: Auto-Trade */}
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-green-500 rounded-full p-4">
              <FaRobot size={32} className="text-white" />
            </div>
            <h2 className="text-xl font-bold">3. Auto-Trade</h2>
            <p className="text-center">
              Sit back while our algorithms execute trades 24/7
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};





const Section2 = () => {
  return (
    <div className='md:h-screen'>
      <div className="relative h-full w-full">
        <WhyByScript />
        <HowItWorks2 />
        {/* <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]">
        </div>*/}
      </div>
    </div>
  )
}
const LiveStrategyPreview = () => {
  const [tradingPlans, setTradingPlans] = useState([]);
  async function getTpp() {
    try {
      const tradingPlans = await getCollectionFirebase(
        'trading_plans',
        [{ field: 'status', operator: '==', value: 'ACTIVE' }],
        null,
        2
      );
      const promises = tradingPlans.map(async (tradingPlan) => {
        const arr = await getCollectionFirebase(
          'trading_plan_pair',
          [{ field: 'trading_plan_id', operator: '==', value: tradingPlan.id || '' }],
          null,
          1
        );
        return { ...tradingPlan, ...arr[0] };
      });
      const promiseResult = await Promise.all(promises);
      console.log(tradingPlans, 'tradingPlans')
      console.log(promiseResult, 'promiseResult')

      setTradingPlans(promiseResult);
    } catch (error) {
      console.error(error, ':::::::ERROR on LIVESTRATEGYPREVIEW')
    }
  }
  useEffect(() => {
    getTpp();
  }, [])
  return (
    <section className=" md:h-screen text-white py-16 md:pt-32 bg-black">
      {/* Section Title */}
      <div className="max-w-6xl px-6 mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">
          Live <span className="text-brand_primary">Strategy</span> Preview
        </h2>
        <p className="text-xl max-w-3xl mx-auto">
          Real performance, real results. No screenshots, just live data.
        </p>
      </div>
      {/* Cards */}
      <div className="max-w-6xl md:h-[calc(60vh-240px)] px-6 mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        {tradingPlans?.length > 0 && tradingPlans?.map((x, i) => (
          <div className="bg-gray-800 p-6 rounded-lg flex flex-col justify-between" key={i}>
            <div>
              <div className="flex md:flex-row flex-col justify-between items-center">
                <h3 className="text-md md:text-xl font-bold">{x?.marketingName || x?.id}</h3>
                <span className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-faster-pulse"></span>
                  <span className="text-green-500">Active</span>
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                {/* Column 1 */}
                <div>
                  <p className="text-sm font-medium">Timeframe</p>
                  <p className="text-sm">{x?.timeFrame || '4H'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Profit Factor</p>
                  <p className="text-sm">{x?.profitFactor || '1.9'}</p>
                </div>

                {/* Column 2 */}
                <div>
                  <p className="text-sm font-medium">Trading Pairs</p>
                  <p className="text-sm">XRP, BTC, ETH, SOL, BNB</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Market</p>
                  <p className="text-sm">{(x?.market || 'SPOT')?.toUpperCase()}</p>
                </div>
              </div>
            </div>
            <div className='flex w-full justify-between'>
              <div className="flex flex-col items-start">
                <p className="text-sm font-small">YTD Performance</p>
                <h3 className={cn("text-lg font-bold ", parseFloat(x?.ytdPerformance) > 0 ? 'text-green-500' : 'text-red-500')}>
                  {x?.ytdPerformance || '127%'}
                </h3>
              </div>
              <button className="px-4 py-2 text-sm font-semibold text-black bg-brand_primary hover:bg-brand_primary_hover rounded-md">Select Strategy</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const UserTestimonialsAndSecurity = () => {
  return (
    <>
      <section className="bg-gray-900 text-white">
        {/* Testimonials */}
        <div className="max-w-6xl px-6 py-16 mx-auto">
          <h2 className="text-4xl font-bold mb-4 text-center">
            What Our <span className="text-brand_primary">Users</span> Say
          </h2>
          <p className="text-xl max-w-3xl mx-auto text-center">
            Real people, real results.
          </p>

          {/* Testimonial Cards */}
          <TestimonialScrollingCards />
        </div>


      </section>
      <section className="bg-gray-950 text-white">
        {/* Security & Compliance */}
        <div className="max-w-6xl px-6 py-16 mx-auto">
          <h2 className="text-4xl font-bold mb-4 text-center">
            Security & <span className="text-brand_primary">Compliance</span>
          </h2>
          <p className="text-xl max-w-3xl mx-auto text-center">
            Your safety is our priority.
          </p>

          {/* Icons with Descriptions */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Your Funds Stay Safe */}
            <div className="bg-gray-800 p-6 rounded-lg flex flex-col items-center space-y-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-brand_primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-bold">Your Funds Stay Safe</h3>
              <p className="text-sm">
                Funds remain on your exchange. We never touch your crypto directly.
              </p>
            </div>

            {/* Card 2: Trusted Execution */}
            <div className="bg-gray-800 p-6 rounded-lg flex flex-col items-center space-y-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-brand_primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <h3 className="text-xl font-bold">Trusted Execution</h3>
              <p className="text-sm">
                Execution runs via 3Commas and TradingView — industry standard platforms.
              </p>
            </div>

            {/* Card 3: Regulatory Compliance */}
            <div className="bg-gray-800 p-6 rounded-lg flex flex-col items-center space-y-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-brand_primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              <h3 className="text-xl font-bold">Regulatory Compliance</h3>
              <p className="text-sm">
                On track for WPA EA licensing — becoming one of the first regulated algo trading services.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

const JoinCommunity = () => {
  return (
    <section className='md:h-screen flex flex-col justify-center items-center px-6 py-12'>
      <div className='text-center'>
        <h2 className='text-3xl font-bold mb-4 text-white'>
          Join Our
          <span className='text-3xl text-brand_primary'> Community</span>
        </h2>
        <p className='text-lg mb-8'>Follow our social media channels for the latest news and updates. Feel free to reach out
          anytime for inquiries or assistance.</p>
      </div>

      <a target="_blank" rel="noreferrer" href="https://discord.gg/eHaNsARNps"
        className='mx-auto relative w-full md:w-[70%] border border-gray-900 rounded-lg flex flex-col justify-center items-center h-48 md:h-[50%] bg-gradient-to-tr from-transparent to-slate-600 p-6'>
        <Image
          alt="byScript"
          src={discord_logo}
          className="h-12 md:h-20 w-auto absolute top-2 md:top-0 left-3 md:left-5"
        />
        <div className='flex flex-col md:flex-row items-center gap-2 cursor-pointer mt-4 md:mt-0'>
          <Image
            alt="logo_mark"
            src={logo_mark}
            className="h-16 w-16 md:h-20 md:w-20 rounded-full border-2 border-gray-900 object-cover"
          />
          <h2 className='text-lg md:text-xl font-bold text-white text-center'>
            Discord Channel Algotrading Community
            <span className='text-lg md:text-xl text-brand_primary'> by</span>
            Script.io
          </h2>
        </div>
      </a>

    </section>
  )
}

const Footer = () => {
  return (
    <div>
      {/* Call-to-Action Section */}
      <section className="bg-brand_primary text-white py-16">
        <div className="max-w-6xl px-6 mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 text-black">Stop Guessing. Start Automating.</h2>
          <p className="text-xl max-w-3xl mx-auto mb-8 text-black">
            Autotrade, made byScript.
          </p>
          <button className="px-6 py-3 text-white bg-black rounded-full hover:bg-gray-800">
            Connect Your Exchange
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-10">
        <div className="max-w-6xl px-6 mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: byScript.io */}
          <div>
            <a href="/">
              <Image
                alt="byScript"
                src={logo}
                className="h-8 w-auto"
              />
            </a>
            <p className="text-sm mb-4">
              Autotrade, made byScript.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-brand_primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.243M15 10a3 3 0 10-4.243 4.243m0 0l2.879-2.879M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
              <a href="#" className="text-white hover:text-brand_primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.243M15 10a3 3 0 10-4.243 4.243m0 0l2.879-2.879M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
              <a href="#" className="text-white hover:text-brand_primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.243M15 10a3 3 0 10-4.243 4.243m0 0l2.879-2.879M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Company */}
          <div>
            <h3 className="text-xl font-bold mb-4">Company</h3>
            <ul>
              <li><a href="#" className="text-white hover:text-brand_primary">About Us</a></li>
              <li><a href="#" className="text-white hover:text-brand_primary">Team</a></li>
              <li><a href="#" className="text-white hover:text-brand_primary">Careers</a></li>
              <li><a href="#" className="text-white hover:text-brand_primary">Contact</a></li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h3 className="text-xl font-bold mb-4">Resources</h3>
            <ul>
              <li><a href="#" className="text-white hover:text-brand_primary">Documentation</a></li>
              <li><a href="#" className="text-white hover:text-brand_primary">Blog</a></li>
              <li><a href="#" className="text-white hover:text-brand_primary">FAQ</a></li>
              <li><a href="#" className="text-white hover:text-brand_primary">Support</a></li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h3 className="text-xl font-bold mb-4">Legal</h3>
            <ul>
              <li><a href="#" className="text-white hover:text-brand_primary">Terms of Service</a></li>
              <li><a href="#" className="text-white hover:text-brand_primary">Privacy Policy</a></li>
              <li><a href="#" className="text-white hover:text-brand_primary">Risk Disclosure</a></li>
              <li><a href="#" className="text-white hover:text-brand_primary">Compliance</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright Notice */}
        <div className="mt-8 border-t border-gray-600 pt-4 text-center text-sm">
          <p>© 2023 byScript.io. All rights reserved.</p>
          <p>Trading cryptocurrencies involves risk. Only trade with funds you can afford to lose.</p>
        </div>
      </footer>
    </div>
  );
};

const TrackPerformanceSection = () => {
  const  {data} = useFetchData({
    collectionName: 'preview_history_metrics',
    authRequired:false,
    dependencies:[],
    limitQuery:20,
    type:'getDocs',
    conditions:[]
  })
  return (
    <div className="h-[70vh] bg-gradient-to-t from-transparent to-gray-900 flex flex-col justify-center items-center bg-black text-white">
      <h2 className="text-center text-2xl font-bold mb-4">
        Track record performa koin kami di masa lalu
      </h2>
      <div className="flex justify-center flex-col space-y-4 animate-infinite-scroll">
        {/* <ScrollableRow direction="left" data={data.slice(0, 6)} />
        <ScrollableRow direction="rig" data={data.slice(6, 12)} />
        <ScrollableRow direction="right" data={data.slice(12, 18)} />*/}

        <InfiniteMovingCards2
          className='mx-auto'
          items={data}
          direction='right'
          speed='fast'
        />
        <InfiniteMovingCards2
          className='mx-auto'
          items={data}
          direction='left'
          speed='fast'
        />
        <InfiniteMovingCards2
          className='mx-auto'
          items={data}
          direction='right'
          speed='fast'
        />
      </div>
      {/* <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-250px * 10));
          }
        }

        .animate-infinite-scroll {
          animation: scroll 40s linear infinite;
          display: flex;
          width: calc(250px * 20);
        }

        .animate-infinite-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>*/}
    </div>
  );
};



export default function page() {
  return (
    <>
      <div className="bg-black text-white">
        <Navbar2 />
        <Hero />
        <TrackPerformanceSection />
        <ProvenPerformance />
        <Section2 />
        <LiveStrategyPreview />
        <UserTestimonialsAndSecurity />
        <JoinCommunity />
        <Footer />
      </div>
    </>
  );
};
