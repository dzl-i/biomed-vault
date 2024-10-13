import { updateResearcherData } from "../helper/updateHelper";

export async function updateResearcher(researcherId: string, id: string, researcherData: any) {
  const researcher = await updateResearcherData(id, researcherData);
  if (researcher === null) throw { status: 400, message: "Invalid researcher." };
  if (researcher.id !== researcherId) throw { status: 401, message: "You cannot edit other researcher's data." };

  return {
    name: researcher.name,
    username: researcher.username,
    email: researcher.email,
    institution: researcher.institution,
  }
}
