"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "./SubmitButtons";
import { settingAction } from "../actions";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { settingSchema } from "../lib/zodSchemas";
import Image from "next/image";
import { X } from "lucide-react";
import { UploadDropzone } from "@/app/lib/uploadthing";
import { toast } from "sonner";
interface SettingFormProps {
  name: string;
  email: string;
  image: string;
}

export default function SettingForm({ name, email, image }: SettingFormProps) {
  const [lastResult, action] = useActionState(settingAction, undefined);
  const [currentImage, setCurrentImage] = useState(image);

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: settingSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const handleDeleteImage = () => {
    setCurrentImage("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Settings</CardTitle>
        <CardDescription>
          Manage your account settings and preferences
        </CardDescription>
      </CardHeader>
      <form noValidate id={form.id} onSubmit={form.onSubmit} action={action}>
        <CardContent className="flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-2">
            <Label>Name</Label>
            <Input
              name={fields.fullName.name}
              key={fields.fullName.key}
              type="text"
              placeholder="Name"
              defaultValue={name}
            />
            <p className="text-red-500 text-sm">
              {fields.fullName.errors?.join(", ")}
            </p>
          </div>
          <div className="flex flex-col gap-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="Email"
              defaultValue={email}
              disabled
            />
          </div>
          <div className="grid gap-y-5">
            <input
              type="hidden"
              name={fields.profileImage.name}
              key={fields.profileImage.key}
              value={currentImage}
            />
            <Label>Profile Image</Label>
            {currentImage ? (
              <div className="relative size-24">
                <Image
                  src={currentImage}
                  alt="Profile Image"
                  //   height={300}
                  //   width={300}
                  fill
                  className="object-cover rounded-lg size-24"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-0 right-0"
                  onClick={handleDeleteImage}
                >
                  <X className="size-4" />
                </Button>
              </div>
            ) : (
              <UploadDropzone
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  setCurrentImage(res[0].url);
                  toast.success("Image uploaded successfully");
                }}
                onUploadError={(error: Error) => {
                  toast.error("Image upload failed");
                }}
              />
            )}
            <p className="text-red-500 text-sm">
              {fields.profileImage.errors?.join(", ")}
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton text="Save Changes" />
        </CardFooter>
      </form>
    </Card>
  );
}
