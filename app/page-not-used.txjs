'use client'; // if using App Router

import React, { useState, useEffect } from 'react';

const traders = [
  {
    name: "byScript XMA",
    platform: "Real MT5",
    type: "Signal Trader",
    company: "PT Monex Investindo Futures",
    score: 35.89,
    winRatio: "66.24%",
    fund: "$760,649.25",
    drawdown: "12.02%",
    age: "39 Weeks",
    profit: "+34138.83",
    loss: "-17835.81",
    transactions: "17 Apr 2025, 03:51:17",
    subs: {
      monthly: "Rp15.000.000/month",
      performance: "30%",
    },
    signalsEnabled: true,
  },
  {
    name: "byScript XMA Futures",
    platform: "Real MT4",
    type: "Trader",
    company: "PT International Mitra Futures",
    score: 14.99,
    winRatio: "75%",
    fund: "$0.00",
    drawdown: "1.51%",
    age: "6 Weeks",
    profit: "+570.77",
    loss: "-106.91",
    transactions: "01 Jul 2025, 19:34:13",
    subs: {
      monthly: "Rp5.000.000/month",
      perLot: "Rp500.000/lot",
    },
    signalsEnabled: false,
  },
  {
    name: "GRID CUANTERUS",
    platform: "Real MT5",
    type: "Trader",
    company: "PT Monex Investindo Futures",
    score: 10.95,
    winRatio: "100%",
    fund: "$1.91",
    drawdown: "20.24%",
    age: "11 Weeks",
    profit: "+483.21",
    loss: "-0",
    transactions: "03 Jul 2025, 02:10:35",
    subs: {
      monthly: "Rp15.000.000/month",
      performance: "30%",
    },
    signalsEnabled: false,
  },
  {
    name: "XAU Hunter",
    platform: "Real MT4",
    type: "Signal Trader",
    company: "PT Monex Investindo Futures",
    score: 10.18,
    winRatio: "86%",
    fund: "$12,576.44",
    drawdown: "12.49%",
    age: "40 Weeks",
    profit: "+1041.24",
    loss: "-656.77",
    transactions: "25 Feb 2025, 14:41:55",
    subs: {
      monthly: "Rp5.000.000/month",
      performance: "30%",
    },
    signalsEnabled: true,
  },
];

export default function HomePage() {
  // Optional: dark mode toggler logic (manual)
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  return (
    <main className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
      {/* Navbar */}
      <nav className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
        <div className="text-2xl font-bold">byScript</div>
        <button
          onClick={() => setIsDark(!isDark)}
          className="text-sm border px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Toggle {isDark ? 'Light' : 'Dark'} Mode
        </button>
      </nav>

      {/* Hero */}
      <section className="text-center px-6 pt-10 pb-20">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
          Automate Trading With <br />
          <span className="bg-gradient-to-r from-blue-500 to-cyan-400 text-transparent bg-clip-text">
            Real-Time Strategy Execution
          </span>
        </h1>
        <p className="mt-6 text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
          Discover top-performing traders and connect instantly to copy trades via signal-based automation.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <button className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700">Get Started</button>
          <button className="border border-gray-400 dark:border-gray-600 px-6 py-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
            Learn More
          </button>
        </div>
      </section>

      {/* Trader Cards */}
      <section className="px-4 py-12 bg-gray-50 dark:bg-[#111115]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Top Signal Traders</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {traders.map((t, i) => (
              <div key={i} className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow p-5 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{t.platform}</span>
                    <span className="bg-gray-200 dark:bg-gray-700 dark:text-gray-100 px-2 py-0.5 rounded">General</span>
                  </div>
                  <h3 className="text-lg font-semibold">{t.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t.type} • {t.company}
                  </p>

                  <div className="mt-4 text-2xl font-bold text-green-500">Score {t.score}</div>
                  <p className="text-sm">With Win Ratio {t.winRatio}</p>

                  <div className="mt-3 text-sm">
                    <p><strong>Fund:</strong> {t.fund}</p>
                    <p><strong>Drawdown:</strong> {t.drawdown}</p>
                    <p><strong>Age:</strong> {t.age}</p>
                  </div>

                  <div className="mt-2">
                    <p className="text-green-600 font-medium text-sm">Profit: {t.profit}</p>
                    <p className="text-red-500 font-medium text-sm">Loss: {t.loss}</p>
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Latest: {t.transactions}</p>

                  <div className="mt-3 text-sm">
                    <p><strong>Subscriptions:</strong></p>
                    <ul className="list-disc list-inside">
                      <li>{t.subs.monthly}</li>
                      {t.subs.performance && <li>Performance Fee: {t.subs.performance}</li>}
                      {t.subs.perLot && <li>Transaction Fee: {t.subs.perLot}</li>}
                    </ul>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <button className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600">
                    Details
                  </button>
                  <button
                    disabled={!t.signalsEnabled}
                    className={`w-full px-4 py-2 rounded text-white ${
                      t.signalsEnabled
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Get Signal
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} MySaaS — All rights reserved.
      </footer>
    </main>
  );
}
