import axios from "axios";
import { FieldValue } from "firebase-admin/firestore";
import { redirect } from "remix";
import firebaseAdmin from "~/utils/firebaseAdmin.server";

const firestore = firebaseAdmin.firestore();

export const getAllUsers = async () => {
  const users = await firestore.collection("users").get();
  const arr = [];
  users.forEach((user) => arr.push({ ...user.data(), id: user.id }));
  return arr;
};

export const getUserData = async (uid) => {
  const userDoc = await firestore.collection("users").doc(uid).get();
  return userDoc.data();
};

export const editUserData = async (uid, newData) => {
  await firestore.collection("users").doc(uid).update(newData);
};

export const deleteClass = async (classId) => {
  await firestore.collection("classes").doc(classId).delete();
};

export const getAllClasses = async () => {
  const classes = await firestore.collection("classes").get();
  const arr = [];
  classes.forEach((c) => arr.push({ ...c.data(), id: c.id }));
  return arr;
};

export const getClass = async (classId) => {
  const gymClass = await firestore.collection("classes").doc(classId).get();
  return gymClass.data();
};

export const createClass = async (data) => {
  await firestore.collection("classes").add(data);
};

export const updateClass = async (data, classId) => {
  if (data.remote === "on") {
    await firestore
      .collection("classes")
      .doc(classId)
      .update({
        ...data,
        location: FieldValue.delete(),
        locationName: FieldValue.delete(),
      });
    return redirect("/classes");
  } else {
    if (data.location) {
      const res = await axios(
        `https://maps.googleapis.com/maps/api/place/details/json?placeid=${data.location}&key=${process.env.PLACES_API_KEY}`
      );
      const newData = {
        ...data,
        locationName: res.data.result.name,
        remote: "off",
      };
      await firestore.collection("classes").doc(classId).update(newData);
      return redirect("/classes");
    } else {
      await firestore
        .collection("classes")
        .doc(classId)
        .update({ ...data, remote: "off" });
      return redirect("/classes");
    }
  }
};
