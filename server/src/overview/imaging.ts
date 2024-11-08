import { detailImaging } from "../helper/overviewHelper";

export async function overviewImaging(imagingId: string, researcherId: string) {
  const imaging = await detailImaging(imagingId);
  if (imaging === null) throw { status: 400, message: "Invalid imaging data." };

  return {
    name: imaging.name,
    description: imaging.description,
    imageType: imaging.imageType,
    image: imaging.image,
    imageUrl: imaging.imageUrl,
    categories: imaging.categories,
    patientId: imaging.patient.id,
    researcherId: imaging.patient.researcher.id,
    researcherName: imaging.patient.researcher.name,
    researcherInstitution: imaging.patient.researcher.institution,
    researcherEmail: imaging.patient.researcher.email
  }
}
