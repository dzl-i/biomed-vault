export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  sex: string;
  diagnosticInfo: string;
  treatmentInfo: string;
  categories: string[];
  researcherId: string;
  researcherEmail: string;
};
