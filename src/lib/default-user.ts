import { prisma } from "@/lib/db";

const DEFAULT_EMAIL = "default@ourdays.local";

export async function getDefaultUserId(): Promise<string> {
  const user = await prisma.user.upsert({
    where: { email: DEFAULT_EMAIL },
    update: {},
    create: {
      email: DEFAULT_EMAIL,
      password: "placeholder",
      name: "Default User",
      role: "owner",
    },
  });
  return user.id;
}
