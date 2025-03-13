import Image from "next/image";

export default function Logos() {
  return (
    <div className="py-10">
      <h2 className="text-lg font-semibold text-center leading-7">
        Trusted by the best companies in the world
      </h2>
      <div className="mt-10 grid max-w-lg mx-auto grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
        <Image
          src="/nylas-logo.png"
          alt="Logo"
          width={1000}
          height={1000}
          className="col-span-2 max-h-12 w-full object-contain lg:col-span-1 dark:invert"
        />
        <Image
          src="/nextjs-logo.svg"
          alt="Logo"
          width={1000}
          height={1000}
          className="col-span-2 max-h-12 w-full object-contain lg:col-span-1 dark:invert"
        />
        <Image
          src="/vercel.svg"
          alt="Logo"
          width={1000}
          height={1000}
          className="col-span-2 max-h-12 w-full object-contain lg:col-span-1 dark:invert"
        />
        <Image
          src="/supabase.svg"
          alt="Logo"
          width={1000}
          height={1000}
          className="col-span-2 max-h-12 w-full object-contain lg:col-span-1 dark:invert"
        />
        <Image
          src="/typescript-logo.png"
          alt="Logo"
          width={1000}
          height={1000}
          className="col-span-2 max-h-12 w-full object-contain lg:col-span-1 dark:invert"
        />
      </div>
    </div>
  );
}
