import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getPhenotypes() {
  const phenotypes = await prisma.phenotype.findMany({
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
