"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { useActionState, useState } from "react";
import Link from "next/link";
import { SubmitButton } from "@/app/components/SubmitButtons";
import { createEventTypeAction } from "@/app/actions";
import { useForm } from "@conform-to/react";
import { eventTypeSchema } from "@/app/lib/zodSchemas";
import { parseWithZod } from "@conform-to/zod";

type VideoCallSoftware = "Google Meet" | "Zoom" | "Microsoft Teams";

export default function NewEventType() {
  const [lastResult, action] = useActionState(createEventTypeAction, undefined);

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: eventTypeSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const [selectedVideoCallSoftware, setSelectedVideoCallSoftware] =
    useState<VideoCallSoftware>("Google Meet");

  const handleVideoCallSoftwareChange = (software: VideoCallSoftware) => {
    setSelectedVideoCallSoftware(software);
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center h-full w-full">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Add a new event type
          </CardTitle>
          <CardDescription>
            Create a new event type that allows people to book your time.
          </CardDescription>
        </CardHeader>
        <form noValidate id={form.id} onSubmit={form.onSubmit} action={action}>
          <CardContent className="grid gap-y-5">
            <div className="flex flex-col gap-y-2">
              <Label>Title</Label>
              <Input
                name={fields.title.name}
                key={fields.title.key}
                defaultValue={fields.title.initialValue}
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
                  defaultValue={fields.url.initialValue}
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
                defaultValue={fields.description.initialValue}
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
                defaultValue={fields.duration.initialValue}
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
                  onClick={() => handleVideoCallSoftwareChange("Zoom")}
                  variant={
                    selectedVideoCallSoftware === "Zoom" ? "default" : "outline"
                  }
                >
                  Zoom
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
            <SubmitButton text="Create Event Type" />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
