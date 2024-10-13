import { DataQuality, GenomicDataType, PrismaClient, Sex } from "@prisma/client";
import { getResearcherById } from "./researcherHelper";
import { getPatientFromId } from "./patientHelper";
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

export async function createGenomic(patientId: string, name: string, description: string, dataType: GenomicDataType, geneNames: string[], mutationTypes: string[], impacts: string[], rawDataUrl: string, quality: DataQuality) {
  const patient = await getPatientFromId(patientId);
  if (patient === null) return null;

  return await prisma.genomicData.create({
    data: {
      name: name,
      description: description,
      dataType: dataType,
      geneNames: geneNames,
      mutationTypes: mutationTypes,
      impacts: impacts,
      rawDataUrl: rawDataUrl,
      quality: quality,
      patient: {
        connect: patient
      }
    }
  });
}
