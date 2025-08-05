import React from "react";
import {
  ShieldCheckIcon,
  LockClosedIcon,
} from "@heroicons/react/24/solid";
import { FaRobot, FaPlug } from "react-icons/fa6";

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

const WhyByScriptSection = () => {
  return (
    <section className="bg-[#0f1114] text-white px-6 py-20">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold">
          Why <span className="text-brand_primary">byScript</span>?
        </h2>
        <p className="mt-4 text-white/70 max-w-2xl mx-auto">
          Last year, byScript users grew their assets by 300% — no noisy signals,
          no endless charts.
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






export default function page() {
  return (
    <>
      <div className="bg-black text-white min-h-screen">
        {/* Navbar */}
        <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="text-xl font-bold">
            <span className="text-brand_primary">by</span>Script.io
          </div>
          <ul className="hidden md:flex gap-6 text-sm font-medium">
            <li className="hover:text-brand_primary cursor-pointer">Home</li>
            <li className="hover:text-brand_primary cursor-pointer">Strategies</li>
            <li className="hover:text-brand_primary cursor-pointer">Performance</li>
            <li className="hover:text-brand_primary cursor-pointer">How It Works</li>
            <li className="hover:text-brand_primary cursor-pointer">FAQ</li>
          </ul>
          <div className="flex gap-4">
            <button className="border border-white/20 px-4 py-1.5 rounded-md hover:bg-white/10 transition">
              Login
            </button>
            <button className="bg-brand_primary text-black px-4 py-1.5 rounded-md font-semibold hover:bg-cyan-300 transition">
              Start Trading
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <section
          className="relative px-6 py-20 text-center flex flex-col items-center justify-center"
          style={{
            backgroundImage:
              "url('/path/to/your/bg-graphic.png')", // replace with actual path or use Tailwind’s bg-[url()]
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <h1 className="text-4xl md:text-6xl font-bold max-w-3xl leading-tight">
            Let the Algorithm{" "}
            <span className="text-brand_primary">Trade for You.</span>
          </h1>
          <p className="mt-4 text-lg text-white/70">
            No guesswork. No sleepless nights. Just strategy.
          </p>
          <div className="mt-8 flex gap-4 flex-wrap justify-center">
            <button className="bg-brand_primary text-black px-6 py-3 rounded-md font-semibold hover:bg-cyan-300 transition">
              Start Auto Trading Now
            </button>
            <button className="border border-white/20 px-6 py-3 rounded-md font-semibold hover:bg-white/10 transition">
              View Strategies
            </button>
          </div>
        </section>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-6 py-12 text-center">
          <div className="bg-white/5 p-6 rounded-md border border-white/10">
            <p className="text-2xl font-bold text-brand_primary">$330K+</p>
            <p className="text-white/70 mt-1 text-sm">Assets Under Management</p>
          </div>
          <div className="bg-white/5 p-6 rounded-md border border-white/10">
            <p className="text-2xl font-bold text-brand_primary">200+</p>
            <p className="text-white/70 mt-1 text-sm">
              Exchange Accounts Connected
            </p>
          </div>
          <div className="bg-white/5 p-6 rounded-md border border-white/10">
            <p className="text-2xl font-bold text-brand_primary">500+</p>
            <p className="text-white/70 mt-1 text-sm">Peak Active Users</p>
          </div>
        </div>
      </div>
      <WhyByScriptSection />

    </>
  );
};
