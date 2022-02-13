import { auth } from "~/utils/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { redirect, json, useActionData } from "remix";
import { withYup } from "@remix-validated-form/with-yup";
import * as yup from "yup";
import { getSession, commitSession } from "~/sessions.server";
import TrainerLogo from "../svg/trainer.svg";
import Card from "../components/Card";
import SubmitButton from "../components/SubmitButton";
import CustomLink from "../components/CustomLink";
import { ValidatedForm, validationError } from "remix-validated-form";
import CardHeader from "~/components/CardHeader";
import ValidatedInput from "~/components/ValidatedInput";

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

  if (session.has("access_token")) {
    return redirect("/");
  }

  const data = { error: session.get("error") };

  return json(data, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

// our action function will be launched when the submit button is clicked
// this will sign in our firebase user and create our session and cookie using user.getIDToken()
export async function action({ request }) {
  const data = await validator.validate(await request.formData());
  if (data.error) return validationError(data.error);
  const { email, password } = data.data;

  let fields = { email, password };

  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    // if signin was successful then we have a user
    if (user) {
      // let's setup the session and cookie wth users idToken
      let session = await getSession(request.headers.get("Cookie"));
      session.set("access_token", await user.getIdToken());
      // let's send the user to the main page after login
      return redirect("/", {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    }
  } catch (e) {
    const err = e.message.split("Error ")[1].slice(1, -2).split("/");
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
