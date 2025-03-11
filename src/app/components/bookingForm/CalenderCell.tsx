import { useCalendarCell, useFocusRing, mergeProps } from "react-aria";
import { CalendarState } from "@react-stately/calendar";
import { useRef } from "react";
import {
  CalendarDate,
  isToday,
  getLocalTimeZone,
  isSameMonth,
} from "@internationalized/date";
import { cn } from "@/lib/utils";
export default function CalenderCell({
  state,
  date,
  currentMonth,
  isUnavailable,
}: {
  state: CalendarState;
  date: CalendarDate;
  currentMonth: CalendarDate;
  isUnavailable?: boolean;
}) {
  let ref = useRef<HTMLDivElement>(null);
  let {
    cellProps,
    buttonProps,
    isSelected,
    isDisabled,
    formattedDate,
  } = useCalendarCell({ date }, state, ref);

  const finalIsDisabled = isDisabled || isUnavailable;

  const { focusProps, isFocusVisible } = useFocusRing();

  const isOutsideMonth = !isSameMonth(date, currentMonth);

  const isDateToday = isToday(date, getLocalTimeZone());
  return (
    <td
      {...cellProps}
      className={`py-0.5 px-0.5 relative ${isFocusVisible ? "z-10" : "z-0"}`}
    >
      <div
        {...mergeProps(buttonProps, focusProps)}
        ref={ref}
        hidden={isOutsideMonth}
        className="size-10 sm:size-12 rounded-md outline-none group"
      >
        <div
          className={cn(
            "size-full rounded-sm flex items-center justify-center text-sm font-semibold cursor-pointer",
            isSelected && "bg-primary text-white",
            finalIsDisabled && "text-muted-foreground cursor-not-allowed",
            isFocusVisible && "group-focus:z-2 ring-12 ring-offset-1",
            !isSelected && !finalIsDisabled && "hover:bg-blue-500/10 bg-secondary"
          )}
        >
          {formattedDate}
          {isDateToday && (
            <div
              className={cn(
                "absolute bottom-3 left-1/2 -translate-x-1/2 translate-y-1/2 transform size-1.5 rounded-full bg-primary",
                isSelected && "bg-white"
              )}
            />
          )}
        </div>
      </div>
    </td>
  );
}
