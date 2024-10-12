import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getPhenotypes() {
  const phenotypes = await prisma.phenotypeData.findMany({
    select: {
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
    name: image.name,
    description: image.description,
    imageType: image.imageType,
    image: image.image,
    imageUrl: image.imageUrl,
    researcherUsername: image.patient.researcher.username,
    researcherEmail: image.patient.researcher.email
  }));
}
