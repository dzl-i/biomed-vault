import { detailGenomic } from "../helper/overviewHelper";

export async function overviewGenomic(genomicId: string, researcherId: string) {
  const genomic = await detailGenomic(genomicId);
  if (genomic === null) throw { status: 400, message: "Invalid genomic data." };

  return {
    name: genomic.name,
    description: genomic.description,
    dataType: genomic.dataType,
    geneNames: genomic.geneNames,
    mutationTypes: genomic.mutationTypes,
    impacts: genomic.impacts,
    rawDataUrl: genomic.rawDataUrl,
    quality: genomic.quality,
    categories: genomic.categories,
    patientId: genomic.patient.id,
    researcherId: genomic.patient.researcher.id,
    researcherEmail: genomic.patient.researcher.email
  }
}