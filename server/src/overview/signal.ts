import { detailSignal } from "../helper/overviewHelper";

export async function overviewSignal(signalid: string, researcherId: string) {
  const signal = await detailSignal(signalid);
  if (signal === null) throw { status: 400, message: "Invalid signal data." };
  if (signal.patient.researcher.id !== researcherId) throw { status: 401, message: "This signal data does not belong to your patient and you are not authorised to access this signal data." };

  return {
    name: signal.name,
    description: signal.description,
    signalType: signal.signalType,
    dataPoints: signal.dataPoints,
    duration: signal.duration,
    sampleRate: signal.sampleRate
  }
}
