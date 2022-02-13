import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import { Link } from "remix";
import { json, redirect, useLoaderData } from "remix";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import { commitSession, getSession } from "~/sessions.server";
import { auth, db } from "~/utils/firebase";

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));

  if (!session.has("access_token")) {
    // Redirect to the home page if they are not signed in.
    return redirect("/login");
  }
  const docRef = doc(db, "users", auth.currentUser.uid);
  const docSnap = await getDoc(docRef);

  const q = query(collection(db, "classes"));
  const querySnapshot = await getDocs(q);
  const arr = [];
  querySnapshot.forEach((doc) => {
    const { id } = doc;
    arr.push({ ...doc.data(), id });
  });

  const data = {
    error: session.get("error"),
    data: docSnap.data(),
    classes: arr,
  };

  return json(data, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

const days = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miercoles",
  "Jueves",
  "Viernes",
  "Sabado",
];

const index = () => {
  const { error, data, classes } = useLoaderData();
  console.log(classes);
  const parseDays = (day) => {
    if (typeof day === "string") {
      return days[day];
    } else {
      return day.map((d) => `${days[d]}, `);
    }
  };
  return (
    <div>
      <Card>
        <CardHeader>Classes</CardHeader>
      </Card>
      {classes.length
        ? classes.map((item) => (
            <Card key={item.id}>
              <CardHeader>{item.name}</CardHeader>
              <p>{item.description}</p>
              <p>Dias: {parseDays(item.days)}</p>
              <p>
                Hora:{" "}
                {`${item.hour}:${item.minute.toLocaleString("en-US", {
                  minimumIntegerDigits: 2,
                  useGrouping: false,
                })}`}
              </p>
              <div className="flex mt-4 space-x-4">
                <Link
                  to={`/classes/register/${item.id}`}
                  className="flex justify-center px-4 py-2 font-bold text-white bg-teal-600 border border-transparent rounded-md shadow-md text-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  Registrar
                </Link>
                <Link
                  to={`/classes/edit/${item.id}`}
                  className="flex justify-center px-4 py-2 font-bold text-white bg-indigo-600 border border-transparent rounded-md shadow-md text-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Editar
                </Link>
              </div>
            </Card>
          ))
        : null}
    </div>
  );
};

export default index;
