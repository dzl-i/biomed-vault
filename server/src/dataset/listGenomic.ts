import { getGenomics } from "../helper/datasetHelper";

export async function datasetListGenomics() {
  // Get a list of all genomics, with patients being anonymised
  // All genomics will have the researcher email, so other researchers can contact the original researcher
  // If the genomic belongs to a patient of the researcher, they can view the patient in more detail
  const genomics = await getGenomics();

  return {
    genomics
  };
}
