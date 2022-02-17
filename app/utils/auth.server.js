import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { redirect } from "remix";
import { destroySession, getSession } from "~/session";
import { auth, db } from "./firebase.server";
import firebaseAdmin from "./firebaseAdmin.server";
import { getUserData } from "./db.server";

export const checkSessionCookie = async (session) => {
  try {
    const decodedIdToken = await firebaseAdmin
      .auth()
      .verifySessionCookie(session.get("session") || "");
    return decodedIdToken;
  } catch {
    return { uid: undefined };
  }
};

export const requireAuth = async (request, { getIsAdmin } = false) => {
  const session = await getSession(request.headers.get("Cookie"));
  const { uid } = await checkSessionCookie(session);
  if (!uid) {
    throw redirect("/login", {
      headers: { "Set-Cookie": await destroySession(session) },
    });
  }
  if (getIsAdmin) {
    try {
      const { isAdmin } = await getUserData(uid);
      return { user: await firebaseAdmin.auth().getUser(uid), isAdmin };
    } catch (e) {
      console.log(e);
    }
  }
  return { user: await firebaseAdmin.auth().getUser(uid) };
};

export const signIn = async (email, password) => {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  const idToken = await user.getIdToken();
  const expiresIn = 1000 * 60 * 60 * 24 * 7 * 2; // 2 weeks
  const sessionCookie = await firebaseAdmin
    .auth()
    .createSessionCookie(idToken, {
      expiresIn,
    });
  return sessionCookie;
};

export const signUp = async (email, password) => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  const docRef = doc(db, "users", user.uid);
  await setDoc(docRef, {
    email,
    isAdmin: false,
    created: Timestamp.now(),
  });
  return await signIn(email, password);
};
