"use client";
import { CalendarCheck, HomeIcon, Settings, User2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export const dashboardLinks = [
    {
        id: 0,
        name: "Event Types",
        href: "/dashboard",
        icon: <HomeIcon/>,
    },
    {
        id: 1,
        name: "Meetings",
        href: "/dashboard/meetings",
        icon: <User2 />,
    },
    {
        id: 2,
        name: "Availability",
        href: "/dashboard/availability",
        icon: <CalendarCheck />,
    },
    {
        id: 3,
        name: "Settings",
        href: "/dashboard/settings",
        icon: <Settings />,
    },
];

const DashboardLinks = () => {
    const pathname = usePathname();
    return (
        <>
            {dashboardLinks.map((link) => (
                <Link
                    key={link.id}
                    href={link.href}
                    className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                        pathname === link.href
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-primary"
                    )}
                >
                    {link.icon}
                    {link.name}
                </Link>
            ))}
        </>
    );
};

export default DashboardLinks;
