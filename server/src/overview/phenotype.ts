import { detailPhenotype } from "../helper/overviewHelper";

export async function overviewPhenotype(phenotypeId: string, researcherId: string) {
  const phenotype = await detailPhenotype(phenotypeId);
  if (phenotype === null) throw { status: 400, message: "Invalid phenotype data." };

  return {
    name: phenotype.name,
    description: phenotype.description,
    traits: phenotype.traits,
    categories: phenotype.categories,
    patientId: phenotype.patient.id,
    researcherId: phenotype.patient.researcher.id,
    researcherEmail: phenotype.patient.researcher.email
  }
}
