import Link from "next/link";
import Image from "next/image";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import DashboardLinks from "../components/DashboardLinks";
import { LogOut, Menu, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "../components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { auth, signOut } from "../lib/auth";
import { requireUser } from "../lib/hooks";
import { prisma } from "../lib/db";
import { redirect } from "next/navigation";

async function getData(id: string) {
  const data = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      userName: true,
      grantId: true,
    },
  });
  if (!data?.userName) {
    return redirect("/onboarding");
  }
  if (!data?.grantId) {
    return redirect("/onboarding/grant-id");
  }
  return data;
}

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await requireUser();
  
  if (!session?.user) {
    return redirect("/");
  }
  const data = await getData(session.user.id as string);

  return (
    <>
      <div className="min-h-screen w-full grid md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden md:block border-r bg-muted/40">
          <div className="flex h-full flex-col max-h-screen gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <Link href="/" className="flex items-center gap-2">
                <Image src="/logo.png" alt="logo" height={32} width={32} />
                <p className="text-xl font-semibold">
                  <span className="text-muted-foreground">Ca</span>
                  <span className="text-primary">lendary</span>
                </p>
              </Link>
            </div>
            <div className="flex-1">
              <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                <DashboardLinks />
              </nav>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  className="md:hidden shrink-0"
                  size="icon"
                  variant="outline"
                >
                  <Menu className="size-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col">
                <nav className="grid gap-2 mt-10">
                  <DashboardLinks />
                </nav>
              </SheetContent>
            </Sheet>
            <div className="ml-auto flex items-center gap-x-4">
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full"
                  >
                    <Image
                      src={(session?.user?.image as string) || ""}
                      alt="profile"
                      height={20}
                      width={20}
                      className="w-full h-full rounded-full"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings">
                      <Settings className="size-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <form action={async () => {
                      "use server";
                      await signOut();
                    }}>
                      <button className="flex items-center gap-2 w-full text-left">
                        <LogOut className="size-4" />
                        <span>Logout</span>
                      </button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 lg:p-6 lg:gap-6">{children}</main>
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
