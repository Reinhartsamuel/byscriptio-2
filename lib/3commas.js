/* eslint-disable no-undef */
import threeCommasAPI from '3commas-api-node';

export const threeCommas = new threeCommasAPI({
    apiKey: process.env.THREE_COMMAS_API_KEY,
    apiSecret: process.env.THREE_COMMAS_API_SECRET,
  // url: 'https://api.3commas.io' // this is optional in case of defining other endpoint
  forcedMode: 'paper', // this is optional in case of defining account mode, 'real' or 'paper'
});
