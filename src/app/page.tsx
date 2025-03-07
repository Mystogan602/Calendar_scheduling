import Navbar from "./components/Navbar";
import { redirect } from "next/navigation";
import { getSession } from "@/app/lib/session";

export default async function Home() {
  const session = await getSession();
  if (session) {
    return redirect("/dashboard");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Navbar />
    </div>
  );
}
