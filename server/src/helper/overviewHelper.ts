import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function detailPatient(patientId: string) {
  return await prisma.patient.findUnique({
    where: {
      id: patientId
    },
    include: {
      genomicData: true,
      phenotypes: true,
      imagingData: true,
      signalData: true
    }
  });
}

export async function detailGenomic(genomicId: string) {
  return await prisma.genomicData.findUnique({
    where: {
      id: genomicId
    },
    include: {
      patient: {
        select: {
          researcher: {
            select: {
              id: true
            }
          }
        }
      }
    }
  });
}
