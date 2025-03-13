"use client";

import { ButtonGroup } from "@/components/ui/button-group";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useActionState } from "react";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "./SubmitButtons";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { eventTypeSchema } from "../lib/zodSchemas";
import { updateEventTypeAction } from "../actions";

type VideoCallSoftware = "Google Meet" | "Zoom Meeting" | "Microsoft Teams";

interface EditEventTypeFormProps {
  eventTypeId: string;
  title: string;
  url: string;
  description: string;
  duration: number;
  videoCallSoftware: VideoCallSoftware;
}

export function EditEventTypeForm({
  eventTypeId,
  title,
  url,
  description,
  duration,
  videoCallSoftware,
}: EditEventTypeFormProps) {
  const [lastResult, action] = useActionState(updateEventTypeAction, undefined);

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: eventTypeSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const [selectedVideoCallSoftware, setSelectedVideoCallSoftware] =
    useState<VideoCallSoftware>(videoCallSoftware as VideoCallSoftware);

  const handleVideoCallSoftwareChange = (software: VideoCallSoftware) => {
    setSelectedVideoCallSoftware(software);
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center h-full w-full">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Edit event type</CardTitle>
          <CardDescription>
            Edit the event type that allows people to book your time.
          </CardDescription>
        </CardHeader>
        <form noValidate id={form.id} onSubmit={form.onSubmit} action={action}>
          <input type="hidden" name="id" value={eventTypeId} />
          <CardContent className="grid gap-y-5">
            <div className="flex flex-col gap-y-2">
              <Label>Title</Label>
              <Input
                name={fields.title.name}
                key={fields.title.key}
                defaultValue={title}
                placeholder="Event type name (e.g. '30 Minute Meeting')"
              />
              {fields.title.errors?.map((error) => (
                <p key={error} className="text-red-500">
                  {error}
                </p>
              ))}
            </div>

            <div className="grid gap-y-2">
              <Label>URL Slug</Label>
              <div className="flex rounded-md">
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-muted bg-muted px-3 text-muted-foreground text-sm">
                  Calendary.com/
                </span>
                <Input
                  name={fields.url.name}
                  key={fields.url.key}
                  defaultValue={url}
                  placeholder="example-url-1"
                  className="rounded-l-none"
                />
              </div>
              {fields.url.errors?.map((error) => (
                <p key={error} className="text-red-500">
                  {error}
                </p>
              ))}
            </div>

            <div className="grid gap-y-2">
              <Label>Description</Label>
              <Textarea
                name={fields.description.name}
                key={fields.description.key}
                defaultValue={description}
                placeholder="Event type description"
              />
              {fields.description.errors?.map((error) => (
                <p key={error} className="text-red-500">
                  {error}
                </p>
              ))}
            </div>

            <div className="flex flex-col gap-y-2">
              <Label>Duration</Label>
              <Select
                name={fields.duration.name}
                key={fields.duration.key}
                defaultValue={duration.toString()}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Duration</SelectLabel>
                    <SelectItem value="15">15 Minutes</SelectItem>
                    <SelectItem value="30">30 Minutes</SelectItem>
                    <SelectItem value="45">45 Minutes</SelectItem>
                    <SelectItem value="60">60 Minutes</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {fields.duration.errors?.map((error) => (
                <p key={error} className="text-red-500">
                  {error}
                </p>
              ))}
            </div>

            <div className="grid gap-y-2">
              <input
                type="hidden"
                name={fields.videoCallSoftware.name}
                value={selectedVideoCallSoftware}
              />
              <Label>Video Call Provider</Label>
              <ButtonGroup className="flex w-full">
                <Button
                  className="flex-1"
                  type="button"
                  onClick={() => handleVideoCallSoftwareChange("Google Meet")}
                  variant={
                    selectedVideoCallSoftware === "Google Meet"
                      ? "default"
                      : "outline"
                  }
                >
                  Google Meet
                </Button>
                <Button
                  className="flex-1"
                  type="button"
                  onClick={() => handleVideoCallSoftwareChange("Zoom Meeting")}
                  variant={
                    selectedVideoCallSoftware === "Zoom Meeting"
                      ? "default"
                      : "outline"
                  }
                >
                  Zoom Meeting
                </Button>
                <Button
                  className="flex-1"
                  type="button"
                  onClick={() =>
                    handleVideoCallSoftwareChange("Microsoft Teams")
                  }
                  variant={
                    selectedVideoCallSoftware === "Microsoft Teams"
                      ? "default"
                      : "outline"
                  }
                >
                  Microsoft Teams
                </Button>
              </ButtonGroup>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between w-full mt-6">
            <Button asChild variant="destructive">
              <Link href="/dashboard">Cancel</Link>
            </Button>
            <SubmitButton text="Update Event Type" />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
