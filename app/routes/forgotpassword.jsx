import Card from "../components/Card";
import ValidatedInput from "../components/ValidatedInput";
import SubmitButton from "../components/SubmitButton";
import { getSession, commitSession } from "~/sessions.server";
import { redirect, json } from "remix";
import { withYup } from "@remix-validated-form/with-yup";
import * as yup from "yup";
import { ValidatedForm, validationError } from "remix-validated-form";
import CardHeader from "~/components/CardHeader";

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

  if (session.has("access_token")) {
    // Redirect to the home page if they are already signed in.
    return redirect("/");
  }

  const data = { error: session.get("error") };

  return json(data, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
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
