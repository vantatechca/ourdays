import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("Usage: tsx scripts/delete-user.ts <email>");
    process.exit(1);
  }
  const deleted = await prisma.user.delete({ where: { email } });
  console.log(`Deleted user: ${deleted.email} (${deleted.id})`);
}

main().finally(() => prisma.$disconnect());
