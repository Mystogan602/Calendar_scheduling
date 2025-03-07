import { getSession } from "@/app/lib/session"
import { redirect } from "next/navigation"

export async function requireUser() {
    const session = await getSession();
    if (!session?.user) {
        redirect("/")
    }
    return session
}