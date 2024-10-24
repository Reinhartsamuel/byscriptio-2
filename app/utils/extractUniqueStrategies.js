export default function extractUniqueStrategies(tradingStrategies) {
  // Use a Set to store unique strategy names
  const uniqueStrategies = new Set();

  // Iterate through the trading strategies
  tradingStrategies.forEach((strategy) => {
    // Extract the strategy name (before the first underscore)
    const strategyName = strategy.split('_')[0];
    uniqueStrategies.add(strategyName);
  });

  // Convert the Set back to an array and join into a string
  const strategyArray = Array.from(uniqueStrategies);
  return strategyArray.length === 1
    ? strategyArray[0]
    : strategyArray.join(', ');
}
