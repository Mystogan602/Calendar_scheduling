"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { onboardingAction } from "../actions";
import { useFormState } from "react-dom";
import { useForm } from "@conform-to/react";
import { onboardingSchemaLocale } from "../lib/zodSchemas";
import { parseWithZod } from "@conform-to/zod";
import { SubmitButton } from "../components/SubmitButtons";

export default function OnboardingPage() {
  const [lastResult, action] = useFormState(onboardingAction, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: onboardingSchemaLocale });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Welcome to the Ca<span className="text-primary">lendary</span>
          </CardTitle>
          <CardDescription>
            We need the following information to set up your account
          </CardDescription>
        </CardHeader>
        <form
          className="flex flex-col gap-y-5"
          id={form.id}
          onSubmit={form.onSubmit}
          action={action}
          noValidate
        >
          <CardContent className="flex flex-col gap-y-5">
            <div className="grid gap-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                name={fields.fullName.name}
                defaultValue={fields.fullName.initialValue}
                placeholder="Full Name"
                key={fields.fullName.key}
              />
              <p className="text-sm text-red-500">
                {fields.fullName.errors?.map((error, index) => (
                  <span key={index} className="block">
                    {error}
                  </span>
                ))}
              </p>
            </div>
            <div className="grid gap-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="flex rounded-md">
                <span className="inline-flex items-center px-3 rounded-l-md bg-muted border border-r-0 border-muted text-muted-foreground text-sm">
                  Calendary.com/
                </span>
                <Input
                  name={fields.userName.name}
                  defaultValue={fields.userName.initialValue}
                  key={fields.userName.key}
                  placeholder="example-username-123"
                  className="rounded-l-none"
                />
              </div>
              <p className="text-sm text-red-500">
                {fields.userName.errors?.map((error, index) => (
                  <span key={index} className="block">
                    {error}
                  </span>
                ))}
              </p>
            </div>
          </CardContent>
          <CardFooter className="w-full">
            <SubmitButton className="w-full" text="Submit" />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
