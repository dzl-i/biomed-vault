import { detailPhenotype } from "../helper/overviewHelper";
import { updatePhenotypeData } from "../helper/updateHelper";

export async function updatePhenotype(researcherId: string, phenotypeId: string, phenotypeData: any) {
  // Error checking
  const phenotypeDetail = await detailPhenotype(phenotypeId);
  if (phenotypeDetail === null) throw { status: 400, message: "Invalid phenotype data." };
  if (phenotypeDetail.patient.researcher.id !== researcherId) throw { status: 401, message: "This phenotype data does not belong to your patient and you are not authorised to update this phenotype data." };

  const phenotype = await updatePhenotypeData(phenotypeId, phenotypeData);
  if (phenotype === null) throw { status: 400, message: "Invalid phenotype." };

  return {
    name: phenotype.name,
    description: phenotype.description,
    traits: phenotype.traits,
    categories: phenotype.categories
  }
}
