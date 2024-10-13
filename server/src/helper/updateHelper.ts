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
    }
  });
}

export async function updateGenomicData(genomicId: string, genomicData: any) {
  return await prisma.genomicData.update({
    where: {
      id: genomicId
    },
    data: genomicData
  });
}

export async function updatePhenotypeData(phenotypeId: string, phenotypeData: any) {
  return await prisma.phenotypeData.update({
    where: {
      id: phenotypeId
    },
    data: phenotypeData
  });
}

export async function updateImagingData(imagingId: string, imagingData: any) {
  return await prisma.imagingData.update({
    where: {
      id: imagingId
    },
    data: imagingData
  });
}

export async function updateSignalData(signalId: string, signalData: any) {
  return await prisma.signalData.update({
    where: {
      id: signalId
    },
    data: signalData
  });
}
