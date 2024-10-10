import { google } from 'googleapis';
// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar'];

/**
 * Load credentials from environment variables.
 *
 * @return {OAuth2Client}
 */
function loadCredentialsFromEnv() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  let error = [];
  if (!clientId) error.push('Missing clientId');
  if (!clientSecret) error.push('Missing clientSecret');
  if (!refreshToken) error.push('Missing refreshToken');
  if (error.length > 0) {
    throw new Error(error.join('\n'));
  }

  const client = new google.auth.OAuth2(clientId, clientSecret);
  client.setCredentials({refresh_token: refreshToken});
  return client;
}

/**
 * Load or request or authorization to call APIs.
 *
 */
export async function authorize() {
  const client = loadCredentialsFromEnv();
  return client;
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */