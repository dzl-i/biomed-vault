// Enums
export enum Sex {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

export enum GenomicDataType {
  WGS = 'WGS',
  WES = 'WES',
  RNA = 'RNA',
  TARGETTED = 'TARGETTED'
}

export enum ImagingType {
  MRI = 'MRI',
  CT = 'CT',
  XRAY = 'XRAY',
  ULTRASOUND = 'ULTRASOUND',
  PETSCAN = 'PETSCAN'
}

export enum SignalType {
  ECG = 'ECG',
  EEG = 'EEG',
  EMG = 'EMG',
  EOG = 'EOG'
}

export enum DataQuality {
  UNKNOWN = 'UNKNOWN',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export enum CategoryType {
  // Disease Categories
  DISEASE = 'DISEASE',
  CANCER = 'CANCER',
  CARDIOVASCULAR = 'CARDIOVASCULAR',
  NEUROLOGICAL = 'NEUROLOGICAL',
  GENETIC = 'GENETIC',
  METABOLIC = 'METABOLIC',
  IMMUNOLOGICAL = 'IMMUNOLOGICAL',
  INFECTIOUS = 'INFECTIOUS',
  DEVELOPMENTAL = 'DEVELOPMENTAL',

  // Clinical Categories
  DIAGNOSIS = 'DIAGNOSIS',
  TREATMENT = 'TREATMENT',
  SCREENING = 'SCREENING',
  PREVENTION = 'PREVENTION',
  EMERGENCY = 'EMERGENCY',

  // Phenotype Categories
  SYMPTOM = 'SYMPTOM',
  SYNDROME = 'SYNDROME',
  COMPLICATION = 'COMPLICATION',
  SIDE_EFFECT = 'SIDE_EFFECT',

  // Genetic Categories
  MUTATION = 'MUTATION',
  VARIANT = 'VARIANT',
  POLYMORPHISM = 'POLYMORPHISM',
  DELETION = 'DELETION',
  INSERTION = 'INSERTION',
  FUSION = 'FUSION',
  AMPLIFICATION = 'AMPLIFICATION',

  // Treatment Categories
  DRUG = 'DRUG',
  THERAPY = 'THERAPY',
  SURGERY = 'SURGERY',
  RADIATION = 'RADIATION',
  IMMUNOTHERAPY = 'IMMUNOTHERAPY',
  GENE_THERAPY = 'GENE_THERAPY',
  HORMONE_THERAPY = 'HORMONE_THERAPY',

  // Demographic Categories
  PEDIATRIC = 'PEDIATRIC',
  ADULT = 'ADULT',
  GERIATRIC = 'GERIATRIC',
  MATERNAL = 'MATERNAL',

  // Anatomical Categories
  BRAIN = 'BRAIN',
  HEART = 'HEART',
  LUNG = 'LUNG',
  LIVER = 'LIVER',
  KIDNEY = 'KIDNEY',
  BONE = 'BONE',
  MUSCLE = 'MUSCLE',
  BLOOD = 'BLOOD'
}

// Interfaces
export interface PatientSummary {
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

export interface PhenotypeSummary {
  id: string;
  name: string;
  description: string;
  traits: string[];
  categories: string[];
  researcherId: string;
  researcherEmail: string;
}
