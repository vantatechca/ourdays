import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  const users = await prisma.user.findMany();
  console.log(JSON.stringify(
    users.map((u) => ({ id: u.id, email: u.email, name: u.name, role: u.role })),
    null,
    2
  ));
}

main().finally(() => prisma.$disconnect());
