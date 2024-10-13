import { DataQuality, GenomicDataType } from "@prisma/client";
import { createGenomic } from "../helper/uploadHelper";

export async function uploadGenomic(patientId: string, name: string, description: string, dataType: GenomicDataType, geneNames: string[], mutationTypes: string[], impacts: string[], rawDataUrl: string, quality: DataQuality) {
  const genomic = await createGenomic(patientId, name, description, dataType, geneNames, mutationTypes, impacts, rawDataUrl, quality);
  if (genomic === null) throw { status: 400, message: "Invalid patient." };

  return {
    id: genomic.id,
    name: genomic.name,
    description: genomic.description,
    dataType: genomic.dataType
  }
}
