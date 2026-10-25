"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SESSION_COOKIE = "argus_session";

export async function signIn(formData: FormData) {
  const from = (formData.get("from") as string) || "/";

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "demo-operator", {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  redirect(from.startsWith("/") ? from : "/");
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect("/login");
}
