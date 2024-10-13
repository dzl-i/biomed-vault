import { DataQuality, GenomicDataType, ImagingType, PrismaClient, Sex, SignalType } from "@prisma/client";
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

export async function createPhenotype(patientId: string, name: string, description: string, traits: string[]) {
  const patient = await getPatientFromId(patientId);
  if (patient === null) return null;

  return await prisma.phenotypeData.create({
    data: {
      name: name,
      description: description,
      traits: traits,
      patient: {
        connect: patient
      }
    }
  });
}

export async function createImaging(patientId: string, name: string, description: string, imageType: ImagingType, image: string, imageUrl: string) {
  const patient = await getPatientFromId(patientId);
  if (patient === null) return null;

  return await prisma.imagingData.create({
    data: {
      name: name,
      description: description,
      imageType: imageType,
      image: image,
      imageUrl: imageUrl,
      patient: {
        connect: patient
      }
    }
  });
}

export async function createSignal(patientId: string, name: string, description: string, signalType: SignalType, dataPoints: string, duration: number, sampleRate: number) {
  const patient = await getPatientFromId(patientId);
  if (patient === null) return null;

  return await prisma.signalData.create({
    data: {
      name: name,
      description: description,
      signalType: signalType,
      dataPoints: dataPoints,
      duration: duration,
      sampleRate: sampleRate,
      patient: {
        connect: patient
      }
    }
  });
}
