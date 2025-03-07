import { requireUser } from "@/app/lib/hooks";
import { NextRequest } from "next/server";
import { nylas } from "@/app/lib/nylas";
import { nylasConfig } from "@/app/lib/nylas";
import prisma from "@/app/lib/db";
import { redirect } from "next/navigation";

export async function GET(req: NextRequest) {
  const session = await requireUser();

  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  if (!code) {
    return new Response("No code provided", { status: 400 });
  }

  try {
    const token = await nylas.auth.exchangeCodeForToken({
      redirectUri: nylasConfig.redirectUri,
      code,
      clientId: nylasConfig.clientId,
      clientSecret: nylasConfig.apiKey,
    });

    const { grantId, email } = token;
    await prisma.user.update({
      where: { id: session.userId },
      data: { grantId: grantId, grantEmail: email },
    });
  } catch (error) {
    console.error(error);
    return new Response("Failed to exchange code for token", { status: 500 });
  }

  return redirect("/dashboard");
}
