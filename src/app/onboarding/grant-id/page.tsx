import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CalendarCheck2} from "lucide-react";
import { HiOutlineCalendar } from "react-icons/hi";
export default function GrantIdPage() {
  return (
    <div className="min-h-screen w-screen flex items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            You're almost done!
          </CardTitle>
          <CardDescription className="text-center">
            We have to now connect your calendar to your account.
          </CardDescription>
          <HiOutlineCalendar className="size-40 w-full rounded-lg" />
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/api/auth">
              <CalendarCheck2 className="size-4 mr-2" />
              Connect Calendar to your account
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
