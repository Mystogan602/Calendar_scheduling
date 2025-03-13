import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { deleteEventTypeAction } from "@/app/actions";
import { SubmitButton } from "@/app/components/SubmitButtons";

export default function DeleteEventTypePage({
  params,
}: {
  params: { eventTypeId: string };
}) {
  return (
    <div className="flex flex-1 items-center justify-center">
      <Card className="w-full max-w-[450px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Delete Event Type
          </CardTitle>
          <CardDescription>
            Are you sure you want to delete this event type? This action cannot
            be undone.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-between w-full">
          <Button variant="secondary" asChild>
            <Link href={`/dashboard`}>Cancel</Link>
          </Button>
          <form action={deleteEventTypeAction}>
            <input type="hidden" name="id" value={params.eventTypeId} />
            <SubmitButton variant="destructive" text="Delete" />
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
