import {
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useState } from "react";
import { Form, json, redirect, useActionData, useLoaderData } from "remix";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import CustomSelect from "~/components/CustomSelect";
import DeleteButton from "~/components/DeleteButton";
import Input from "~/components/Input";
import PlacesAutocomplete from "~/components/PlacesAutocomplete";
import SubmitButton from "~/components/SubmitButton";
import Toggle from "~/components/Toggle";
import * as yup from "yup";
import { withYup } from "@remix-validated-form/with-yup";
import { validationError } from "remix-validated-form";
import { deleteClass, getClass, updateClass } from "~/utils/db.server";
import { requireAuth } from "~/utils/auth.server";

yup.setLocale({
  mixed: {
    default: "No es valido",
    required: "Campo requerido",
  },
});

export const validator = withYup(
  yup.object({
    name: yup.string().required(),
    days: yup.lazy((value) =>
      typeof value === "string"
        ? yup.string().required()
        : yup.array().of(yup.string()).required()
    ),
    hour: yup.number().required().min(7).max(24),
    minute: yup.number().required().oneOf([0, 15, 30, 45]),
    remote: yup.string().oneOf(["on", "off"]),
    description: yup.string(),
    location: yup.string(),
  })
);

export async function action({ request, params }) {
  const body = await request.formData();
  const method = body.get("_method");
  if (method === "delete") {
    try {
      await deleteClass(params.classId);
      return redirect("/classes");
    } catch (e) {
      console.log(e);
    }
  } else {
    const { data, error } = await validator.validate(body);
    if (error) return validationError(error);
    try {
      await updateClass(data, params.classId);
    } catch (e) {
      console.log(e);
    }
  }
  return redirect("/classes");
}

export async function loader({ request, params }) {
  const { user, isAdmin } = await requireAuth(request, { getIsAdmin: true });
  if (!isAdmin) return redirect("/login");

  const classData = await getClass(params.classId);

  const data = {
    user,
    apiKey: process.env.PLACES_API_KEY,
    classData,
  };

  return json(data, {});
}

const days = [
  { label: "Domingo", value: 0 },
  { label: "Lunes", value: 1 },
  { label: "Martes", value: 2 },
  { label: "Miercoles", value: 3 },
  { label: "Jueves", value: 4 },
  { label: "Viernes", value: 5 },
  { label: "Sabado", value: 6 },
];

const hours = Array.from(Array(17)).map((_, idx) => {
  return { value: idx + 7, label: idx + 7 };
});

const minutes = [
  { value: 0, label: 0 },
  { value: 15, label: 15 },
  { value: 30, label: 30 },
  { value: 45, label: 45 },
];

const edit = () => {
  const { classData } = useLoaderData();
  const error = useActionData();
  const [checked, setChecked] = useState(classData.remote === "on");
  const initialDays = days.filter((day) =>
    classData.days.includes(day.value.toString())
  );

  const onToggleChange = () => {
    setChecked(!checked);
  };
  return (
    <Card>
      <CardHeader>Editar Clase</CardHeader>
      <div>
        <Form method="post" className="space-y-4">
          <Input
            name="name"
            placeholder="Nombre"
            error={error}
            initialValue={classData?.name}
          />
          <div className="relative py-2 mt-4 mb-4">
            <span className="absolute left-0 -top-3.5 text-gray-600 text-sm">
              Dias
            </span>
            <CustomSelect
              options={days}
              error={error}
              defaultValue={initialDays}
              isMulti
              name="days"
              instanceId="day-select"
              placeholder="Elegir dias..."
            />
          </div>

          <div className="relative flex gap-3 py-2 mt-8">
            <span className="absolute left-0 -top-3.5 text-gray-600 text-sm">
              Horario
            </span>
            <CustomSelect
              options={hours}
              error={error}
              defaultValue={{ label: classData?.hour, value: classData?.hour }}
              name="hour"
              instanceId="hour-select"
              placeholder="Hora"
            />
            <CustomSelect
              options={minutes}
              error={error}
              defaultValue={{
                label: classData?.minute,
                value: classData?.minute,
              }}
              name="minute"
              instanceId="minute-select"
              placeholder="Minutos"
            />
          </div>
          <div className="relative space-y-4">
            <label
              htmlFor="description"
              className="absolute left-0 -top-3.5 text-gray-600 text-sm"
            >
              Descripcion
            </label>
            <textarea
              className="w-full h-20 text-gray-900 border-b-2 border-gray-300 peer focus:outline-none focus:border-indigo-600"
              name="description"
              id="description"
              placeholder="Descripcion de la clase..."
              defaultValue={classData.description}
            ></textarea>
          </div>
          <Toggle checked={checked} onChange={onToggleChange}>
            Remoto
          </Toggle>
          <PlacesAutocomplete
            disabled={checked}
            id={classData.location}
            locationName={classData.locationName}
          />
          <SubmitButton
            buttonText="Editar Clase"
            submittingText="Editando Clase..."
          />
        </Form>
        <Form method="post" className="mt-4">
          <input type="hidden" name="_method" value="delete" />
          <DeleteButton
            buttonText="Eliminar Clase"
            submittingText="Eliminando Clase..."
          />
        </Form>
      </div>
    </Card>
  );
};

export default edit;
