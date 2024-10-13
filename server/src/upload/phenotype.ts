import { createPhenotype } from "../helper/uploadHelper";

export async function uploadPhenotype(patientId: string, name: string, description: string, traits: string[]) {
  const phenotype = await createPhenotype(patientId, name, description, traits);
  if (phenotype === null) throw { status: 400, message: "Invalid patient." };

  return {
    id: phenotype.id,
    name: phenotype.name,
    description: phenotype.description,
    traits: phenotype.traits
  }
}
