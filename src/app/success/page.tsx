"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CheckCircleIcon } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <Card className="max-w-[400px] w-full mx-auto">
        <CardContent className="flex flex-col w-full p-6 items-center">
          <div className="size-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircleIcon className="size-10 text-green-500" />
          </div>
          <h1 className="text-2xl font-semibold mt-4 text-center">
            Meeting is scheduled
          </h1>
          <p className="text-sm text-muted-foreground text-center mt-1">
            We emailed you invitation to the meeting with all the details.
          </p>
        </CardContent>
        <CardFooter>
          <Button className="w-full" asChild>
            <Link href="/dashboard">Close this page</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
