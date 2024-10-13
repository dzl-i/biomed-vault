import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function updateResearcherData(researcherId: string, researcherData: any) {
  return await prisma.researcher.update({
    where: {
      id: researcherId
    },
    data: researcherData,
    select: {
      id: true,
      name: true,
      institution: true,
      email: true,
      username: true
    }
  });
}

export async function updatePatientData(patientId: string, patientData: any) {
  return await prisma.patient.update({
    where: {
      id: patientId
    },
    data: patientData,
    include: {
      genomicData: true,
      phenotypes: true,
      imagingData: true,
      signalData: true,
      researcher: {
        select: {
          id: true
        }
      }
    }
  });
}
