import { Form, json, redirect, useLoaderData } from "remix";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import SubmitButton from "~/components/SubmitButton";
import { commitSession, destroySession, getSession } from "~/session";
import { checkSessionCookie } from "~/utils/auth.server";

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const { uid } = await checkSessionCookie(session);
  const headers = {
    "Set-Cookie": await commitSession(session),
  };
  return json(uid || null, { headers });
}

export let action = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));

  return redirect("/login", {
    headers: { "Set-Cookie": await destroySession(session) },
  });
};

export default function Index() {
  const data = useLoaderData();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <Card>
        <CardHeader>POWERCLASS</CardHeader>
      </Card>
      {data ? (
        <Form method="post">
          <SubmitButton color="indigo" buttonText="Log Out" />
        </Form>
      ) : null}
    </div>
  );
}
