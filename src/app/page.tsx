import { redirect } from "next/navigation";

export default function Home() {
  // We don't have a public lander, internally route users immediately to the dashboard or login guard
  redirect("/dashboard");
}
