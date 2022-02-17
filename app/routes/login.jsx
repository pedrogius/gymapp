import { redirect, json, useActionData } from "remix";
import { withYup } from "@remix-validated-form/with-yup";
import * as yup from "yup";
import { getSession, commitSession } from "~/session";
import TrainerLogo from "../svg/trainer.svg";
import Card from "../components/Card";
import SubmitButton from "../components/SubmitButton";
import CustomLink from "../components/CustomLink";
import { ValidatedForm, validationError } from "remix-validated-form";
import CardHeader from "~/components/CardHeader";
import ValidatedInput from "~/components/ValidatedInput";
import { checkSessionCookie, signIn } from "~/utils/auth.server";

export const validator = withYup(
  yup.object({
    email: yup
      .string()
      .email("El email no es valido")
      .required("Ingresa un email"),
    password: yup
      .string()
      .min(6, "Minimo 6 caracteres")
      .max(20, "Maximo 20 caracteres")
      .required("Ingresa una contraseña"),
  })
);

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const { uid } = await checkSessionCookie(session);
  const headers = {
    "Set-Cookie": await commitSession(session),
  };
  if (uid) {
    return redirect("/", { headers });
  }
  return json(null, { headers });
}

export async function action({ request }) {
  const { data, error } = await validator.validate(await request.formData());
  if (error) return validationError(error);
  const { email, password } = data;

  let fields = { email, password };

  try {
    const sessionCookie = await signIn(email, password);
    const session = await getSession(request.headers.get("Cookie"));
    session.set("session", sessionCookie);
    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (e) {
    const err = e.message?.split("Error ")[1].slice(1, -2).split("/");
    if (err[0] === "auth") {
      return {
        fields,
        formError: "Email o contraseña incorrecta",
      };
    } else {
      return {
        fields,
        formError: "Algo salio mal",
      };
    }
  }
}

const LoginCard = () => {
  const actionData = useActionData();

  return (
    <Card>
      <img src={TrainerLogo} alt="logo" width="80%" className="mb-4" />
      <CardHeader>Ingresa a tu cuenta</CardHeader>
      <ValidatedForm validator={validator} className="space-y-4" method="post">
        <ValidatedInput placeholder="Email" name="email" />
        <ValidatedInput
          placeholder="Contraseña"
          name="password"
          type="password"
        />
        {actionData?.formError ? (
          <p className="text-sm text-red-700" role="alert" id="username-error">
            {actionData?.formError}
          </p>
        ) : null}
        <SubmitButton buttonText="Iniciar Sesion" />
      </ValidatedForm>
      <CustomLink to="/forgotpassword" linkText="Te olvidaste tu contraseña?" />
      <CustomLink to="/register" linkText="Crea tu cuenta" />
    </Card>
  );
};

export default LoginCard;
