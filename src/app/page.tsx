import Navbar from "./components/Navbar";
import { redirect } from "next/navigation";
import { getSession } from "@/app/lib/session";
import Hero from "./components/landing/Hero";
import Logos from "./components/landing/Logos";
import Features from "./components/landing/Features";
import Testimonial from "./components/landing/Testimonial";
import CTA from "./components/landing/CTA";

export default async function Home() {
  const session = await getSession();
  if (session) {
    return redirect("/dashboard");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Navbar />
      <Hero />
      <Logos />
      <Features />
      <Testimonial />
      <CTA />
    </div>
  );
}
