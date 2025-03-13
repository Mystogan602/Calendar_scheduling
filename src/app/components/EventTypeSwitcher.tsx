"use client";

import { Switch } from "@/components/ui/switch";
import { useActionState, useEffect, useTransition } from "react";
import { toggleEventTypeAction } from "../actions";
import { toast } from "sonner";

export function EventTypeSwitcher({
  eventTypeId,
  initialChecked,
}: {
  eventTypeId: string;
  initialChecked: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [state, action] = useActionState(toggleEventTypeAction, undefined);

  useEffect(() => {
    if (state?.status === "success") {
      toast.success(state.message);
    } else if (state?.status === "error") {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <Switch
      checked={initialChecked}
      disabled={isPending}
      onCheckedChange={() => {
        startTransition(() => {
          action({ eventTypeId, active: !initialChecked });
        });
      }}
    />
  );
}
