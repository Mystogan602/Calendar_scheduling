"use client";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { cn } from "@/lib/utils";

interface AuthButtonProps {
  icon: React.ReactNode;
  provider: string;
}

interface SubmitButtonProps {
  text: string;
  variant?:
    | "default"
    | "outline"
    | "ghost"
    | "link"
    | "secondary"
    | "destructive"
    | null
    | undefined;
  className?: string;
}

export const SubmitButton = ({ text, variant, className }: SubmitButtonProps) => {
  const { pending } = useFormStatus();

  return (
    pending ? (
        <Button disabled className={cn("w-fit", className)} variant="outline">
            <Loader2 className="size-4 animate-spin" /> Please wait...
        </Button>
    ) : (
        <Button className={cn("w-fit", className)} variant={variant} type="submit">
            {text}
        </Button>
    )
  );
};

const AuthButton = ({ icon, provider }: AuthButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <Button className="w-full" variant="outline">
      {pending ? <Loader2 className="size-4 animate-spin" /> : icon}
      {pending ? "Please wait..." : `Sign in with ${provider}`}
    </Button>
  );
};

export const GoogleAuthButton = () => (
  <AuthButton icon={<FcGoogle className="size-4" />} provider="Google" />
);

export const GithubAuthButton = () => (
  <AuthButton icon={<FaGithub className="size-4" />} provider="Github" />
);
