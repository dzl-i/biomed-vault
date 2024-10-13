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

export async function detailPhenotype(phenotypeId: string) {
  return await prisma.phenotypeData.findUnique({
    where: {
      id: phenotypeId
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

export async function detailImaging(imagingId: string) {
  return await prisma.imagingData.findUnique({
    where: {
      id: imagingId
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
