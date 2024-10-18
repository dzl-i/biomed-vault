import { patientSearch } from "../helper/searchHelper";

export async function searchPatient(searchTerm: string) {
  const patients = await patientSearch(searchTerm);

  return {
    patients
  }
}
