import { getImaging } from "../helper/datasetHelper";

export async function datasetListImaging() {
  // Get a list of all imaging, with patients being anonymised
  // All imaging will have the researcher email, so other researchers can contact the original researcher
  // If the image belongs to a patient of the researcher, they can view the patient in more detail
  const imaging = await getImaging();

  return {
    imaging
  };
}
