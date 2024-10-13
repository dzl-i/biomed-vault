import { CategoryType, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getPhenotypes() {
  const phenotypes = await prisma.phenotypeData.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      traits: true,
      patient: {
        select: {
          researcher: {
            select: {
              username: true,
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
    researcherUsername: phenotype.patient.researcher.username,
    researcherEmail: phenotype.patient.researcher.email
  }));
}

export async function getGenomics() {
  const genomics = await prisma.genomicData.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      dataType: true,
      geneNames: true,
      mutationTypes: true,
      impacts: true,
      rawDataUrl: true,
      quality: true,
      patient: {
        select: {
          researcher: {
            select: {
              username: true,
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
    researcherUsername: genomic.patient.researcher.username,
    researcherEmail: genomic.patient.researcher.email
  }));
}

export async function getImaging() {
  const imaging = await prisma.imagingData.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      imageType: true,
      image: true,
      imageUrl: true,
      patient: {
        select: {
          researcher: {
            select: {
              username: true,
              email: true
            }
          }
        }
      }
    }
  });

  return imaging.map(image => ({
    id: image.id,
    name: image.name,
    description: image.description,
    imageType: image.imageType,
    image: image.image,
    imageUrl: image.imageUrl,
    researcherUsername: image.patient.researcher.username,
    researcherEmail: image.patient.researcher.email
  }));
}

export async function getSignals() {
  const signals = await prisma.signalData.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      signalType: true,
      dataPoints: true,
      duration: true,
      sampleRate: true,
      patient: {
        select: {
          researcher: {
            select: {
              username: true,
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
    researcherUsername: signal.patient.researcher.username,
    researcherEmail: signal.patient.researcher.email
  }));
}

export async function getCategorisedData(categoryType: CategoryType) {
  const datas = await prisma.category.findMany({
    where: {
      type: categoryType
    },
    select: {
      id: true,
      name: true,
      patients: {
        select: {
          patient: {
            select: {
              sex: true,
              diagnosticInfo: true,
              treatmentInfo: true,
              researcher: {
                select: {
                  username: true,
                  email: true
                }
              }
            }
          }
        }
      }
    }
  });

  return datas.flatMap(category =>
    category.patients.map(({ patient }) => ({
      id: category.id,
      categoryName: category.name,
      sex: patient.sex,
      diagnosticInfo: patient.diagnosticInfo,
      treatmentInfo: patient.treatmentInfo,
      researcherUsername: patient.researcher.username,
      researcherEmail: patient.researcher.email
    }))
  );
}
