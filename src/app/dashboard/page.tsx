import { requireUser } from "@/app/lib/hooks";
import prisma from "@/app/lib/db";
import { notFound } from "next/navigation";
import EmptyState from "../components/EmptyState";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ExternalLink, Pencil, Settings, Trash, Users2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

async function getData(id: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      eventTypes: {
        select: {
          id: true,
          title: true,
          duration: true,
          url: true,
          active: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      userName: true,
    },
  });

  if (!user) {
    return notFound();
  }
  return user;
}

const Dashboard = async () => {
  const session = await requireUser();
  const user = await getData(session.user.id);

  return (
    <>
      {user.eventTypes.length === 0 ? (
        <EmptyState
          title="No event types found"
          description="You haven't created any event types yet. Create the first one by clicking the button below."
          href="/dashboard/new"
          buttonText="Create event type"
        />
      ) : (
        <>
          <div className="flex items-center justify-between px-2">
            <div className="hidden sm:grid gap-y-1">
              <h1 className="text-3xl md:text-4xl font-semibold">
                Event Types
              </h1>
              <p className="text-lg text-muted-foreground">
                Create and manage your event types right here
              </p>
            </div>
            <Button asChild>
              <Link href="/dashboard/new">Create new event type</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {user.eventTypes.map((eventType) => (
              <div
                key={eventType.id}
                className="overflow-hidden shadow rounded-lg border relative"
              >
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="outline">
                        <Settings className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-20" align="end">
                      <DropdownMenuLabel>Event</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                          <Link href={`/${user.userName}/${eventType.url}`}>
                            <ExternalLink className="size-4 mr-2" />
                            <span>Preview</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/event/${eventType.id}`}>
                            <Pencil className="size-4 mr-2" />
                            <span>Edit</span>
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/dashboard/event/${eventType.id}/delete`}
                          >
                            <Trash className="size-4 mr-2" />
                            <span>Delete</span>
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <Link href={`/dashboard/event/${eventType.id}`}>
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Users2 className="size-6" aria-hidden="true" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium truncate text-muted-foreground">
                            {eventType.duration} minutes meeting
                          </dt>
                          <dd className="text-lg font-medium">
                            {eventType.title}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="bg-muted dark:bg-gray-900 px-5 py-3 flex justify-between items-center">
                  <Link href={`/dashboard/event/${eventType.id}`}>
                    <Button>Edit event</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default Dashboard;
