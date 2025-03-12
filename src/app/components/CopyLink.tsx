"use client";

import { toast } from "sonner";
import { Link2 } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
interface CopyLinkProps {
  link: string;
}

export function CopyLink({ link }: CopyLinkProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      console.log(link);
      toast.success("Link copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <DropdownMenuItem onSelect={handleCopy}>
      <Link2 className="size-4 mr-2" />
      <span>Copy Link</span>
    </DropdownMenuItem>
  );
}
