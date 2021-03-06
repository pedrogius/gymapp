import {
  json,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
} from "remix";
import { getSession } from "./session";
import Navbar from "./components/Navbar";
import styles from "./tailwind.css";
import Card from "./components/Card";
import { checkSessionCookie, requireAuth } from "./utils/auth.server";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}
export function meta() {
  return { title: "New Remix App" };
}

export async function loader({ request }) {
  const session = await getSession(request.headers.get("cookie"));
  const { uid } = await checkSessionCookie(session);
  if (!uid) {
    return false;
  } else {
    return true;
  }
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Layout>
          <Outlet />
        </Layout>
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}

function Layout({ children }) {
  const user = useLoaderData();

  return (
    <div className="flex flex-col h-screen font-Lato text-slate-700">
      <div className="flex items-start justify-center flex-grow bg-hero-color bg-hero">
        {children}
      </div>
      <Navbar user={user} />
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  console.log(caught);
  const message = caught.data?.message;

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="flex flex-col h-screen font-Lato text-slate-700">
          <div className="flex items-start justify-center flex-grow bg-hero-color bg-hero">
            <div>
              <Card>
                ERROR: {caught.statusText} {caught.status}
              </Card>
              {message && <Card>{message}</Card>}
            </div>
          </div>
          <Navbar user={true} />
        </div>
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}
