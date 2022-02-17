import { doc, getDoc } from "firebase/firestore";
import { json, redirect, useLoaderData } from "remix";
import { commitSession, getSession } from "~/session";
import { requireAuth } from "~/utils/auth.server";
import { getAllUsers, getClass } from "~/utils/db.server";
import { auth, db } from "~/utils/firebase.server";

/* 
date
attendees
routine
*/

export async function loader({ request, params }) {
  const { user, isAdmin } = await requireAuth(request, { getIsAdmin: true });
  if (!isAdmin) return redirect("/login");

  const classData = await getClass(params.classId);
  const allUsers = await getAllUsers();

  const data = {
    allUsers,
    classData,
  };

  return json(data, {});
}

const registerClass = () => {
  const data = useLoaderData();
  return <div>Register</div>;
};

export default registerClass;
