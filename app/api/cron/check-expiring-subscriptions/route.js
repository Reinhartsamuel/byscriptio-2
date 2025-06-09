import { adminDb } from "@/lib/firebase-admin-config";
import { Timestamp } from "firebase-admin/firestore";
import moment from "moment";
import { expiredNotification } from "../../email/expiry-notification/expiry-notification";

export async function POST() {
  try {
    const customersRef = adminDb.collection('customers');
    const now = moment();

    // Query for all premium users whose subscriptions expire in the next 3 days
    const startOfDay = now.clone().startOf('day');
    const endOfTwoDays = now.clone().add(3, 'days').endOf('day');

    const startDateTimestamp = Timestamp.fromDate(startOfDay.toDate());
    const endDateTimestamp = Timestamp.fromDate(endOfTwoDays.toDate());

    const querySnapshot = await customersRef
      .where('isPremium', '==', true)
      .where('expiredAt', '>=', startDateTimestamp)
      .where('expiredAt', '<=', endDateTimestamp)
      .get();

    if (querySnapshot.empty) {
      console.log('No expiring subscriptions found.');
      return Response.json({ status: true, message: 'No expirations found.' });
    }

    const expiringToday = [];
    const expiringInOneDay = [];
    const expiringInTwoDays = [];
    const all = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      all.push({ id: doc.id, ...data });
      const expirySeconds = data.expiredAt?._seconds;
      const expiryDate = moment.unix(expirySeconds);

      const diffDays = expiryDate.diff(now, 'days');

      if (diffDays === 0) {
        expiringToday.push({ id: doc.id, ...data });
      } else if (diffDays === 1) {
        expiringInOneDay.push({ id: doc.id, ...data });
      } else if (diffDays === 2) {
        expiringInTwoDays.push({ id: doc.id, ...data });
      } else {
        console.log(`Subscription for ${data.email} expires in ${diffDays} days.`);
      }
    });

    // Notify users expiring in 2 days
    await Promise.allSettled(
      expiringInTwoDays.map(customer =>
        sendExpiryReminder(customer, 2)
      )
    );

    // Notify users expiring in 1 day
    await Promise.allSettled(
      expiringInOneDay.map(customer =>
        sendExpiryReminder(customer, 1)
      )
    );

    // Downgrade users whose subscriptions have expired today
    await Promise.allSettled(
      expiringToday.map(async (customer) => {
        const customerRef = customersRef.doc(customer.id);
        await customerRef.update({
          isPremium: false,
          lastDowngradedAt: new Date(),
          paymentStatus: 'WAITING_REPURCHASE'
        });

        // Optional: disable services like AutoTrader
        await disableAutotraders(customer);

        // Send final expiration email
        await sendExpiryReminder(customer, 0);
      })
    );

    return Response.json({
      status: true,
      expiringToday: expiringToday.length,
      expiringInOneDay: expiringInOneDay.length,
      expiringInTwoDays: expiringInTwoDays.length,
      all: all.map((x) => ({ name: x.name, email: x.email, EXPIREDDDD: moment.unix(x.expiredAt._seconds).format('DD MMM YYYY HH:mm') })),
    });

  } catch (error) {
    console.error('Error processing subscription expirations:', error);
    return Response.json({ status: false, error: error.message });
  }
}

// Dummy functions — replace these with real implementations

async function sendExpiryReminder(customer, daysLeft) {
  // Replace with actual email sending logic (e.g., SendGrid, SMTP, etc.)
  await sendEmail({
    customer,
    daysLeft,
  })
  console.log(`Sending reminder to ${customer.email} - expires in ${daysLeft} day(s)`);
}

async function disableAutotraders(customer) {
  // Disable user's AutoTrader here
  console.log(`Disabling Autotraders for customer: ${customer.name} - ${customer.email} id : ${customer.id}`);
  const autotradersRef = adminDb.collection('dca_bots');
  const autotradersSnapshot = await autotradersRef
    .where('customerId', '==', customer.id)
    .get();
  autotradersSnapshot.forEach((doc) => {
    autotradersRef.doc(doc.id).update({
      status: 'disabled',
    });
  })
}


async function sendEmail({
  customer,
  daysLeft,
}) {
  const autotraders = [];
  const autotradersSnapshot = await adminDb
    .collection('dca_bots')
    .where('customerId', '==', customer.id)
    .get();
  autotradersSnapshot.forEach((doc) => {
    autotraders.push({ ...doc.data(), id: doc.id });
  })

  const emailBody = {
    sender: {
      name: 'byScript.io',
      email: 'info@byscript.io',
    },
    to: [
      {
        email: customer.email,
        name: customer.name,
      },
    ],
    bcc: [
      { name: 'Reinhart', email: 'reinhartsams@gmail.com' },
      { name: 'Edwin', email: 'edwinfardyanto@gmail.com' },
    ],
    subject: daysLeft === 0 ? 'byScript.io subscription has expired' : `byScript.io subscription will expire in ${daysLeft} day(s)`,
    htmlContent: expiredNotification({
      name: customer.name,
      autotraders,
      daysLeft,
      downgradeCustomer: daysLeft === 0,
    })
  };
  // return console.log(`
  //   sending email to ${customer.email} - ${customer.name} - ${daysLeft} day(s),
  //   downgradeCustomer: ${daysLeft === 0}
  //   `);
  const resemail = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    body: JSON.stringify(emailBody),
    headers: {
      accept: 'application/json',
      // eslint-disable-next-line no-undef
      'api-key': process.env.BREVO_API_KEY,
      'content-type': 'application/json',
    },
  })
  return await resemail.json();
}

