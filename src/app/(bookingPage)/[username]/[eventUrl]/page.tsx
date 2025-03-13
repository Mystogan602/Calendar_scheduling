import prisma from "@/app/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { notFound } from "next/navigation";
import Image from "next/image";
import { CalendarX2, Video, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import RenderCalendar from "@/app/components/bookingForm/RenderCalendar";
import TimeTable from "@/app/components/bookingForm/TimeTable";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/app/components/SubmitButtons";
import { createMeetingAction } from "@/app/actions";
async function getData(username: string, eventUrl: string) {
  const event = await prisma.eventType.findFirst({
    where: {
      url: eventUrl,
      user: {
        userName: username,
      },
      active: true,
    },
    select: {
      id: true,
      description: true,
      title: true,
      duration: true,
      videoCallSoftware: true,
      user: {
        select: {
          name: true,
          image: true,
          availability: {
            select: {
              day: true,
              isAvailable: true,
            },
          },
        },
      },
    },
  });
  if (!event) {
    return notFound();
  }
  return event;
}

export default async function BookingPage({
  params,
  searchParams,
}: {
  params: { username: string; eventUrl: string };
  searchParams: { date?: string; time?: string };
}) {
  const { username, eventUrl } = await Promise.resolve(params);
  const { date, time } = await Promise.resolve(searchParams);
  const selectedDate = date ? new Date(date) : new Date();

  const event = await getData(username, eventUrl);

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(selectedDate);

  const showForm = !!date && !!time;

  return (
    <div className="min-h-screen w-screen flex items-center justify-center">
      {showForm ? (
        <Card className="max-w-[600px]">
          <CardContent className="p-5 md:grid md:grid-cols-[1fr_auto_1fr] gap-4">
            <div>
              <Image
                src={event.user.image as string}
                alt={`${event.user.name}'s profile picture`}
                width={30}
                height={30}
                className="rounded-full size-10"
              />
              <p className="text-sm font-medium text-muted-foreground mt-1">
                {event.user.name}
              </p>
              <h1 className="mt-2 text-xl font-semibold">{event.title}</h1>
              <p className="text-sm font-medium text-muted-foreground">
                {event.description}
              </p>

              <div className="mt-5 grid gap-y-3">
                <p className="flex items-center">
                  <CalendarX2 className="size-4 mr-2 text-primary" />
                  <span className="font-medium text-sm text-muted-foreground">
                    {formattedDate}
                  </span>
                </p>
                <p className="flex items-center">
                  <Clock className="size-4 mr-2 text-primary" />
                  <span className="font-medium text-sm text-muted-foreground">
                    {event.duration} minutes
                  </span>
                </p>
                <p className="flex items-center">
                  <Video className="size-4 mr-2 text-primary" />
                  <span className="font-medium text-sm text-muted-foreground">
                    {event.videoCallSoftware}
                  </span>
                </p>
              </div>
            </div>

            <Separator
              className="hidden md:block h-full w-px"
              orientation="vertical"
            />

            <form className="flex flex-col gap-y-4" action={createMeetingAction}>
              <input type="hidden" name="eventId" value={event.id} />
              <input type="hidden" name="date" value={date} />
              <input type="hidden" name="time" value={time} />
              <input type="hidden" name="username" value={username} />
              <input type="hidden" name="duration" value={event.duration} />
              <input type="hidden" name="provider" value={event.videoCallSoftware} />

              <div className="flex flex-col gap-y-2">
                <Label>Full Name</Label>
                <Input type="text" name="name" placeholder="John Doe" />
              </div>
              <div className="flex flex-col gap-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  name="email"
                  placeholder="john.doe@example.com"
                />
              </div>
              <SubmitButton className="w-full mt-5" text="Book meeting" />
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="max-w-[1000px] w-full mx-auto">
          <CardContent className="p-5 md:grid md:grid-cols-[1fr_auto_1fr_auto_1fr] gap-4">
            <div>
              <Image
                src={event.user.image as string}
                alt={`${event.user.name}'s profile picture`}
                width={30}
                height={30}
                className="rounded-full size-10"
              />
              <p className="text-sm font-medium text-muted-foreground mt-1">
                {event.user.name}
              </p>
              <h1 className="mt-2 text-xl font-semibold">{event.title}</h1>
              <p className="text-sm font-medium text-muted-foreground">
                {event.description}
              </p>

              <div className="mt-5 grid gap-y-3">
                <p className="flex items-center">
                  <CalendarX2 className="size-4 mr-2 text-primary" />
                  <span className="font-medium text-sm text-muted-foreground">
                    {formattedDate}
                  </span>
                </p>
                <p className="flex items-center">
                  <Clock className="size-4 mr-2 text-primary" />
                  <span className="font-medium text-sm text-muted-foreground">
                    {event.duration} minutes
                  </span>
                </p>
                <p className="flex items-center">
                  <Video className="size-4 mr-2 text-primary" />
                  <span className="font-medium text-sm text-muted-foreground">
                    {event.videoCallSoftware}
                  </span>
                </p>
              </div>
            </div>

            <Separator
              className="hidden md:block h-full w-px"
              orientation="vertical"
            />
            <div className="my-4 md:my-0">
              <RenderCalendar
                availableDays={event.user.availability.map((day) => ({
                  date: day.day,
                  isAvailable: day.isAvailable,
                }))}
              />
            </div>
            <Separator
              className="hidden md:block h-full w-px"
              orientation="vertical"
            />
            <TimeTable
              selectedDate={selectedDate}
              username={username}
              meetingDuration={event.duration}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
