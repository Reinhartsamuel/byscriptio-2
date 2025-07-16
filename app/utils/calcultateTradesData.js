import moment from "moment";

export default function calculateTradesDataData({
  tradesData,
  dateFilter,
  initialCapital = 150,
}) {
  // Create a new array with proper date parsing
  const tradesWithDates = tradesData.map((trade) => {
    // Parse date and create timestamp
    const dateTime = moment(trade["Date/Time"], "YYYY-MM-DD HH:mm");
    const timestamp = dateTime.isValid() ? dateTime.unix() : 0;

    // Clean numeric values
    const cleanNumeric = (value) => {
      if (typeof value === "string") {
        // Remove commas and percentage signs
        return parseFloat(value.replace(/,|%/g, ""));
      }
      return value;
    };

    return {
      ...trade,
      timestamp,
      "Profit %": cleanNumeric(trade["Profit %"]),
      "Profit USDT": cleanNumeric(trade["Profit USDT"]),
      "Drawdown %": cleanNumeric(trade["Drawdown %"]),
      "Run-up %": cleanNumeric(trade["Run-up %"]),
    };
  });

  // Sort by timestamp (oldest first)
  const sortedTrades = [...tradesWithDates].sort(
    (a, b) => a.timestamp - b.timestamp,
  );

  // Filter by date range
  const startDate = moment(dateFilter.startDate, "YYYY-MM-DD HH:mm");
  const endDate = moment(dateFilter.endDate, "YYYY-MM-DD HH:mm");

  const filteredTrades = sortedTrades.filter((trade) => {
    const tradeDate = moment.unix(trade.timestamp);
    return tradeDate.isBetween(startDate, endDate, null, "[]");
  });

  // Calculate cumulative values
  let currentBalance = initialCapital;
  let cumulativeProfitUsdt = 0;

  return filteredTrades.map((trade) => {
    const profitDecimal = trade["Profit %"] / 100;

    // Calculate new balance
    currentBalance = currentBalance * (1 + profitDecimal);

    // Calculate cumulative profit in USD
    cumulativeProfitUsdt += trade["Profit USDT"];

    return {
      ...trade,
      currentBalance,
      profitDecimal,
      cumulativeProfitUsdt,
      cumulativeProfitPercent:
        ((currentBalance - initialCapital) / initialCapital) * 100,
    };
  });
}
