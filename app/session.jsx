import { createCookieSessionStorage } from "remix";

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "__session",
      expires: new Date(Date.now() + 600),
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7 * 2,
      path: "/",
      sameSite: "lax",
      secrets: ["funcional"],
    },
  });
