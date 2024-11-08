import { detailSignal } from "../helper/overviewHelper";

export async function overviewSignal(signalid: string, researcherId: string) {
  const signal = await detailSignal(signalid);
  if (signal === null) throw { status: 400, message: "Invalid signal data." };

  return {
    name: signal.name,
    description: signal.description,
    signalType: signal.signalType,
    dataPoints: signal.dataPoints,
    duration: signal.duration,
    sampleRate: signal.sampleRate,
    categories: signal.categories,
    patientId: signal.patient.id,
    researcherId: signal.patient.researcher.id,
    researcherName: signal.patient.researcher.name,
    researcherInstitution: signal.patient.researcher.institution,
    researcherEmail: signal.patient.researcher.email
  }
}
