import { detailPatient } from "../helper/overviewHelper";

// Researchers can only access detailed information about their own patient
export async function overviewPatient(patientId: string, researcherId: string) {
  const patient = await detailPatient(patientId);
  if (patient === null) throw { status: 400, message: "Invalid patient." };

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
    signalData: patient.signalData,
    categories: patient.categories,
    researcherId: patient.researcherId,
    researcherEmail: patient.researcher.email
  }
}
