import { Ban, PlusCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
interface EmptyStateProps {
  title: string;
  description: string;
  href: string;
  buttonText: string;
}

export default function EmptyState({ title, description, href, buttonText }: EmptyStateProps) {
  return (
    <div className="flex flex-col flex-1 items-center justify-center h-full rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
      <div className="flex size-20 items-center justify-center rounded-full bg-primary/10">
        <Ban className="size-10 text-primary" />
      </div>
      <h1 className="mt-6 text-xl font-semibold">{title}</h1>
      <p className="mb-8 mt-2 text-center text-sm leading-tight text-muted-foreground max-w-sm mx-auto">
        {description}
      </p>
      <Button asChild>
        <Link href={href}>
          <PlusCircle className="size-4 mr-2" />
          {buttonText}
        </Link>
      </Button>
    </div>
  );
}
