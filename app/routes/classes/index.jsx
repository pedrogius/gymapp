import { Link } from "remix";
import { json, useLoaderData } from "remix";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import { requireAuth } from "~/utils/auth.server";
import { getAllClasses } from "~/utils/db.server";

export async function loader({ request }) {
  const { user, isAdmin } = await requireAuth(request, { getIsAdmin: true });

  const data = {
    data: user,
    classes: await getAllClasses(),
    isAdmin,
  };

  return json(data);
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
  const { error, data, classes, isAdmin } = useLoaderData();

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
        <CardHeader>Clases</CardHeader>
        {isAdmin ? (
          <Link
            to="/classes/create"
            className="flex justify-center px-4 py-2 font-bold text-white bg-teal-600 border border-transparent rounded-md shadow-md text-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            Nueva Clase
          </Link>
        ) : null}
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
