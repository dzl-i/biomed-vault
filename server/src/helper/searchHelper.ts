import { PrismaClient } from "@prisma/client";
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

export async function phenotypeSearch(searchTerm: string) {
  return await prisma.phenotypeData.findMany({
    where: {
      OR: [
        {
          name: {
            contains: searchTerm,
            mode: "insensitive"
          }
        },
        {
          description: {
            contains: searchTerm,
            mode: "insensitive"
          }
        },
        {
          traits: {
            has: searchTerm
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

export async function genomicSearch(searchTerm: string) {
  return await prisma.genomicData.findMany({
    where: {
      OR: [
        {
          name: {
            contains: searchTerm,
            mode: "insensitive"
          }
        },
        {
          description: {
            contains: searchTerm,
            mode: "insensitive"
          }
        },
        {
          dataType: {
            equals: searchTerm as any
          }
        },
        {
          geneNames: {
            has: searchTerm
          }
        },
        {
          mutationTypes: {
            has: searchTerm
          }
        },
        {
          impacts: {
            has: searchTerm
          }
        },
        {
          rawDataUrl: {
            equals: searchTerm
          }
        },
        {
          quality: {
            equals: searchTerm as any
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

export async function imagingSearch(searchTerm: string) {
  return await prisma.imagingData.findMany({
    where: {
      OR: [
        {
          name: {
            contains: searchTerm,
            mode: "insensitive"
          }
        },
        {
          description: {
            contains: searchTerm,
            mode: "insensitive"
          }
        },
        {
          imageType: {
            equals: searchTerm as any
          }
        },
        {
          imageUrl: {
            equals: searchTerm
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

export async function signalSearch(searchTerm: string) {
  return await prisma.signalData.findMany({
    where: {
      OR: [
        {
          name: {
            contains: searchTerm,
            mode: "insensitive"
          }
        },
        {
          description: {
            contains: searchTerm,
            mode: "insensitive"
          }
        },
        {
          signalType: {
            equals: searchTerm as any
          }
        },
        {
          dataPoints: {
            contains: searchTerm,
            mode: "insensitive"
          }
        },
        {
          duration: {
            equals: searchTerm as any
          }
        },
        {
          sampleRate: {
            equals: searchTerm as any
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
