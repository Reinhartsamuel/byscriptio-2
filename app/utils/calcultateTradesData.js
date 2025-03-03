import moment from 'moment';

export default function calculateTradesDataData({
  tradesData,
  dateFilter,
  initialCapital = 150,
}) {
  const filteredTradesData = [];

  for (let trade of tradesData) {
    const tradeDate = moment(trade['Date/Time'], 'YYYY-MM-DD HH:mm');
    if (
      tradeDate.isBetween(
        moment(dateFilter.startDate, 'YYYY-MM-DD HH:mm'),
        moment(dateFilter.endDate, 'YYYY-MM-DD HH:mm')
      )
    ) {
      filteredTradesData.push(trade);
    }
  }
  const newArr = [];
  const copyArr = [];

  for (let i = 0; i < filteredTradesData.length; i++) {
    const currentTrade = filteredTradesData[i];

    // ALGOTRADE ROI CALCULATION=======================================================================
    // ALGOTRADE ROI CALCULATION=======================================================================
    // ALGOTRADE ROI CALCULATION=======================================================================
    const profitDecimal = parseFloat(currentTrade['Profit %']) / 100;
    const previousBalance = copyArr[i - 1]?.currentBalance || initialCapital;
    const balanceAfter = previousBalance * (1 + profitDecimal);

    // BUY AND HOLD ROI CALCULATION=======================================================================
    // BUY AND HOLD ROI CALCULATION=======================================================================
    // BUY AND HOLD ROI CALCULATION=======================================================================
    // const previousPrice = copyArr[i-1]?.['Price'] || null;
    // const previousBuyAndHoldBalance = copyArr[i-1]?.['currentBuyAndHoldBalance'] || initialCapital;
    // const currentBuyAndHoldBalance = (Number(currentTrade)/Number(previousBuyAndHoldBalance)) * previousBuyAndHoldBalance;
    // const buyAndHoldBalanceAfter =

    copyArr.push({
      ...currentTrade,
      currentBalance: balanceAfter,
      //  currentBuyAndHoldBalance,
      //  previousPrice
    });
    newArr.push({
      ...currentTrade,
      currentBalance: balanceAfter,
      profitDecimal,
      previousBalance,
      timestamp: moment(currentTrade['Date/Time'], 'YYYY-MM-DD HH:mm').unix(),
    });
  }
  return newArr.sort((a, b) => {
    return Number(a.timestamp) - Number(b.timestamp);
  });
}
