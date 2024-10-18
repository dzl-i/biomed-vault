import { CategoryType } from "@prisma/client";
import { createPhenotype } from "../helper/uploadHelper";

export async function uploadPhenotype(patientId: string, name: string, description: string, traits: string[], categories: CategoryType[]) {
  const phenotype = await createPhenotype(patientId, name, description, traits, categories);
  if (phenotype === null) throw { status: 400, message: "Invalid patient." };

  return {
    id: phenotype.id,
    name: phenotype.name,
    description: phenotype.description,
    traits: phenotype.traits,
    categories: phenotype.categories
  }
}
