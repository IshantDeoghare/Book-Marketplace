//E:\pro-book-marketplace\backend\config\firebase.js
import admin from 'firebase-admin';

import { readFileSync } from 'fs';

// Read the service account key from the JSON file
const serviceAccount = JSON.parse(
  readFileSync('./config/firebase-service-account.json')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;