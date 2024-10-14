import { PrismaClient } from "@prisma/client";
import { getResearcherById } from "./researcherHelper";
const prisma = new PrismaClient();

export async function createLog(researcherId: string, event: string, outcome: string) {
  const researcher = await getResearcherById(researcherId);
  if (researcher === null) return null;

  return await prisma.dataAccessLog.create({
    data: {
      event: event,
      outcome: outcome,
      researcher: {
        connect: researcher
      }
    }
  });
}
