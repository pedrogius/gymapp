import firebaseAdmin from "firebase-admin";
import { applicationDefault } from "firebase-admin/app";
import * as dotenv from "dotenv";
dotenv.config();

if (!firebaseAdmin.apps.length) {
  firebaseAdmin.initializeApp({
    credential: applicationDefault(),
    databaseURL: "gymapp-4622c.firebaseio.com",
  });
}
export default firebaseAdmin;
