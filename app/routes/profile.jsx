import { Form, json, useActionData, useLoaderData } from "remix";
import { validationError } from "remix-validated-form";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import Select from "react-select";
import { useEffect, useState } from "react";
import { withYup } from "@remix-validated-form/with-yup";
import * as yup from "yup";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "~/utils/firebase.server";
import Input from "~/components/Input";
import SubmitButton from "~/components/SubmitButton";
import { requireAuth } from "~/utils/auth.server";
import { editUserData, getUserData } from "~/utils/db.server";

export const validator = withYup(
  yup.object({
    name: yup.string().required("Ingresa tu nombre"),
    phoneNumber: yup
      .string()
      .matches(/^[0-9]+$/, "No parece un numero de telefono")
      .min(8, "Minimo 8 caracteres")
      .max(20, "Maximo 20 caracteres")
      .required(),
    birthYear: yup.number().min(1950).max(2022).nullable(),
    birthMonth: yup.number().min(1).max(12).nullable(),
    birthDay: yup.number().min(1).max(31).nullable(),
    sports: yup.lazy((value) =>
      typeof value === "string" ? yup.string() : yup.array().of(yup.string())
    ),
    injuries: yup.string(),
  })
);

export async function loader({ request }) {
  const { user } = await requireAuth(request);
  const userData = await getUserData(user.uid);

  const data = { data: userData };

  return json(data, {});
}

export const action = async ({ request }) => {
  const { uid } = await requireAuth(request);
  const { data, error } = await validator.validate(await request.formData());
  if (error) {
    return validationError(error);
  }
  const dob = new Date(`${data.birthMonth}/${data.birthDay}/${data.birthYear}`);
  await editUserData(uid, {
    name: data.name,
    dob,
    phoneNumber: data.phoneNumber,
    sports: data.sports,
    injuries: data.injuries,
  });
  return null;
};

const years = [];
for (let i = 2022; i > 1950; i--) {
  years.push({ value: i, label: i });
}

const months = [
  { value: "1", label: "1", days: 31 },
  { value: "2", label: "2", days: 28 },
  { value: "3", label: "3", days: 31 },
  { value: "4", label: "4", days: 30 },
  { value: "5", label: "5", days: 31 },
  { value: "6", label: "6", days: 30 },
  { value: "7", label: "7", days: 31 },
  { value: "8", label: "8", days: 31 },
  { value: "9", label: "9", days: 30 },
  { value: "10", label: "10", days: 31 },
  { value: "11", label: "11", days: 30 },
  { value: "12", label: "12", days: 31 },
];

const sports = [
  { value: "Futbol", label: "Futbol" },
  { value: "Tenis", label: "Tenis" },
  { value: "Danza", label: "Danza" },
  { value: "Running", label: "Running" },
  { value: "Yoga", label: "Yoga" },
];

const profile = () => {
  const { data } = useLoaderData();
  const error = useActionData();
  const monthFromDb = new Date(data?.dob?._seconds * 1000).getMonth() + 1;
  const yearFromDb = new Date(data?.dob?._seconds * 1000).getFullYear();
  const dayFromDb = new Date(data?.dob?._seconds * 1000).getDate();
  const [month, setMonth] = useState(
    { value: monthFromDb, label: monthFromDb } || { value: "", label: "Mes" }
  );
  const [day, setDay] = useState(
    { value: dayFromDb, label: dayFromDb } || { value: "", label: "Dia" }
  );

  const sportsFromDb = Array.isArray(data.sports)
    ? data.sports.map((sport) => {
        return { value: sport, label: sport };
      })
    : { value: data.sports, label: data.sports };

  const days = [];
  useEffect(() => {
    for (let i = 1; i <= month.days; i++) {
      days.push({ value: i, label: i });
    }
    if (!month.value) {
      setDay({ value: "", label: "Dia" });
    }
  }, [month]);

  return (
    <div>
      <Card>
        <CardHeader>Mi Perfil</CardHeader>
        <Form method="post">
          <div className="space-y-4">
            <Input
              placeholder="Nombre"
              name="name"
              required
              initialValue={data.name}
              error={error}
            />
            <Input
              placeholder="Numero de telefono"
              name="phoneNumber"
              required
              initialValue={data.phoneNumber}
              error={error}
            />
          </div>
          <div className="relative flex gap-3 py-2 mt-8">
            <span className="absolute left-0 -top-3.5 text-gray-600 text-sm">
              Fecha de Nacimiento
            </span>
            <Select
              options={years}
              name="birthYear"
              placeholder="Año"
              defaultValue={{ value: yearFromDb, label: yearFromDb }}
              instanceId="birth-year-select"
              inputId="birth-year-select"
              id="birth-year-select"
            />
            <Select
              options={months}
              value={month}
              name="birthMonth"
              placeholder="Mes"
              onChange={(e) => setMonth(e)}
              instanceId="birth-month-select"
              inputId="birth-month-select"
              id="birth-month-select"
            />
            <Select
              options={days}
              value={day}
              name="birthDay"
              placeholder="Dia"
              isDisabled={!month.value}
              onChange={(e) => setDay(e)}
              instanceId="birth-day-select"
              inputId="birth-day-select"
              id="birth-day-select"
            />
          </div>
          <div className="relative py-2 mt-4 mb-4">
            <span className="absolute left-0 -top-3.5 text-gray-600 text-sm">
              Deportes
            </span>
            <Select
              options={sports}
              isMulti
              isSearchable
              name="sports"
              placeholder="Actividades que practicas"
              defaultValue={sportsFromDb}
              instanceId="sports-select"
              inputId="sports-select"
              id="sports-select"
            />
          </div>
          <div className="relative space-y-4">
            <label
              htmlFor="injuries"
              className="absolute left-0 -top-3.5 text-gray-600 text-sm"
            >
              Lesiones
            </label>
            <textarea
              className="w-full h-20 text-gray-900 border-b-2 border-gray-300 peer focus:outline-none focus:border-indigo-600"
              name="injuries"
              id="injuries"
              placeholder="Ingresa lesiones recientes que hayas tenido"
            ></textarea>
          </div>
          <SubmitButton buttonText="Guardar" submittingText="Guardando..." />
        </Form>
      </Card>
    </div>
  );
};

export default profile;
