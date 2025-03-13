"use server";

import { revalidatePath } from "next/cache";
import prisma from "./lib/db";
import { requireUser } from "./lib/hooks";
import {
  eventTypeSchema,
  onboardingSchema,
  settingSchema,
} from "./lib/zodSchemas";
import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";
import { nylas } from "./lib/nylas";
import { getSession } from "./lib/session";
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

export async function createEventTypeAction(
  lastResult: any,
  formData: FormData
) {
  const session = await requireUser();

  const submission = await parseWithZod(formData, {
    schema: eventTypeSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const data = await prisma.eventType.create({
    data: {
      title: submission.value.title,
      duration: submission.value.duration,
      url: submission.value.url,
      description: submission.value.description,
      videoCallSoftware: submission.value.videoCallSoftware,
      userId: session.userId,
    },
  });

  return redirect("/dashboard");
}

export async function createMeetingAction(formData: FormData) {
  const session = await requireUser();

  const getUserData = await prisma.user.findUnique({
    where: {
      userName: formData.get("username") as string,
    },
    select: {
      grantEmail: true,
      grantId: true,
    },
  });

  if (!getUserData) {
    throw new Error("User not found");
  }

  const eventData = await prisma.eventType.findUnique({
    where: {
      id: formData.get("eventId") as string,
    },
    select: {
      title: true,
      description: true,
    },
  });

  if (!eventData) {
    throw new Error("Event not found");
  }

  const formTime = formData.get("time") as string;
  const eventDate = formData.get("date") as string;
  const duration = Number(formData.get("duration"));
  const provider = formData.get("provider") as string;

  const startDateTime = new Date(`${eventDate}T${formTime}:00`);
  const endDateTime = new Date(startDateTime.getTime() + duration * 60000);

  await nylas.events.create({
    identifier: getUserData?.grantId as string,
    requestBody: {
      title: eventData?.title,
      description: eventData?.description,
      when: {
        startTime: Math.floor(startDateTime.getTime() / 1000),
        endTime: Math.floor(endDateTime.getTime() / 1000),
      },
      conferencing: {
        autocreate: {},
        provider: provider as any,
      },
      participants: [
        {
          email: formData.get("email") as string,
          name: formData.get("name") as string,
          status: "yes",
        },
      ],
    },
    queryParams: {
      calendarId: getUserData?.grantEmail as string,
      notifyParticipants: true,
    },
  });

  return redirect("/success");
}

export async function cancelMeetingAction(formData: FormData) {
  const session = await requireUser();

  const userData = await prisma.user.findUnique({
    where: {
      id: session?.userId,
    },
    select: {
      grantId: true,
      grantEmail: true,
    },
  });

  if (!userData) {
    throw new Error("User not found");
  }

  const eventData = await nylas.events.destroy({
    eventId: formData.get("eventId") as string,
    identifier: userData?.grantId as string,
    queryParams: {
      calendarId: userData?.grantEmail as string,
    },
  });

  revalidatePath("/dashboard/meetings");
}

export async function updateEventTypeAction(
  lastResult: any,
  formData: FormData
) {
  const session = await requireUser();

  const submission = await parseWithZod(formData, {
    schema: eventTypeSchema,
    // ({
    //   async isUrlUnique() {
    //     const url = formData.get("url") as string;
    //     const eventType = await prisma.eventType.findFirst({
    //       where: { url, userId: session.userId },
    //     });
    //     return !eventType;
    //   },
    // }),
    // async: true,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const data = await prisma.eventType.update({
    where: { id: formData.get("id") as string, userId: session.userId },
    data: {
      title: submission.value.title,
      duration: submission.value.duration,
      url: submission.value.url,
      description: submission.value.description,
      videoCallSoftware: submission.value.videoCallSoftware,
    },
  });

  return redirect("/dashboard");
}
