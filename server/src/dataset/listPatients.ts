import { getResearcherPatients } from "../helper/researcherHelper";


// Should only show patients that "belongs" to the researcher
// HIPAA privacy rules
export async function datasetListPatients(researcherId: string) {
  // Get patients of the researcher
  const patients = await getResearcherPatients(researcherId);
  if (patients === null) throw { status: 400, message: "Researcher does not exist." };

  return {
    patients
  };
}
