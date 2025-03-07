import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { notFound } from "next/navigation";
import prisma from "@/app/lib/db";
import { requireUser } from "@/app/lib/hooks";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import { times } from "@/app/lib/times";
import { SubmitButton } from "@/app/components/SubmitButtons";
import { updateAvailabilityAction } from "@/app/actions";

async function getData(userId: string) {
  const availability = await prisma.availability.findMany({
    where: {
      userId: userId,
    },
  });

  if (!availability) {
    return notFound();
  }

  return availability;
}

export default async function AvailabilityPage() {
  const session = await requireUser();
  const availability = await getData(session.userId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Availability</CardTitle>
        <CardDescription>
          Manage your availability and schedule.
        </CardDescription>
      </CardHeader>
      <form action={updateAvailabilityAction}>
        <CardContent className="flex flex-col gap-y-4">
          {availability.map((availability) => (
            <div
              key={availability.id}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-center gap-4"
            >
              <input type="hidden" name={`id-${availability.id}`} value={availability.id} />
              <div className="flex items-center gap-x-3">
                <Switch
                  name={`availability-${availability.id}`}
                  defaultChecked={availability.isAvailable}
                />
                <p className="text-sm font-medium">{availability.day}</p>
              </div>
              <Select defaultValue={availability.fromTime} name={`fromTime-${availability.id}`}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a from time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {times.map((time) => (
                      <SelectItem key={time.id} value={time.time}>
                        {time.time}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select defaultValue={availability.toTime} name={`toTime-${availability.id}`}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a to time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {times.map((time) => (
                      <SelectItem key={time.id} value={time.time}>
                        {time.time}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          ))}
        </CardContent>
        <CardFooter className="mt-6">
          <SubmitButton text="Save changes" />
        </CardFooter>
      </form>
    </Card>
  );
}
