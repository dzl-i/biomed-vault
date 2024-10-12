import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getPatientDetails(patientId: string) {
  return await prisma.patient.findUnique({
    where: {
      id: patientId
    },
    select: {
      name: true,
      dateOfBirth: true,
      sex: true,
      diagnosticInfo: true,
      treatmentInfo: true,
      genomicData: true,
      phenotypes: true,
      imagingData: true,
      signalData: true,
      researcherId: true
    }
  });
}
