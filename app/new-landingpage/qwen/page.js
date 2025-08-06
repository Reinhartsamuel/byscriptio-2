'use client'
import React, { useState } from 'react';
import {
  ShieldCheckIcon,
  LockClosedIcon,
} from "@heroicons/react/24/solid";
import { FaRobot, FaPlug } from "react-icons/fa6";
import logo from "../../../public/combination-mini.png";
import Image from 'next/image';
import herobackground from "../../../public/herobackground.png";


const Navbar2 = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="flex flex-col border-b border-white/10 bg-black">
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

            <button className="bg-brand_primary text-black px-4 py-1.5 rounded-md font-semibold hover:bg-cyan-300 transition">
              Start Trading
            </button>
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

const LiveTradingDashboard = () => {
  return (
    <div className='w-full flex flex-col md:flex-row items-center justify-center h-screen p-4'>
      {/* Left Section: Title and Description */}
      <div className="md:w-1/2 p-6 mb-6 md:mb-0">
        <h2 className="text-3xl font-bold mb-4">Real-Time Performance, Unmatched Results</h2>
        <p className="text-lg text-gray-600 mb-6">
          Monitor your algorithmic trading strategies in real-time with ByScriptio. Our platform delivers consistent, high-performance results, giving you the edge in volatile markets.
        </p>
        <button className="bg-brand_primary text-white px-6 py-2 rounded-lg hover:bg-brand_primary_hover transition">
          Start Trading Now
        </button>
      </div>

      {/* Right Section: Existing Dashboard */}
      <div className="bg-gray-900 text-white p-6 rounded-lg md:w-[40%] h-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Live Trading Dashboard</h2>
          <span className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
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

const Hero = () => {
  return (<>
    {/* Hero Section */}
    <section className="relative flex flex-col items-start justify-center h-screen bg-cover bg-center" style={{ backgroundImage: `url(${herobackground.src})` }}>
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className='w-full flex flex-col md:flex-row md:justify-between'>
        <div className="w-full z-10 max-w-8xl px-6 py-32 lg:ml-[5%] text-left">
          <h1 className="text-5xl font-bold leading-tight sm:text-6xl">
            Let the Algorithm <span className="text-brand_primary">Trade</span> for You.
          </h1>
          <p className="mt-4 text-xl">
            No guesswork. No sleepless nights. Just strategy.
          </p>
          <div className="mt-8 flex justify-start space-x-4">
            <button className="px-6 py-3 text-black font-bold bg-brand_primary rounded-full hover:bg-green-600">
              Start Auto Trading Now
            </button>
            <button className="px-6 py-3 text-brand_primary border border-brand_primary rounded-full hover:bg-brand_primary hover:text-white">
              View Strategies
            </button>
          </div>
        </div>
        <div className='w-full flex justify-center items-center '>

        </div>
      </div>
      {/* Stats Section */}
      <div className="w-full md:max-w-6xl px-6 py-12 mx-auto space-y-8 md:space-y-0 md:grid md:grid-cols-3 md:gap-3">
        <div className="flex flex-col items-center justify-center p-6 space-y-2 bg-transparent border-gray-900 border-2 rounded-lg">
          <h2 className="text-4xl font-bold text-brand_primary">$330K+</h2>
          <p className="text-sm">Assets Under Management</p>
        </div>
        <div className="flex flex-col items-center justify-center p-6 space-y-2 bg-transparent border-gray-900 border-2 rounded-lg">
          <h2 className="text-4xl font-bold text-brand_primary">200+</h2>
          <p className="text-sm">Exchange Accounts Connected</p>
        </div>
        {/* Stats Section */}
        <div className="w-full md:max-w-6xl px-6 py-12 mx-auto space-y-8 md:space-y-0 md:grid md:grid-cols-3 md:gap-3">
          <div className="flex flex-col items-center justify-center p-6 space-y-2 bg-transparent border-gray-900 border-2 rounded-lg">
            <h2 className="text-4xl font-bold text-brand_primary">$330K+</h2>
            <p className="text-sm">Assets Under Management</p>
          </div>
          <div className="flex flex-col items-center justify-center p-6 space-y-2 bg-transparent border-gray-900 border-2 rounded-lg">
            <h2 className="text-4xl font-bold text-brand_primary">200+</h2>
            <p className="text-sm">Exchange Accounts Connected</p>
          </div>
          <div className="flex flex-col items-center justify-center p-6 space-y-2 bg-transparent border-gray-900 border-2 rounded-lg">
            <h2 className="text-4xl font-bold text-brand_primary">500+</h2>
            <p className="text-sm">Peak Active Users</p>
          </div>
        </div>
      </div>
    </section>
  </>)
}

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
    <section className=" text-white py-16">
      {/* Section Title */}
      <div className="max-w-6xl px-6 mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">
          Why <span className="text-brand_primary">by</span>Script?
        </h2>
        <p className="text-xl max-w-3xl mx-auto">
          Last year, byScript users grew their assets by 300% — no noisy signals, no endless charts.
        </p>
      </div>
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
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

const HowItWorks = () => {
  return (
    <section className=" text-white py-16">
      {/* Section Title */}
      <div className="max-w-6xl px-6 mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">
          How It <span className="text-brand_primary">Works</span>
        </h2>
        <p className="text-xl max-w-3xl mx-auto">
          Three simple steps to automated trading success.
        </p>
      </div>

      {/* Cards */}
      <div className="max-w-6xl px-6 mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Card 1: Connect Your Exchange */}
        <div className="bg-gray-800 p-6 rounded-lg flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="bg-brand_primary font-bold text-black rounded-full w-10 h-10 flex items-center justify-center">
              1
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold">Connect Your Exchange</h3>
            <p className="mt-2 text-sm">
              Securely link your Binance, OKX, or Bybit account via 3Commas. Your funds remain in your exchange.
            </p>
          </div>
        </div>

        {/* Card 2: Choose a Strategy */}
        <div className="bg-gray-800 p-6 rounded-lg flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="bg-brand_primary font-bold text-black rounded-full w-10 h-10 flex items-center justify-center">
              2
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold">Choose a Strategy</h3>
            <p className="mt-2 text-sm">
              Select from our proven trading strategies based on your risk tolerance and investment goals.
            </p>
          </div>
        </div>

        {/* Card 3: Activate Auto-Trade */}
        <div className="bg-gray-800 p-6 rounded-lg flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="bg-brand_primary font-bold text-black rounded-full w-10 h-10 flex items-center justify-center">
              3
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold">Activate Auto-Trade</h3>
            <p className="mt-2 text-sm">
              Hit start and let the algorithm do its work. Monitor performance anytime, anywhere.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const Section2 = () => {
  return (
    <div className='md: h-screen'>
      <div className="relative h-full w-full bg-slate-950">
        <WhyByScript />
        <HowItWorks />
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]">
        </div>
      </div>
    </div>
  )
}
const LiveStrategyPreview = () => {
  return (
    <section className="bg-black text-white py-16">
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
      <div className="max-w-6xl px-6 mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card 1: Momentum Hunter */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">Momentum Hunter</h3>
            <span className="px-4 py-2 text-sm font-semibold text-black bg-brand_primary rounded-full">Active</span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {/* Column 1 */}
            <div>
              <p className="text-sm font-medium">Timeframe</p>
              <p className="text-sm">4H</p>
            </div>
            <div>
              <p className="text-sm font-medium">Take Profit</p>
              <p className="text-sm">1.5–3.0%</p>
            </div>

            {/* Column 2 */}
            <div>
              <p className="text-sm font-medium">Trading Pairs</p>
              <p className="text-sm">BTC, ETH, SOL, BNB</p>
            </div>
            <div>
              <p className="text-sm font-medium">Stop Loss</p>
              <p className="text-sm">1.2%</p>
            </div>
          </div>
        </div>

        {/* Card 2: Trend Surfer */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">Trend Surfer</h3>
            <span className="px-4 py-2 text-sm font-semibold text-black bg-brand_primary rounded-full">Active</span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {/* Column 1 */}
            <div>
              <p className="text-sm font-medium">Timeframe</p>
              <p className="text-sm">1D</p>
            </div>
            <div>
              <p className="text-sm font-medium">Take Profit</p>
              <p className="text-sm">2.5–5.0%</p>
            </div>

            {/* Column 2 */}
            <div>
              <p className="text-sm font-medium">Trading Pairs</p>
              <p className="text-sm">BTC, ETH, ADA, DOT</p>
            </div>
            <div>
              <p className="text-sm font-medium">Stop Loss</p>
              <p className="text-sm">2.0%</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const UserTestimonialsAndSecurity = () => {
  return (
    <section className="bg-black text-white">
      {/* Testimonials */}
      <div className="max-w-6xl px-6 py-16 mx-auto">
        <h2 className="text-4xl font-bold mb-4 text-center">
          What Our <span className="text-brand_primary">Users</span> Say
        </h2>
        <p className="text-xl max-w-3xl mx-auto text-center">
          Real people, real results.
        </p>

        {/* Testimonial Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Alex K. */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center space-x-4">
              <img src="https://avatar.iran.liara.run/public" alt="Alex K." className="w-12 h-12 rounded-full" />
              <div>
                <p className="text-xl font-bold">Alex K.</p>
                <p className="text-sm">Trading since 2021</p>
              </div>
            </div>
            <p className="mt-4 text-sm">
              "Now my account trades itself. I just check it every night. Up 143% since I started 6 months ago."
            </p>
          </div>

          {/* Card 2: Sarah M. */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center space-x-4">
              <img src="https://avatar.iran.liara.run/public" alt="Sarah M." className="w-12 h-12 rounded-full" />
              <div>
                <p className="text-xl font-bold">Sarah M.</p>
                <p className="text-sm">Trading since 2022</p>
              </div>
            </div>
            <p className="mt-4 text-sm">
              "I work full-time and couldn't keep up with the markets. byScript has been a game-changer for my portfolio."
            </p>
          </div>

          {/* Card 3: Michael T. */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center space-x-4">
              <img src="https://avatar.iran.liara.run/public" alt="Michael T." className="w-12 h-12 rounded-full" />
              <div>
                <p className="text-xl font-bold">Michael T.</p>
                <p className="text-sm">Trading since 2020</p>
              </div>
            </div>
            <p className="mt-4 text-sm">
              "After losing money with manual trading, byScript's algorithms have consistently delivered results. No more emotional decisions."
            </p>
          </div>
        </div>
      </div>

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
  );
};

const Footer = () => {
  return (
    <div>
      {/* Call-to-Action Section */}
      <section className="bg-brand_primary text-white py-16">
        <div className="max-w-6xl px-6 mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 text-black">Stop Guessing. Start Automating.</h2>
          <p className="text-xl max-w-3xl mx-auto mb-8 text-black">
            Every trade is made byScript. Join hundreds of traders who've already made the switch.
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
            <img src="/logo.png" alt="byScript.io" className="h-8 mb-2" />
            <p className="text-sm mb-4">
              Automated crypto trading, done right.
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


export default function page() {
  return (
    <>
      <div className="bg-black text-white">
        {/* Header */}
        <Navbar2 />
        <Hero />
        <LiveTradingDashboard />
        <Section2 />
        <LiveStrategyPreview />
        <UserTestimonialsAndSecurity />
        <Footer />
      </div>
    </>
  );
};
