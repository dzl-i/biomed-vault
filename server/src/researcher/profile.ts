import { getResearcherByUsername } from "../helper/researcherHelper";

export async function researcherProfile(username: string) {
  // Get Researcher from the Username
  const researcher = await getResearcherByUsername(username);
  if (researcher === null) throw { status: 400, message: "Researcher does not exist." };

  return {
    name: researcher.name,
    email: researcher.email,
    institution: researcher.institution,
  };
}