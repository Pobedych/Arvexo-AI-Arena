import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminClient from "./AdminClient";

type CurrentUser = {
  role: string;
};

async function getCurrentUser(): Promise<CurrentUser | null> {
  const backendUrl = (process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000").replace(/\/$/, "");
  const cookieHeader = (await cookies()).toString();
  const response = await fetch(`${backendUrl}/auth/me`, {
    headers: {
      cookie: cookieHeader,
    },
    cache: "no-store",
  });

  if (response.status === 401) return null;
  if (!response.ok) return null;
  return response.json() as Promise<CurrentUser>;
}

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?reason=expired");
  }

  if (user.role !== "admin") {
    redirect("/403");
  }

  return <AdminClient />;
}
