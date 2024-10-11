import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getResearcherById(id: string) {
  // Prisma Queries
  return await prisma.researcher.findFirst({
    where: {
      id: id
    }
  });
}

export async function getResearcherByEmail(email: string) {
  // Prisma Queries
  return await prisma.researcher.findFirst({
    where: {
      email: email
    }
  });
}

export async function getResearcherByUsername(username: string) {
  // Prisma Queries
  return await prisma.researcher.findFirst({
    where: {
      username: username
    }
  });
}
