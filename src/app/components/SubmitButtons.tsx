"use client"
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

interface AuthButtonProps {
    icon: React.ReactNode;
    provider: string;
}

const AuthButton = ({ icon, provider }: AuthButtonProps) => {
    const { pending } = useFormStatus();

    return (
        <Button className="w-full" variant="outline">
            {pending ? (
                <Loader2 className="size-4 animate-spin" />
            ) : (
                icon
            )}
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
