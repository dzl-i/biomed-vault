import { PrismaClient } from "@prisma/client";
import { contains } from "validator";
const prisma = new PrismaClient();

export async function patientSearch(searchTerm: string) {
  return await prisma.patient.findMany({
    where: {
      OR: [
        {
          sex: {
            equals: searchTerm.toUpperCase() as any,
          }
        },
        {
          diagnosticInfo: {
            contains: searchTerm,
            mode: "insensitive"
          }
        },
        {
          treatmentInfo: {
            contains: searchTerm,
            mode: "insensitive"
          }
        },
        {
          categories: {
            has: searchTerm.toUpperCase() as any
          }
        }
      ]
    }
  });
}
