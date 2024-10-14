import { listLog } from "../helper/logHelper";
import { getResearcherById } from "../helper/researcherHelper";

export async function logList(researcherId: string) {
  const researcher = await getResearcherById(researcherId);
  if (researcher?.username !== "admin") throw { status: 401, message: "Unauthorised: only admins can view logs." }

  const logs = await listLog();

  const finalLogs = logs.map(log => ({
    researcherUsername: log.researcherUsername,
    event: log.event,
    outcome: log.outcome,
    timestamp: new Date(log.timestamp).toString()
  }))

  return {
    logs: finalLogs
  }
}
