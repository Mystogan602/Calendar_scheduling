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
    const session_token = (await cookies()).get("authjs.session-token")?.value;
    const session = await prisma.session.findUnique({
      where: {
        sessionToken: session_token || "",
      },
      include: {
        user: true, // Bao gồm thông tin user
      },
    });

    if (!session) {
      return null;
    }

    // Kiểm tra session đã hết hạn chưa
    if (session.expires < new Date()) {
      // Nếu hết hạn thì xóa session
      await prisma.session.delete({
        where: {
          id: session.id,
        },
      });
      return null;
    }

    return session;
  } catch (error) {
    console.error("Lỗi khi lấy session:", error);
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
