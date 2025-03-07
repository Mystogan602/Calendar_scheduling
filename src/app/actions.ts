"use server";

import { revalidatePath } from "next/cache";
import prisma from "./lib/db";
import { requireUser } from "./lib/hooks";
import { onboardingSchema, settingSchema } from "./lib/zodSchemas";
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
      id: session.userId,
    },
    data: {
      name: submission.value.fullName,
      userName: submission.value.userName,
      availability: {
        createMany: {
          data: [
            {
              day: "Monday",
              fromTime: "08:00",
              toTime: "18:00",
            },
            {
              day: "Tuesday",
              fromTime: "08:00",
              toTime: "18:00",
            },
            {
              day: "Wednesday",
              fromTime: "08:00",
              toTime: "18:00",
            },
            {
              day: "Thursday",
              fromTime: "08:00",
              toTime: "18:00",
            },
            {
              day: "Friday",
              fromTime: "08:00",
              toTime: "18:00",
            },
            {
              day: "Saturday",
              fromTime: "08:00",
              toTime: "18:00",
            },
            {
              day: "Sunday",
              fromTime: "08:00",
              toTime: "18:00",
            },
          ],
        },
      },
    },
  });

  return redirect("/onboarding/grant-id");
}

export async function settingAction(lastResult: any, formData: FormData) {
  const session = await requireUser();

  const submission = await parseWithZod(formData, {
    schema: settingSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const data = await prisma.user.update({
    where: { id: session.userId },
    data: {
      name: submission.value.fullName,
      image: submission.value.profileImage,
    },
  });

  return redirect("/dashboard");
}

export async function updateAvailabilityAction(formData: FormData) {
  try {
    const session = await requireUser();

    const rawAvailability = Object.fromEntries(formData.entries());

    const availabilityData = Object.keys(rawAvailability)
      .filter((key) => key.startsWith("id-"))
      .map((key) => {
        const id = key.replace("id-", "");
        return {
          id,
          isAvailable: rawAvailability[`availability-${id}`] === "on",
          fromTime: rawAvailability[`fromTime-${id}`] as string,
          toTime: rawAvailability[`toTime-${id}`] as string,
        };
      });

    await prisma.$transaction(
      availabilityData.map((item) =>
        prisma.availability.update({
          where: { id: item.id },
          data: {
            isAvailable: item.isAvailable,
            fromTime: item.fromTime,
            toTime: item.toTime,
          },
        })
      )
    );
    revalidatePath("/dashboard/availability");
    return;
  } catch (error) {
    throw error;
  }
}
