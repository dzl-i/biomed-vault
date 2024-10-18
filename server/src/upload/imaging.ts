import { CategoryType, ImagingType } from "@prisma/client";
import { createImaging } from "../helper/uploadHelper";

export async function uploadImaging(patientId: string, name: string, description: string, imageType: ImagingType, image: string, imageUrl: string, categories: CategoryType[]) {
  const imaging = await createImaging(patientId, name, description, imageType, image, imageUrl, categories);
  if (imaging === null) throw { status: 400, message: "Invalid patient." };

  return {
    id: imaging.id,
    name: imaging.name,
    description: imaging.description,
    imageType: imaging.imageType,
    categories: imaging.categories
  }
}