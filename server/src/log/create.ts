import { createLog } from "../helper/logHelper";

export async function logCreate(researcherId: string, event: string, outcome: string) {
  const log = createLog(researcherId, event, outcome);
  if (log === null) throw { status: 400, message: "Log could not be created." };

  return {
    result: true
  };
}
