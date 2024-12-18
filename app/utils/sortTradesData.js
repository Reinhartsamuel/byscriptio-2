import moment from 'moment';

export default function sortTradesData(tradesData) {
  return moment(
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
}
