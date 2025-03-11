"use client";

import Calendar from "./Calendar";
import {
  today,
  getLocalTimeZone,
  CalendarDate,
  DateValue,
  parseDate,
} from "@internationalized/date";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface RenderCalendarProps {
  availableDays: {
    date: string;
    isAvailable: boolean;
  }[];
}

export default function RenderCalendar({ availableDays }: RenderCalendarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [date, setDate] = useState<CalendarDate>(() => {
    const date = searchParams.get("date");
    if (!date) {
      return today(getLocalTimeZone());
    }
    return parseDate(date);
  });

  useEffect(() => {
    const date = searchParams.get("date");
    if (!date) {
      return;
    }
    setDate(parseDate(date));
  }, [searchParams]);

  const handleDateChange = (date: DateValue) => {
    setDate(date as CalendarDate);
    const url = new URL(window.location.href);
    url.searchParams.set("date", date.toString());
    router.push(url.toString());
  };

  const isDateUnavailable = (date: DateValue) => {
    const dayOfWeek = date.toDate(getLocalTimeZone()).getDay();

    const adjustedIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    return !availableDays[adjustedIndex].isAvailable;
  };
  return (
    <Calendar
      minValue={today(getLocalTimeZone())}
      defaultValue={today(getLocalTimeZone())}
      value={date}
      onChange={handleDateChange}
      isDateUnavailable={isDateUnavailable}
    />
  );
}
