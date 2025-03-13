import prisma from "./db";
import { Session } from "@prisma/client";
import { cookies } from "next/headers";

type SessionWithUser = {
  id: string;
  sessionToken: string;
  userId: string;
  expires: Date;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
};

export async function getSession(): Promise<SessionWithUser | null> {
  try {
    const cookieStore = await cookies();
    const session_token = cookieStore.get("authjs.session-token")?.value;

    if (!session_token) return null;

    const session = await prisma.session.findUnique({
      where: {
        sessionToken: session_token,
      },
      include: {
        user: true,
      },
    });

    if (!session || session.expires < new Date()) {
      await prisma.$disconnect();
      return null;
    }

    await prisma.$disconnect();
    return session as SessionWithUser;
  } catch (error) {
    await prisma.$disconnect();
    console.error("Get session error:", error);
    return null;
  }
}

export async function createSession(userId: string): Promise<Session | null> {
  try {
    // Tạo session token ngẫu nhiên
    const sessionToken = crypto.randomUUID();

    // Tạo thời gian hết hạn (ví dụ: 30 ngày)
    const expires = new Date();
    expires.setDate(expires.getDate() + 30);

    const session = await prisma.session.create({
      data: {
        sessionToken,
        userId,
        expires,
      },
      include: {
        user: true,
      },
    });

    return session;
  } catch (error) {
    console.error("Lỗi khi tạo session:", error);
    return null;
  }
}

export async function deleteSession(sessionToken: string): Promise<void> {
  try {
    await prisma.session.delete({
      where: {
        sessionToken,
      },
    });
  } catch (error) {
    console.error("Lỗi khi xóa session:", error);
  }
}
