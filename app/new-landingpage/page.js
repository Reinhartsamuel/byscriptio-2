'use client'
import { useState } from "react";
import React from "react";


export default function LandingPage() {
  const [faqOpen, setFaqOpen] = useState(null);

  const toggleFaq = (i) => {
    setFaqOpen(faqOpen === i ? null : i);
  };

  return (
    <div className="bg-black text-white">
      {/* ===== Navbar + Hero ===== */}
      <div className="relative bg-black min-h-screen overflow-hidden">
        <img
          src="/pricechart.png"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          alt=""
        />
        <nav className="flex justify-between items-center px-6 md:px-20 py-4 z-10 relative">
          <div className="text-2xl font-bold">
            <span className="text-cyan-400">by</span>Script.io
          </div>
          <ul className="hidden md:flex space-x-6 text-sm font-medium">
            <li><a href="#">Home</a></li>
            <li><a href="#">Strategies</a></li>
            <li><a href="#">Performance</a></li>
            <li><a href="#">How It Works</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
          <div className="space-x-2">
            <button className="px-4 py-1 border rounded-md">Login</button>
            <button className="px-4 py-1 bg-cyan-400 text-black font-medium rounded-md">
              Start Trading
            </button>
          </div>
        </nav>

        <section className="relative z-10 px-6 md:px-20 pt-20 pb-32 mx-auto h-screen flex flex-col justify-between">
          <div className="mt-20">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Let the Algorithm <span className="text-cyan-400">Trade for You.</span>
            </h1>
            <p className="mt-4 text-2xl text-gray-300">
              No guesswork. No sleepless nights. Just strategy.
            </p>
            <div className="mt-20 flex flex-col sm:flex-row gap-4 md:text-xl">
              <button className="px-6 py-3 bg-brand_primary text-black font-semibold rounded-md">
                Start Auto Trading Now
              </button>
              <button className="px-6 py-3 border border-white text-white rounded-md">
                View Strategies
              </button>
            </div>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-700 p-6 text-center rounded-md">
              <div className="text-2xl font-bold text-brand_primary">$330K+</div>
              <div className="text-gray-400 mt-1 text-sm">Assets Unxxxder Management</div>
            </div>
            <div className="border border-gray-700 p-6 text-center rounded-md">
              <div className="text-2xl font-bold text-brand_primary">200+</div>
              <div className="text-gray-400 mt-1 text-sm">Exchange Accounts Connected</div>
            </div>
            <div className="border border-gray-700 p-6 text-center rounded-md">
              <div className="text-2xl font-bold text-brand_primary">500+</div>
              <div className="text-gray-400 mt-1 text-sm">Peak Active Users</div>
            </div>
          </div>
        </section>
      </div>

      {/* ===== Strategy Cards ===== */}
      <section className="bg-black px-6 md:px-12 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">Top Performing Strategies</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="border border-gray-700 rounded-xl p-6 bg-[#111111] hover:shadow-lg transition"
            >
              <h3 className="text-xl font-bold text-cyan-400 mb-2">Strategy #{i}</h3>
              <p className="text-gray-400 text-sm mb-4">High performance trend-following model using XYZ indicators.</p>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>📈 3-Month Return: <span className="text-white font-semibold">+52%</span></li>
                <li>📊 Risk: <span className="text-yellow-300">Moderate</span></li>
                <li>💼 Assets: BTC, ETH, SOL</li>
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Performance Chart Preview ===== */}
      <section className="bg-black px-6 md:px-12 py-20 max-w-6xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Performance You Can Trust</h2>
          <p className="text-gray-400 mb-8">
            Our strategies are battle-tested in live markets. Transparent. Verified.
          </p>
          <img src="/chart-preview.png" alt="Performance Chart" className="rounded-lg mx-auto max-w-full border border-gray-800" />
        </div>
      </section>

      {/* ===== How It Works Timeline ===== */}
      <section className="bg-black px-6 md:px-12 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
        <div className="space-y-8">
          {[
            { step: "Connect your exchange", desc: "We support Binance, KuCoin, and more." },
            { step: "Choose a strategy", desc: "Pick from battle-tested algorithms curated by pros." },
            { step: "Activate auto trading", desc: "Sit back, monitor, and adjust when needed." },
          ].map((item, i) => (
            <div key={i} className="flex items-start space-x-4">
              <div className="text-cyan-400 text-3xl font-bold">0{i + 1}</div>
              <div>
                <h3 className="font-semibold text-lg">{item.step}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FAQ Accordion ===== */}
      <section className="bg-black px-6 md:px-12 py-20 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            { q: "Is this safe?", a: "We never custody your funds. Strategies trade via your exchange APIs with read-only or trade-only access." },
            { q: "How do I start?", a: "Just create an account, connect your exchange, and choose a strategy." },
            { q: "Can I withdraw anytime?", a: "Yes. You always have full control of your assets." },
          ].map((item, i) => (
            <div key={i} className="border border-gray-700 rounded-md p-4">
              <button
                className="w-full flex justify-between items-center text-left"
                onClick={() => toggleFaq(i)}
              >
                <span className="font-medium">{item.q}</span>
                <span>{faqOpen === i ? "−" : "+"}</span>
              </button>
              {faqOpen === i && <p className="text-gray-400 mt-2">{item.a}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="bg-black border-t border-gray-800 px-6 md:px-12 py-8 text-center text-sm text-gray-500">
        © 2025 byScript.io — All rights reserved.
      </footer>
    </div>
  );
}
