'use client'
import { addDocumentFirebase } from './firebaseApi';

export async function addActivityLog({
  customerId,
  uid,
  type = 'LOGIN',
  userAgent = null
}) {
  try {
    const ipFetch = await fetch('https://api.ipify.org/?format=json');
    const { ip: ipResult } = await ipFetch.json();

    const locationFetch = await fetch('http://ip-api.com/json');
    const locationResult = await locationFetch.json();

    await addDocumentFirebase('activity_logs', {
      customerId,
      uid,
      ip: ipResult,
      userAgent: navigator ? navigator?.userAgent : userAgent,
      location: locationResult,
      type,
    });
  } catch (error) {
    console.error(error.message);
  }
}
