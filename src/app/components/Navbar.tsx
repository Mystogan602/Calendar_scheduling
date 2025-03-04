import Link from "next/link";
import Image from "next/image";
import AuthModal from "./AuthModal";

const Navbar = () => {
  return (
    <div className="flex py-5 items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/logo.png" alt="Logo" width={40} height={40} />
        <h4 className="text-3xl font-semibold">
          <span className="text-muted-foreground">Ca</span>
          <span className="text-primary">lendary</span>
        </h4>
      </Link>

      <AuthModal />
    </div>
  );
};

export default Navbar;
