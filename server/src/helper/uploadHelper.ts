import { PrismaClient, Sex } from "@prisma/client";
import { getResearcherById } from "./researcherHelper";
const prisma = new PrismaClient();

export async function createPatient(researcherId: string, name: string, dateOfBirth: string, sex: Sex, diagnosticInfo: string, treatmentInfo: string) {
  const researcher = await getResearcherById(researcherId);
  if (researcher === null) return null;

  return await prisma.patient.create({
    data: {
      name: name,
      dateOfBirth: dateOfBirth,
      sex: sex,
      diagnosticInfo: diagnosticInfo,
      treatmentInfo: treatmentInfo,
      researcher: {
        connect: researcher
      }
    }
  });
}
