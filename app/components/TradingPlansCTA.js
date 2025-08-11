"use client";
import React from "react";
import PropTypes from "prop-types";
import useFetchData from "../hooks/QueryHook";
import useCountDocuments from "../hooks/CountHook";
import moment from "moment";
import { cn } from "@/lib/util";
import { useRouter } from "next/navigation";

const TradingPlanCTA = () => {
  // Format the backtest data into trader cards format

  const { data, loadMore } = useFetchData({
    collectionName: "backtest",
    limit: 10,
    conditions: [],
    type: "getDocs",
  });

  const { count } = useCountDocuments({
    collectionName: "backtest",
    conditions: [],
  });

  return (
    <section className="px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-100">
          Algorithmic Trading Strategies
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.length > 0 &&
            data.map((trade, i) => <TraderCard key={i} trade={trade} />)}
        </div>
        <div className="w-full flex justify-end mt-10">
          {count !== data.length && count !== 0 && (
            <button
              className="border border-gray-600  text-gray-300 font-thin py-2 px-4 rounded-lg"
              onClick={loadMore}
            >
              Load More
            </button>
          )}
        </div>
      </div>
    </section>
    // <></>
  );
};

export default TradingPlanCTA;

function TraderCard({ trade }) {
  // Extract metrics and backtestInfo from the trade object
  const router = useRouter();
  const { metrics, backtestInfo } = trade;
  const tradingPlanName = backtestInfo?.tradingPlanId;

  return (
    <div
      className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow p-5 flex flex-col justify-between"
    >
      <div>
        <div className="flex justify-between text-xl mb-2">
          <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-2 py-0.5 rounded">
            byScript
          </span>
          {/* <span className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-0.5 rounded">
            Algorithmic
          </span> */}
        </div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          {tradingPlanName}
        </h3>
        <div className="mt-4 text-2xl font-bold text-green-600 dark:text-green-400">
          PnL {parseFloat(metrics.pnlPercent).toLocaleString()}%
        </div>
        <p
          className={cn(
            "text-sm",
            parseFloat(metrics.winRate) < 40
              ? "text-red-500 dark:text-red-400"
              : parseFloat(metrics.winRate) >= 40 &&
                  parseFloat(metrics.winRate) < 50
                ? "text-orange-500 dark:text-orange-400"
                : parseFloat(metrics.winRate) >= 50 &&
                    parseFloat(metrics.winRate) < 60
                  ? "text-yellow-500 dark:text-yellow-400"
                  : "text-green-500 dark:text-green-400",
          )}
        >
          Win Ratio {parseFloat(metrics.winRate)}%
        </p>

        <div className="mt-3 text-sm text-gray-700 dark:text-gray-300">
          <p>
            <strong className="text-gray-800 dark:text-gray-200">
              Drawdown:
            </strong>{" "}
            {metrics.maxDrawdown}%
          </p>
          <p>
            <strong className="text-gray-800 dark:text-gray-200">
              Backtest Length:{" "}
            </strong>
            {backtestInfo?.timeLength?.humanized}
          </p>
          <p>
            <strong className="text-gray-800 dark:text-gray-200">
              Trades:
            </strong>
            {metrics.totalTrades}
          </p>
        </div>
        {/* <pre className="text-white">{JSON.stringify(trade, null, 2)}</pre> */}
        <div className="mt-2">
          <p className="text-green-600 dark:text-green-400 font-medium text-sm">
            Avg Win: {metrics.averageWin}
          </p>
          <p className="text-red-500 dark:text-red-400 font-medium text-sm">
            Avg Loss: {metrics.averageLoss}
          </p>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Backtested:{" "}
          {trade?.lastUpdated?.seconds
            ? moment.unix(trade?.lastUpdated?.seconds).fromNow()
            : "no recent data"}
        </p>
        {/* <pre> {JSON.stringify(trade.lastUpdated, null, 2)}</pre> */}

        <div className="mt-3 text-sm text-gray-700 dark:text-gray-300">
          <p>
            <strong className="text-gray-800 dark:text-gray-200">
              Performance:
            </strong>
          </p>
          <ul className="list-disc list-inside">
            <li>Profit: ${parseFloat(metrics.pnlUsd).toLocaleString()}</li>
            <li>Profit Factor: {metrics.profitFactor}</li>
            <li>Wins: {metrics.winningTrades}</li>
            <li>Losses: {metrics.losingTrades}</li>
          </ul>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={() =>
            router.push(`/dashboard/trading-plan/${tradingPlanName}`)
          }
          className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          Details
        </button>
        {/* <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">
          Subscribe
        </button>*/}
      </div>
    </div>
  );
}

TraderCard.propTypes = {
  trade: PropTypes.shape({
    trading_plan_pair: PropTypes.string.isRequired,
    metrics: PropTypes.shape({
      totalTrades: PropTypes.number.isRequired,
      losingTrades: PropTypes.number.isRequired,
      pnlPercent: PropTypes.string.isRequired,
      winningTrades: PropTypes.number.isRequired,
      averageLoss: PropTypes.string.isRequired,
      pnlUsd: PropTypes.string.isRequired,
      winRate: PropTypes.string.isRequired,
      profitFactor: PropTypes.string.isRequired,
      maxDrawdown: PropTypes.number.isRequired,
      averageWin: PropTypes.string.isRequired,
    }).isRequired,
    backtestInfo: PropTypes.shape({
      tradingPlanId: PropTypes.string.isRequired,
      timeLength: PropTypes.shape({
        days: PropTypes.number.isRequired,
        months: PropTypes.number.isRequired,
        years: PropTypes.number.isRequired,
        humanized: PropTypes.string.isRequired,
      }).isRequired,
      createdAt: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
