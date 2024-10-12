import { CategoryType } from "@prisma/client";
import { getCategorisedData } from "../helper/datasetHelper";

export async function datasetListCategorisedData(category: CategoryType) {
  // Get a list of all data according to the category type, with patients being anonymised
  // Patient information will be shown, but preserving anonymity (name and other sensitive information not shown)
  // Only shows diagnostic information, treatment information, sex, and researcher's contact
  // All data will have the researcher email, so other researchers can contact the original researcher
  // If the data belongs to a patient of the researcher, they can view the patient in more detail
  const data = await getCategorisedData(category);

  return {
    data
  };
}
