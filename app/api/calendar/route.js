import { google } from 'googleapis';
import { authorize } from './authorize';
// If modifying these scopes, delete token.json.

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listEvents(auth) {
  const calendar = google.calendar({version: 'v3', auth});
  const res = await calendar.events.list({
    calendarId: 'primary',
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  });
  const events = res.data.items;
  if (!events || events.length === 0) {
    console.log('No upcoming events found.');
    return []
  }
  console.log('Upcoming 10 events:');
  events.map((event, i) => {
    const start = event.start.dateTime || event.start.date;
    console.log(`${start} - ${event.summary}`);
  });
  return events
}

export async function POST(request) {
  const body = await request.json();
  console.log(body, 'body')
  try {
    let auth = await authorize();
    const events = await listEvents(auth);
    return Response.json({ status: true, events });
  } catch (error) {
    return Response.json({ status: false, message: error.message, error });
  }
}
