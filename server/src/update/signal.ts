import { detailSignal } from "../helper/overviewHelper";
import { updateSignalData } from "../helper/updateHelper";

export async function updateSignal(researcherId: string, signalId: string, signalData: any) {
  // Error checking
  const signalDetail = await detailSignal(signalId);
  if (signalDetail === null) throw { status: 400, message: "Invalid signal data." };
  if (signalDetail.patient.researcher.id !== researcherId) throw { status: 401, message: "This signal data does not belong to your patient and you are not authorised to update this signal data." };

  const signal = await updateSignalData(signalId, signalData);
  if (signal === null) throw { status: 400, message: "Invalid signal." };

  return {
    name: signal.name,
    description: signal.description,
    signalType: signal.signalType,
    dataPoints: signal.dataPoints,
    duration: signal.duration,
    sampleRate: signal.sampleRate,
    categories: signal.categories
  }
}
