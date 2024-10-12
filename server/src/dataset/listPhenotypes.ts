import { getPhenotypes } from "../helper/datasetHelper";

export async function datasetListPhenotype() {
  // Get a list of all phenotypes, with patients being anonymised
  // All phenotypes will have the researcher email, so other researchers can contact the original researcher
  // If the phenotype belongs to a patient of the researcher, they can view the patient in more detail
  const phenotypes = await getPhenotypes();

  return {
    phenotypes
  };
}
