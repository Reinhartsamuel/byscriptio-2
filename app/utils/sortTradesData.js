import moment from 'moment';

export default function sortTradesData(tradesData) {
  const arr =  moment(
    moment(tradesData[0]?.['Date/Time'], 'YYYY-MM-DD HH:mm')
  ).isBefore(
    moment(tradesData[tradesData.length - 1]?.['Date/Time'], 'YYYY-MM-DD HH:mm')
  )
    ? tradesData.filter(
        (trade) => trade.Signal === 'Sell' || trade.Signal === 'Close'
      )
    : tradesData
        .filter((trade) => trade.Signal === 'Sell' || trade.Signal === 'Close')
        ?.reverse();

        return arr.sort((a, b) => Number(a["Trade #"]) - Number(b["Trade #"]));
}
