import { detailImaging } from "../helper/overviewHelper";

export async function overviewimaging(imagingId: string, researcherId: string) {
  const imaging = await detailImaging(imagingId);
  if (imaging === null) throw { status: 400, message: "Invalid imaging data." };
  if (imaging.patient.researcher.id !== researcherId) throw { status: 401, message: "This imaging data does not belong to your patient and you are not authorised to access this imaging data." };

  return {
    name: imaging.name,
    description: imaging.description,
    imageType: imaging.imageType,
    image: imaging.image,
    imageUrl: imaging.imageUrl
  }
}
