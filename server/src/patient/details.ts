import { getPatientDetails } from "../helper/patientHelper";

export async function patientDetails(patientId: string, researcherId: string) {
  // Get patient
  const patient = await getPatientDetails(patientId);
  if (patient === null) throw { status: 400, message: "Patient does not exist." };
  if (patient.researcherId !== researcherId) throw { status: 401, message: "You are not authorised to access this data." };

  return {
    name: patient.name,
    dateOfBirth: patient.dateOfBirth,
    sex: patient.sex,
    diagnosticInfo: patient.diagnosticInfo,
    treatmentInfo: patient.treatmentInfo,
    genomicData: patient.genomicData,
    phenotypeData: patient.phenotypes,
    imagingData: patient.imagingData,
    signalData: patient.signalData
  };
}