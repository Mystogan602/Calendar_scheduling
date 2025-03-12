import prisma from "@/app/lib/db";
import { nylas } from "@/app/lib/nylas";
import { getSession } from "@/app/lib/session";
import EmptyState from "@/app/components/EmptyState";
import {
  Card,
  CardTitle,
  CardHeader,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { format, fromUnixTime } from "date-fns";
import { VideoIcon } from "lucide-react";
import { SubmitButton } from "@/app/components/SubmitButtons";
import { Separator } from "@/components/ui/separator";
import { cancelMeetingAction } from "@/app/actions";

async function getData(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      grantId: true,
      grantEmail: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const data = await nylas.events.list({
    identifier: user?.grantId as string,
    queryParams: {
      calendarId: user?.grantEmail as string,
    },
  });

  return data;
}

export default async function MeetingsPage() {
  const session = await getSession();
  const data = await getData(session?.user?.id as string);
  return (
    <>
      {data.data.length < 1 ? (
        <EmptyState
          title="No meetings found"
          description="You don't have any meetings yet"
          href="/dashboard/new"
          buttonText="Create a new event type"
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Meetings</CardTitle>
            <CardDescription>
              See upcoming and past events booked through your event type links
              below
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.data.map((meeting) => (
              <form key={meeting.id} action={cancelMeetingAction}>
                <input type="hidden" name="eventId" value={meeting.id} />
                <div className="grid grid-cols-3 justify-between items-center">
                  <div>
                    <p className="text-muted-foreground text-sm">
                      {format(
                        fromUnixTime(meeting.when.startTime),
                        "EEE, dd MMM"
                      )}
                    </p>
                    <p className="text-muted-foreground text-xs pt-1">
                      {format(fromUnixTime(meeting.when.startTime), "hh:mm a")}{" "}
                      - {format(fromUnixTime(meeting.when.endTime), "hh:mm a")}
                    </p>
                    <div className="flex items-center mt-2">
                      <VideoIcon className="size-4 mr-2 text-primary" />{" "}
                      <a
                        href={meeting.conferencing.details.url}
                        target="_blank"
                        className="text-primary text-xs underline underline-offset-4"
                      >
                        Join Meeting
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-col items-start">
                    <h2 className="font-medium text-sm">{meeting.title}</h2>
                    <p className="text-muted-foreground text-sm">
                      You are meeting with{" "}
                      {meeting.participants
                        .map((participant) => participant.name)
                        .join(", ")}
                    </p>
                  </div>

                  <SubmitButton
                    variant="destructive"
                    text="Cancel Event"
                    className="w-fit flex ml-auto"
                  />
                </div>
                <Separator className="my-3" />
              </form>
            ))}
          </CardContent>
        </Card>
      )}
    </>
  );
}
