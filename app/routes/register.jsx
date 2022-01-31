import { ValidatedForm, validationError } from "remix-validated-form";
import SubmitButton from "~/components/SubmitButton";
import * as yup from "yup";
import { withYup } from "@remix-validated-form/with-yup";
import Card from "~/components/Card";
import TrainerLogo from "../svg/trainer.svg";
import { commitSession, getSession } from "~/sessions.server";
import { json, redirect, useActionData } from "remix";
import { auth, db } from "~/utils/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import CustomLink from "~/components/CustomLink";
import CardHeader from "~/components/CardHeader";
import { doc, setDoc, Timestamp } from "firebase/firestore";
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
    confirmPassword: yup
      .string()
      .required("Confirma la contraseña")
      .oneOf([yup.ref("password"), null], "Las contraseñas no coinciden"),
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
  const { data, error } = validator.validate(await request.formData());
  if (error) return validationError(error);
  const { email, password } = data;

  //perform a signout to clear any active sessions
  await auth.signOut();

  //setup user data
  try {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const docRef = doc(db, "users", user.uid);
    await setDoc(docRef, {
      email,
      isAdmin: false,
      created: Timestamp.now(),
    });
    const session = await getSession(request.headers.get("Cookie"));
    session.set("access_token", auth.currentUser.access_token);
    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error) {
    return { signUpError: error.code };
  }
};

const register = () => {
  const actionData = useActionData();

  const message = () => {
    switch (actionData?.signUpError) {
      case "auth/invalid-email":
        return "La direccion de email no es valida";
      case "auth/email-already-in-use":
        return "Ya existe una cuenta con ese email";
      default:
        return "Algo salio mal";
    }
  };
  return (
    <Card>
      <img src={TrainerLogo} alt="logo" width="80%" className="mb-4" />
      <CardHeader>Registro</CardHeader>
      <ValidatedForm
        validator={validator}
        className="space-y-4"
        method="post"
        onSubmit={(data) => console.log(data)}
      >
        <ValidatedInput placeholder="Email" name="email" />
        {actionData?.signUpError ? (
          <p className="text-xs text-red-700" role="alert" id="username-error">
            {message()}
          </p>
        ) : null}
        <ValidatedInput
          type="password"
          placeholder="Contraseña"
          name="password"
        />
        <ValidatedInput
          type="password"
          placeholder="Confirma la contraseña"
          name="confirmPassword"
        />
        <SubmitButton
          buttonText="Crear Cuenta"
          submittingText="Creando Cuenta..."
        />
      </ValidatedForm>
      <CustomLink to="/login" linkText="Ya tenes una cuenta?" />
    </Card>
  );
};

export default register;
