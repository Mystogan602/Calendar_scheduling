import SettingForm from "@/app/components/SettingForm";
import prisma from "@/app/lib/db";
import { requireUser } from "@/app/lib/hooks";
import { notFound } from "next/navigation";

async function getData(id: string) {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      name: true,
      email: true,
      image: true,
    },
  });

  if (!user) {
    return notFound();
  }

  return user;
}

const SettingsPage = async () => {
  const session = await requireUser();
  const user = await getData(session.user?.id as string);
  return (
    <div>
      <SettingForm name={user.name as string} email={user.email as string} image={user.image as string} />
    </div>
  )
}

export default SettingsPage;
