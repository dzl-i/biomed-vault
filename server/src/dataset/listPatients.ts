import { getPatients } from "../helper/datasetHelper";
import { getResearcherPatients } from "../helper/researcherHelper";


// Should only show patients that "belongs" to the researcher
// HIPAA privacy rules
export async function datasetListPatients() {
  // Get patients of the researcher
  const patients = await getPatients();

  return {
    patients
  };
}
