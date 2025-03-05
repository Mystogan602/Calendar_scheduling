"use server";

import prisma from "./lib/db";
import { requireUser } from "./lib/hooks";
import { onboardingSchema } from "./lib/zodSchemas";
import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";

export async function onboardingAction(lastResult: any, formData: FormData) {
  const session = await requireUser();

  const submission = await parseWithZod(formData, {
    schema: onboardingSchema({
      isUserNameUnique: async () => {
        const user = await prisma.user.findUnique({
          where: {
            userName: formData.get("userName") as string,
          },
        });
        return !user;
      },
    }),

    async: true,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const data = await prisma.user.update({
    where: {
      id: session.user?.id,
    },
    data: {
      name: submission.value.fullName,
      userName: submission.value.userName,
    },
  });

  return redirect("/dashboard");
}
