import { detailGenomic } from "../helper/overviewHelper";
import { updateGenomicData } from "../helper/updateHelper";

export async function updateGenomic(researcherId: string, genomicId: string, genomicData: any) {
  // Error checking
  const genomicDetail = await detailGenomic(genomicId);
  if (genomicDetail === null) throw { status: 400, message: "Invalid genomic data." };
  if (genomicDetail.patient.researcher.id !== researcherId) throw { status: 401, message: "This genomic data does not belong to your patient and you are not authorised to update this genomic data." };

  const genomic = await updateGenomicData(genomicId, genomicData);
  if (genomic === null) throw { status: 400, message: "Invalid genomic." };

  return {
    name: genomic.name,
    description: genomic.description,
    dataType: genomic.dataType,
    geneNames: genomic.geneNames,
    mutationTypes: genomic.mutationTypes,
    impacts: genomic.impacts,
    rawDataUrl: genomic.rawDataUrl,
    quality: genomic.quality,
    categories: genomic.categories
  }
}
