import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { signIn } from "@/app/lib/auth";
import { GithubAuthButton, GoogleAuthButton } from "./SubmitButtons";

const AuthModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Try for free</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[360px]">
        <DialogHeader className="flex flex-row items-center justify-center">
          <Image src="/logo.png" alt="Logo" width={40} height={40} />
          <h4 className="text-3xl font-semibold">
            <span className="text-muted-foreground">Ca</span>
            <span className="text-primary">lendary</span>
          </h4>
        </DialogHeader>
        <div className="flex flex-col mt-5 gap-3">
          <DialogTitle className="text-center text-sm text-muted-foreground">
            Sign in to your account
          </DialogTitle>
          <form
            action={async () => {
              "use server";
              await signIn("google");
            }}
            className="w-full"
          >
            <GoogleAuthButton />
          </form>
          <form
            action={async () => {
              "use server";
              await signIn("github");
            }}
            className="w-full"
          >
            <GithubAuthButton />
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
