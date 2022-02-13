import { Form, json, redirect, useLoaderData } from "remix";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import SubmitButton from "~/components/SubmitButton";
import { commitSession, destroySession, getSession } from "~/sessions.server";
import { auth } from "~/utils/firebase";

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  if (session.has("access_token")) {
    const data = { user: auth.currentUser, error: session.get("error") };
    return json(data, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } else {
    return null;
  }
}

export let action = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));

  if (session.has("access_token")) {
    auth.signOut();
    return redirect("/", {
      headers: { "Set-Cookie": await destroySession(session) },
    });
  }

  return redirect("/");
};

export default function Index() {
  const data = useLoaderData();
  const isLoggedIn = data?.user;
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <Card>
        <CardHeader>POWERCLASS</CardHeader>
      </Card>
      {isLoggedIn ? (
        <Form method="post">
          <SubmitButton color="indigo" buttonText="Log Out" />
        </Form>
      ) : null}
    </div>
  );
}
