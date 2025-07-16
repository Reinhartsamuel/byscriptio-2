import extractObjectArray from "@/app/utils/extractObjectArray";
import sortTradesData from "@/app/utils/sortTradesData";
import calculateTradesDataData from "@/app/utils/calcultateTradesData";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import moment from "moment";
import { adminDb } from "@/lib/firebase-admin-config";
import cloneDeep from "lodash/cloneDeep";

export async function POST(request) {
  try {
    const { trading_plan_id } = await request.json();

    // Fetch backtest data from Firebase
    const backtests = [];
    const querySnapshot = await adminDb
      .collection("backtest")
      // .where("trading_plan_pair", "==", trading_plan_id)
      .limit(28)
      .get();
    querySnapshot.forEach((doc) => {
      backtests.push({ id: doc.id, ...doc.data() });
    });
    if (!backtests || backtests.length === 0) {
      return new Response(JSON.stringify({ error: "Backtest not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    console.log(backtests, "backtests");

    const promises = await Promise.allSettled(
      backtests.map((backtestData) =>
        getMetrics({
          trading_plan_pair: backtestData.trading_plan_pair,
          trade: backtestData,
          docId: backtestData.id,
        }),
      ),
    );
    const results = await Promise.all(promises);

    return new Response(
      JSON.stringify({
        data: results.map((x) =>
          x.status === "fulfilled" ? x.value : x.reason,
        ),
        successlength: results.filter((x) => x.status === "fulfilled").length,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error in /api/calculatetrades:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

async function getMetrics({ trading_plan_pair, trade, docId }) {
  const backtest = trade;
  const fileUrl = backtest.url;

  // Process file based on extension
  let tradesData = [];
  let headers = [];

  const extensionMatch = fileUrl.match(/\.([^./?#]+)(?:[?#]|$)/i);
  const fileExtension = extensionMatch ? extensionMatch[1].toLowerCase() : "";

  if (["xls", "xlsx"].includes(fileExtension)) {
    // Process Excel file
    const response = await fetch(fileUrl);
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const sheetsData = {};

    workbook.SheetNames.forEach((sheetName) => {
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        raw: false,
        cellDates: true,
      });
      sheetsData[sheetName] = jsonData;
    });

    tradesData = extractObjectArray(sheetsData["List of trades"]);
    headers = sheetsData["List of trades"][0];
  } else if (fileExtension === "csv") {
    // Process CSV file
    const response = await fetch(fileUrl);
    const text = await response.text();

    const result = await new Promise((resolve, reject) => {
      Papa.parse(text, {
        header: false,
        dynamicTyping: true,
        complete: resolve,
        error: reject,
      });
    });

    tradesData = extractObjectArray(result.data);
    headers = result.data[0];
  } else {
    throw new Error("Unsupported file format");
  }

  // Sort and calculate trades data
  const sortedTradesData = sortTradesData(tradesData);
  const dateFilter = {
    startDate: moment(
      sortedTradesData[0]?.["Date/Time"],
      "YYYY-MM-DD HH:mm",
    ).format("YYYY-MM-DD HH:mm"),
    endDate: moment(
      sortedTradesData[sortedTradesData.length - 1]?.["Date/Time"],
      "YYYY-MM-DD HH:mm",
    ).format("YYYY-MM-DD HH:mm"),
  };
  const initialCapital = 1000;

  const calculatedData = calculateTradesDataData({
    tradesData: sortedTradesData,
    dateFilter,
    initialCapital,
  });

  // console.log(calculatedData[0], "calculatedData[0]");
  // console.log(calculatedData[1], "calculatedData[1]");
  // console.log(calculatedData[2], "calculatedData[2]");
  // console.log(calculatedData[3], "calculatedData[3]");

  const safeClone = cloneDeep(calculatedData);

  // Calculate performance metrics
  const lastTrade = safeClone[safeClone.length - 1];

  // Count winning and losing trades
  const winningTrades = safeClone.filter(
    (trade) => parseFloat(trade?.["Profit USDT"]) > 0,
  );
  const losingTrades = safeClone.filter(
    (trade) => parseFloat(trade?.["Profit USDT"]) < 0,
  );

  // Calculate PnL in USD and percentage
  const pnlUsd = parseFloat(lastTrade.currentBalance) - initialCapital;
  const pnlPercent = (pnlUsd / initialCapital) * 100;

  // Get max drawdown
  const maxDrawdown = safeClone.sort(
    (a, b) => parseFloat(b["Drawdown %"]) - parseFloat(a["Drawdown %"]),
  )[0]?.["Drawdown %"];

  // Calculate win rate
  const winRate = ((winningTrades.length / safeClone.length) * 100).toFixed(2);

  // Calculate timeLength
  const firstTradeTime = moment.unix(calculatedData[0].timestamp);
  const lastTradeTime = moment.unix(
    calculatedData[calculatedData.length - 1].timestamp,
  );
  const timeLength = {
    days: lastTradeTime.diff(firstTradeTime, "days"),
    months: lastTradeTime.diff(firstTradeTime, "months"),
    years: lastTradeTime.diff(firstTradeTime, "years"),
    humanized: moment.duration(lastTradeTime.diff(firstTradeTime)).humanize(),
  };

  // Prepare response
  const responseData = {
    // tradesData: calculatedData,
    headers,
    metrics: {
      pnlUsd: pnlUsd.toFixed(2),
      pnlPercent: pnlPercent.toFixed(2),
      winRate,
      maxDrawdown,
      totalTrades: calculatedData.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      // Additional performance metrics
      averageWin: (
        winningTrades.reduce(
          (sum, trade) => sum + parseFloat(trade["Profit USDT"]),
          0,
        ) / winningTrades.length
      ).toFixed(2),
      averageLoss: (
        losingTrades.reduce(
          (sum, trade) => sum + parseFloat(trade["Profit USDT"]),
          0,
        ) / losingTrades.length
      ).toFixed(2),
      profitFactor:
        winningTrades.length > 0 && losingTrades.length > 0
          ? (
              winningTrades.reduce(
                (sum, trade) =>
                  sum + Math.abs(parseFloat(trade["Profit USDT"])),
                0,
              ) /
              losingTrades.reduce(
                (sum, trade) =>
                  sum + Math.abs(parseFloat(trade["Profit USDT"])),
                0,
              )
            ).toFixed(2)
          : "N/A",
    },
    backtestInfo: {
      createdAt: moment(backtest.createdAt).format("DD-MM-YYYY HH:mm:ss"),
      tradingPlanId: trading_plan_pair,
      timeLength,
    },
  };
  Promise.resolve().then(() =>
    adminDb.collection("backtest").doc(docId).update({
      metrics: responseData.metrics,
      backtestInfo: responseData.backtestInfo,
    }),
  );
  return responseData;
}
