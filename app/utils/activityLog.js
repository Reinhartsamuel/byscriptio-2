import { addDocumentFirebase } from './firebaseApi';

export async function addActivityLog({
  customerId,
  uid,
  ipLocation,
  type = 'LOGIN',
}) {
  try {
    await addDocumentFirebase('activity_logs', {
      customerId,
      uid,
      ip: ipLocation.ip,
      userAgent: ipLocation.userAgent,
      location: ipLocation.location,
      type,
    });
  } catch (error) {
    console.error(error.message);
  }
}
