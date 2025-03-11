import { CalendarState } from "@react-stately/calendar";
import { Button } from "@/components/ui/button";
import {
  useButton,
  useFocusRing,
  mergeProps,
  AriaButtonProps,
} from "react-aria";
import { useRef } from "react";
export default function CalendarButton(
  props: AriaButtonProps<"button"> & {
    state?: CalendarState;
    side?: "left" | "right";
  }
) {
  const ref = useRef<HTMLButtonElement>(null);
  const { buttonProps } = useButton(props, ref);
  const { focusProps } = useFocusRing();
  return (
    <Button
      variant="outline"
      size="icon"
      {...mergeProps(buttonProps, focusProps)}
      ref={ref}
      disabled={props.isDisabled}
    >
      {props.children}
    </Button>
  );
}
