import { detailPatient } from "../helper/overviewHelper";

// Researchers can only access detailed information about their own patient
export async function overviewPatient(patientId: string, researcherId: string) {
  const patient = await detailPatient(patientId);
  if (patient === null) throw { status: 400, message: "Invalid patient." };
  if (patient.researcherId !== researcherId) throw { status: 401, message: "This is not your patient and you are not authorised to access this patient's details." }

  return {
    id: patient.id,
    name: patient.name,
    dateOfBirth: patient.dateOfBirth,
    sex: patient.sex,
    diagnosticInfo: patient.diagnosticInfo,
    treatmentInfo: patient.treatmentInfo,
    genomicData: patient.genomicData,
    phenotypeData: patient.phenotypes,
    imagingData: patient.imagingData,
    signalData: patient.signalData
  }
}
