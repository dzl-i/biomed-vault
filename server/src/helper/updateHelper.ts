import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

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
  })
}
