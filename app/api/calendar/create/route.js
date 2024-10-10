import { google } from 'googleapis';
import { authorize } from '../authorize';
import { adminDb } from '../../../../lib/firebase-admin-config';

const createEvent = async (auth, event) => {
  try {
    const {
      summary,
      location,
      description,
      start,
      end,
      recurrence,
      attendees,
    } = event;
    const eventDetails = {
      summary: summary || 'byScript',
      location: location || '800 Howard St., San Francisco, CA 94103',
      description:
        description ||
        "A chance to hear more about Google's developer products.",
      start: start || {
        dateTime: '2024-07-02T09:00:00-07:00',
        timeZone: 'Asia/Jakarta',
      },
      end: end || {
        dateTime: '2024-07-03T17:00:00.000Z',
        timeZone: 'Asia/Jakarta',
      },
      recurrence: ['RRULE:FREQ=DAILY;COUNT=1'],
      attendees: attendees || [
        { email: 'smuel.rr@gmail.com' },
        { email: 'reinhartsams@gmail.com' },
      ],
      reminders: recurrence || {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 10 },
        ],
      },
      organizer: {
        email: 'new.organizer@example.com',
        displayName: 'New Organizer',
      },
      notifications: true,
    };
    console.log('before calendar');
    const calendar = google.calendar({ version: 'v3', auth });
    console.log('after calendar');

    // Extract the conference ID from the response
    const result = await calendar.events.insert({
      auth: auth,
      calendarId: 'primary',
      resource: eventDetails,
    });
    console.log('after calendar.events.insert');
    console.log(result, 'result calendar.events.insert');







    
    const eventPatch = {
      conferenceData: {
        createRequest: { requestId: result.data.id },
      },
    };
    const anjing = calendar.events.patch({
      calendarId: 'primary',
      eventId: result.data.id,
      resource: eventPatch,
      sendNotifications: true,
      conferenceDataVersion: 1,
    });
    console.log('anjing::::', anjing);
    await adminDb.collection('calendar_events').doc(result.data.id).set({...result.data, createdAt : new Date()});
    return result.data;
  } catch (error) {
    console.log(error.message, 'error create event');
    throw new Error(error.message);
  }
};

export async function POST(request) {
  try {
    const body = await request.json();
    const event = {
      summary: body.summary,
      location: body.location,
      description: body.description,
      start: body.start,
      end: body.end,
      recurrence: body.recurrence,
      attendees: body.attendees,
    };

    // authorize request
    const auth = await authorize();

    // create event
    const result = await createEvent(auth, event);

    // save event to firebase firestore
    if (result?.created && result?.id)
      await adminDb.collection('calendar_events').doc(result?.id).set({...result, createdAt : new Date()});

    return Response.json({
      status: true,
      message: 'Event successfully created',
      data: result,
      id: result?.id || null,
    });
  } catch (error) {
    return Response.json({
      status: false,
      message: error.message,
      data: error,
    });
  }
}
