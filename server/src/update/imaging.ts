import { detailImaging } from "../helper/overviewHelper";
import { updateImagingData } from "../helper/updateHelper";

export async function updateImaging(researcherId: string, imagingId: string, imagingData: any) {
  // Error checking
  const imagingDetail = await detailImaging(imagingId);
  if (imagingDetail === null) throw { status: 400, message: "Invalid imaging data." };
  if (imagingDetail.patient.researcher.id !== researcherId) throw { status: 401, message: "This imaging data does not belong to your patient and you are not authorised to update this imaging data." };

  const imaging = await updateImagingData(imagingId, imagingData);
  if (imaging === null) throw { status: 400, message: "Invalid imaging." };

  return {
    name: imaging.name,
    description: imaging.description,
    imageType: imaging.imageType,
    image: imaging.image,
    imageUrl: imaging.imageUrl
  }
}
