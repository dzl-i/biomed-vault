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

export async function getResearcherPatients(id: string) {
  return await prisma.researcher.findFirst({
    where: {
      id: id
    },
    select: {
      patients: {
        select: {
          name: true,
          dateOfBirth: true,
          sex: true,
          diagnosticInfo: true,
          treatmentInfo: true
        }
      }
    }
  });
}
