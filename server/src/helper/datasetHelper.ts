import { CategoryType, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getPhenotypes() {
  const phenotypes = await prisma.phenotypeData.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      traits: true,
      categories: true,
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
      categories: true,
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

export async function getImaging() {
  const imaging = await prisma.imagingData.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      imageType: true,
      image: true,
      imageUrl: true,
      categories: true,
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

  return imaging.map(image => ({
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
      categories: true,
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
