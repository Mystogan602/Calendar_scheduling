import prisma from "@/app/lib/db";
import {
  addMinutes,
  format,
  fromUnixTime,
  isAfter,
  isBefore,
  parse,
} from "date-fns";
import { Prisma } from "@prisma/client";
import { nylas } from "@/app/lib/nylas";
import { NylasResponse, GetFreeBusyResponse } from "nylas";
import Link from "next/link";
import { Button } from "@/components/ui/button";
interface TimeTableProps {
  selectedDate: Date;
  username: string;
  meetingDuration: number;
}

interface NylasTimeSlot {
  object: "time_slot";
  status: "busy";
  startTime: number;
  endTime: number;
}

interface FreeBusyResponse {
  email: string;
  object: "free_busy";
  timeSlots: NylasTimeSlot[];
}

async function getData(selectedDate: Date, username: string) {
  const currentDate = format(selectedDate, "EEEE");
  const startOfDay = new Date(selectedDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(selectedDate);
  endOfDay.setHours(23, 59, 59, 999);

  const data = await prisma.availability.findFirst({
    where: {
      day: currentDate as Prisma.EnumDayFilter,
      user: {
        userName: username,
      },
    },
    select: {
      fromTime: true,
      toTime: true,
      id: true,
      user: {
        select: {
          grantEmail: true,
          grantId: true,
        },
      },
    },
  });

  const nylasCalendarData = await nylas.calendars.getFreeBusy({
    identifier: data?.user.grantId as string,
    requestBody: {
      startTime: Math.floor(startOfDay.getTime() / 1000),
      endTime: Math.floor(endOfDay.getTime() / 1000),
      emails: [data?.user.grantEmail as string],
    },
  });

  return { data, nylasCalendarData };
}

function calculateAvailableTimes(
  dataAvailability: {
    fromTime: string | undefined;
    toTime: string | undefined;
  },
  date: string,
  nylasCalendarData: NylasResponse<GetFreeBusyResponse[]>,
  duration: number
) {
  const now = new Date();

  const availableFrom = parse(
    `${date} ${dataAvailability.fromTime}`,
    "yyyy-MM-dd HH:mm",
    new Date()
  );
  const availableTo = parse(
    `${date} ${dataAvailability.toTime}`,
    "yyyy-MM-dd HH:mm",
    new Date()
  );

  const freeBusyData = nylasCalendarData.data[0] as FreeBusyResponse;
  const busySlots = freeBusyData.timeSlots.map((slot: NylasTimeSlot) => {
    return {
      start: fromUnixTime(slot.startTime),
      end: fromUnixTime(slot.endTime),
    };
  });

  const allSlots = [];
  let currentSlot = availableFrom;
  while (isBefore(currentSlot, availableTo)) {
    allSlots.push(currentSlot);
    currentSlot = addMinutes(currentSlot, duration);
  }

  const availableSlots = allSlots.filter((slot) => {
    const slotEnd = addMinutes(slot, duration);

    return (
      isAfter(slot, now) &&
      !busySlots.some(
        (busy: { start: any; end: any }) =>
          (!isBefore(slot, busy.start) && isBefore(slot, busy.end)) ||
          (isAfter(slotEnd, busy.start) && !isAfter(slotEnd, busy.end)) ||
          (isBefore(slot, busy.start) && isAfter(slotEnd, busy.end))
      )
    );
  });

  return availableSlots.map((slot) => {
    return format(slot, "HH:mm");
  });
}

export default async function TimeTable({
  selectedDate,
  username,
  meetingDuration,
}: TimeTableProps) {
  const { data, nylasCalendarData } = await getData(selectedDate, username);

  const dbAvailability = {
    fromTime: data?.fromTime,
    toTime: data?.toTime,
  };

  const formattedDate = format(selectedDate, "yyyy-MM-dd");

  const availableSlots = calculateAvailableTimes(
    dbAvailability,
    formattedDate,
    nylasCalendarData,
    meetingDuration
  );
  
  return (
    <div>
      <p className="text-base font-semibold">
        {format(selectedDate, "EEE")}.{" "}
        <span className="text-sm text-muted-foreground">
          {format(selectedDate, "MMM. d")}
        </span>
      </p>
      <div className="mt-3 max-h-[350px] overflow-y-auto">
        {availableSlots.length > 0 ? (
          availableSlots.map((slot, index) => (
            <Link
              key={index}
              href={`?date=${formattedDate}&time=${slot}`}
            >
              <Button variant="outline" className="w-full mb-2">
                {slot}
              </Button>
            </Link>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            No available slots for this day
          </p>
        )}
      </div>
    </div>
  );
}
