import { getResearcherDetails } from "../helper/researcherHelper";

export async function researcherProfile(researcherId: string) {
  // Get Researcher from the Username
  const researcher = await getResearcherDetails(researcherId);
  if (researcher === null) throw { status: 400, message: "Researcher does not exist." };

  return {
    researcher
  };
}