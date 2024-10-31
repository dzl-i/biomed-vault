import { CategoryType, DataQuality, GenomicDataType, ImagingType, PrismaClient, SignalType } from "@prisma/client";
const prisma = new PrismaClient();

export async function patientSearch(searchTerm: string) {
  const patients = await prisma.patient.findMany({
    where: {
      OR: [
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
        // Only include categories if the search term matches one of the CategoryType enum values
        ...(Object.values(CategoryType).includes(searchTerm.toUpperCase() as CategoryType)
          ? [{
            categories: {
              has: searchTerm.toUpperCase() as CategoryType
            }
          }]
          : []
        )
      ]
    },
    include: {
      researcher: {
        select: {
          email: true
        }
      }
    }
  });

  return patients.map(patient => ({
    id: patient.id,
    name: patient.name,
    dateOfBirth: patient.dateOfBirth,
    sex: patient.sex,
    diagnosticInfo: patient.diagnosticInfo,
    treatmentInfo: patient.treatmentInfo,
    categories: patient.categories,
    researcherId: patient.researcherId,
    researcherEmail: patient.researcher.email
  }));
}

export async function phenotypeSearch(searchTerm: string) {
  const phenotypes = await prisma.phenotypeData.findMany({
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
        // Only include categories if the search term matches one of the CategoryType enum values
        ...(Object.values(CategoryType).includes(searchTerm.toUpperCase() as CategoryType)
          ? [{
            categories: {
              has: searchTerm.toUpperCase() as CategoryType
            }
          }]
          : []
        )
      ]
    },
    include: {
      patient: {
        select: {
          researcher: {
            select: {
              id: true,
              email: true
            }
          }
        }
      }
    }
  });

  return phenotypes.map(phenotype => ({
    id: phenotype.id,
    name: phenotype.name,
    description: phenotype.description,
    traits: phenotype.traits,
    categories: phenotype.categories,
    researcherId: phenotype.patient.researcher.id,
    researcherEmail: phenotype.patient.researcher.email
  }));
}

export async function genomicSearch(searchTerm: string) {
  const genomics = await prisma.genomicData.findMany({
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
        // Only include genomic data type if the search term matches one of the GenomicDataType enum values
        ...(Object.values(GenomicDataType).includes(searchTerm.toUpperCase() as GenomicDataType) ? [
          {
            dataType: {
              equals: searchTerm.toUpperCase() as GenomicDataType
            }
          }
        ] : []),
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
        // Only include data quality if the search term matches one of the DataQuality enum values
        ...(Object.values(DataQuality).includes(searchTerm.toUpperCase() as DataQuality) ? [
          {
            quality: {
              equals: searchTerm.toUpperCase() as DataQuality
            }
          }
        ] : []),
        // Only include categories if the search term matches one of the CategoryType enum values
        ...(Object.values(CategoryType).includes(searchTerm.toUpperCase() as CategoryType)
          ? [{
            categories: {
              has: searchTerm.toUpperCase() as CategoryType
            }
          }]
          : []
        )
      ]
    },
    include: {
      patient: {
        select: {
          researcher: {
            select: {
              id: true,
              email: true
            }
          }
        }
      }
    }
  });

  return genomics.map(genomic => ({
    id: genomic.id,
    name: genomic.name,
    description: genomic.description,
    dataType: genomic.dataType,
    geneName: genomic.geneNames,
    mutationTypes: genomic.mutationTypes,
    impacts: genomic.impacts,
    rawDataUrl: genomic.rawDataUrl,
    quality: genomic.quality,
    categories: genomic.categories,
    researcherId: genomic.patient.researcher.id,
    researcherEmail: genomic.patient.researcher.email
  }));
}

export async function imagingSearch(searchTerm: string) {
  const imagings = await prisma.imagingData.findMany({
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
        // Only include imageType if the search term matches one of the ImagingType enum values
        ...(Object.values(ImagingType).includes(searchTerm.toUpperCase() as ImagingType) ? [
          {
            imageType: {
              equals: searchTerm.toUpperCase() as ImagingType
            }
          }
        ] : []),
        {
          imageUrl: {
            equals: searchTerm
          }
        },
        // Only include categories if the search term matches one of the CategoryType enum values
        ...(Object.values(CategoryType).includes(searchTerm.toUpperCase() as CategoryType)
          ? [{
            categories: {
              has: searchTerm.toUpperCase() as CategoryType
            }
          }]
          : []
        )
      ]
    },
    include: {
      patient: {
        select: {
          researcher: {
            select: {
              id: true,
              email: true
            }
          }
        }
      }
    }
  });

  return imagings.map(image => ({
    id: image.id,
    name: image.name,
    description: image.description,
    imageType: image.imageType,
    image: image.image,
    imageUrl: image.imageUrl,
    categories: image.categories,
    researcherId: image.patient.researcher.id,
    researcherEmail: image.patient.researcher.email
  }));
}

export async function signalSearch(searchTerm: string) {
  const signals = await prisma.signalData.findMany({
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
        // Only include signalType if the search term matches one of the SignalType enum values
        ...(Object.values(SignalType).includes(searchTerm.toUpperCase() as SignalType) ? [
          {
            signalType: {
              equals: searchTerm.toUpperCase() as SignalType
            }
          }
        ] : []),
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
        // Only include categories if the search term matches one of the CategoryType enum values
        ...(Object.values(CategoryType).includes(searchTerm.toUpperCase() as CategoryType)
          ? [{
            categories: {
              has: searchTerm.toUpperCase() as CategoryType
            }
          }]
          : []
        )
      ]
    },
    include: {
      patient: {
        select: {
          researcher: {
            select: {
              id: true,
              email: true
            }
          }
        }
      }
    }
  });

  return signals.map(signal => ({
    id: signal.id,
    name: signal.name,
    description: signal.description,
    signalType: signal.signalType,
    dataPoints: signal.dataPoints,
    duration: signal.duration,
    sampleRate: signal.sampleRate,
    categories: signal.categories,
    researcherId: signal.patient.researcher.id,
    researcherEmail: signal.patient.researcher.email
  }));
}
