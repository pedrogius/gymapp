import Card from "../components/Card";
import ValidatedInput from "../components/ValidatedInput";
import SubmitButton from "../components/SubmitButton";
import { getSession, commitSession } from "~/session";
import { redirect, json } from "remix";
import { withYup } from "@remix-validated-form/with-yup";
import * as yup from "yup";
import { ValidatedForm, validationError } from "remix-validated-form";
import CardHeader from "~/components/CardHeader";
import { checkSessionCookie, requireAuth } from "~/utils/auth.server";

export const validator = withYup(
  yup.object({
    email: yup
      .string()
      .email("El email no es valido")
      .required("Ingresa un email"),
  })
);

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const { uid } = await checkSessionCookie(session);
  if (uid) redirect("/");

  return null;
}

export let action = async ({ request }) => {
  const data = validator.validate(await request.formData());
  if (data.error) return validationError(data.error);
  return redirect("/", {});
};

const forgotpassword = () => {
  return (
    <Card>
      <CardHeader className="text-center">Password Reset</CardHeader>
      <p className="mt-3 text-center">
        Ingresa tu direccion de email para resetearla
      </p>
      <ValidatedForm validator={validator} className="space-y-4">
        <ValidatedInput id="email" placeholder="Email" name="email" />
        <SubmitButton color="indigo" buttonText="Send Email" />
      </ValidatedForm>
    </Card>
  );
};

export default forgotpassword;
