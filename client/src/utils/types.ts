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
  // Disease Classifications
  ONCOLOGICAL = 'ONCOLOGICAL',                   // Cancer and neoplastic diseases
  CARDIOVASCULAR = 'CARDIOVASCULAR',             // Heart and circulatory system diseases
  NEUROLOGICAL = 'NEUROLOGICAL',                 // Brain and nervous system disorders
  RESPIRATORY = 'RESPIRATORY',                   // Lung and breathing disorders
  GASTROINTESTINAL = 'GASTROINTESTINAL',         // Digestive system disorders
  ENDOCRINE = 'ENDOCRINE',                       // Hormone-related disorders
  IMMUNOLOGICAL = 'IMMUNOLOGICAL',               // Immune system disorders
  MUSCULOSKELETAL = 'MUSCULOSKELETAL',           // Bone and muscle disorders
  DERMATOLOGICAL = 'DERMATOLOGICAL',             // Skin conditions
  GENETIC_DISORDER = 'GENETIC_DISORDER',         // Inherited conditions
  INFECTIOUS_DISEASE = 'INFECTIOUS_DISEASE',     // Bacterial, viral, fungal infections
  RARE_DISEASE = 'RARE_DISEASE',                 // Rare genetic conditions

  // Clinical Aspects
  PRIMARY_DIAGNOSIS = 'PRIMARY_DIAGNOSIS',       // Initial diagnosis
  SECONDARY_DIAGNOSIS = 'SECONDARY_DIAGNOSIS',   // Complications or concurrent conditions
  ACUTE_CARE = 'ACUTE_CARE',                     // Immediate/emergency care
  CHRONIC_CARE = 'CHRONIC_CARE',                 // Long-term management
  PALLIATIVE_CARE = 'PALLIATIVE_CARE',           // End-of-life care
  PREVENTIVE_CARE = 'PREVENTIVE_CARE',           // Disease prevention
  CLINICAL_TRIAL = 'CLINICAL_TRIAL',             // Research studies

  // Treatment Categories
  CHEMOTHERAPY = 'CHEMOTHERAPY',                 // Cancer drug treatment
  IMMUNOTHERAPY = 'IMMUNOTHERAPY',               // Immune system treatment
  TARGETED_THERAPY = 'TARGETED_THERAPY',         // Specific molecular targeting
  HORMONE_THERAPY = 'HORMONE_THERAPY',           // Hormone-based treatment
  RADIATION_THERAPY = 'RADIATION_THERAPY',       // Radiation treatment
  SURGICAL = 'SURGICAL',                         // Surgical procedures
  COMBINATION_THERAPY = 'COMBINATION_THERAPY',   // Multiple treatment types
  EXPERIMENTAL_THERAPY = 'EXPERIMENTAL_THERAPY', // Novel treatments

  // Demographic Scope
  PEDIATRIC = 'PEDIATRIC',                       // Children (0-18)
  ADULT = 'ADULT',                               // Adults (19-64)
  GERIATRIC = 'GERIATRIC',                       // Elderly (65+)
  MATERNAL = 'MATERNAL',                         // Pregnancy-related
  FAMILIAL = 'FAMILIAL',                         // Family-based studies

  // Anatomical Systems
  CENTRAL_NERVOUS = 'CENTRAL_NERVOUS',           // Brain, spinal cord
  PERIPHERAL_NERVOUS = 'PERIPHERAL_NERVOUS',     // Peripheral nerves
  CARDIAC = 'CARDIAC',                           // Heart specific
  VASCULAR = 'VASCULAR',                         // Blood vessels
  RESPIRATION = 'RESPIRATION',                   // Nose, pharynx, larynx, trachea, lungs, bronchi
  DIGESTIVE = 'DIGESTIVE',                       // Mouth, esophagus, stomach, intestines, colon
  HEPATIC = 'HEPATIC',                           // Liver
  PANCREATIC = 'PANCREATIC',                     // Pancreas
  RENAL = 'RENAL',                               // Kidneys
  URINARY = 'URINARY',                           // Bladder, urethra
  REPRODUCTIVE = 'REPRODUCTIVE',                 // Reproductive organs
  SKELETAL = 'SKELETAL',                         // Bones
  MUSCULAR = 'MUSCULAR',                         // Muscles
  INTEGUMENTARY = 'INTEGUMENTARY',               // Skin, hair, nails
  LYMPHATIC = 'LYMPHATIC',                       // Lymph nodes, vessels
  ENDOCRINE_THYROID = 'ENDOCRINE_THYROID',       // Thyroid
  ENDOCRINE_ADRENAL = 'ENDOCRINE_ADRENAL',       // Adrenal glands
  ENDOCRINE_PITUITARY = 'ENDOCRINE_PITUITARY',   // Pituitary gland
  OCULAR = 'OCULAR',                             // Eyes
  AUDITORY = 'AUDITORY',                         // Ears
  ORAL = 'ORAL',                                 // Mouth, teeth, gums
  JOINT = 'JOINT',                               // Joints and connective tissue
  HEMATOLOGIC = 'HEMATOLOGIC',                   // Blood and bone marrow
  IMMUNE = 'IMMUNE'                              // Immune system components
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

export interface GenomicSummary {
  id: string;
  name: string;
  description: string;
  dataType: string;
  rawDataUrl: string;
  quality: string;
  categories: string[];
  researcherId: string;
  researcherEmail: string;
}

export interface ImagingSummary {
  id: string;
  name: string;
  description: string;
  imageType: string;
  imageUrl: string;
  categories: string[];
  researcherId: string;
  researcherEmail: string;
}

export interface SignalSummary {
  id: string;
  name: string;
  description: string;
  signalType: string;
  categories: string[];
  researcherId: string;
  researcherEmail: string;
}

export interface PatientDetail {
  id: string;
  name: string;
  dateOfBirth: string;
  sex: string;
  diagnosticInfo: string;
  treatmentInfo: string;
  categories: string[];
  researcherId: string;
  researcherName: string;
  researcherInstitution: string;
  researcherEmail: string;
  phenotypeData: PhenotypeSummary[];
  genomicData: GenomicSummary[];
  imagingData: ImagingSummary[];
  signalData: SignalSummary[];
};

export interface PhenotypeDetail {
  id: string;
  name: string;
  description: string;
  traits: string[];
  categories: string[];
  patientId: string;
  researcherId: string;
  researcherName: string;
  researcherInstitution: string;
  researcherEmail: string;
}

export interface GenomicDetail {
  id: string;
  name: string;
  description: string;
  dataType: string;
  geneNames: string[];
  mutationTypes: string[];
  impacts: string[];
  rawDataUrl: string;
  quality: string;
  categories: string[];
  patientId: string;
  researcherId: string;
  researcherName: string;
  researcherInstitution: string;
  researcherEmail: string;
}

export interface ImagingDetail {
  id: string;
  name: string;
  description: string;
  imageType: string;
  image: string;
  imageUrl: string;
  categories: string[];
  patientId: string;
  researcherId: string;
  researcherName: string;
  researcherInstitution: string;
  researcherEmail: string;
}

export interface SignalDetail {
  id: string;
  name: string;
  description: string;
  signalType: string;
  dataPoints: string;
  duration: number;
  sampleRate: number;
  categories: string[];
  patientId: string;
  researcherId: string;
  researcherName: string;
  researcherInstitution: string;
  researcherEmail: string;
}

export interface ResearcherDetail {
  id: string;
  name: string;
  institution: string;
  email: string;
  username: string;
  patients: PatientSummary[];
}

export interface DashboardData {
  patientDemographics: {
    age: string;
    male: number;
    female: number;
    other: number;
  }[];

  genomicDistribution: {
    name: string;
    value: number;
  }[];

  mutationTypesCloud: {
    text: string;
    value: number;
  }[];

  phenotypeTraitsCloud: {
    text: string;
    value: number;
  }[];

  imagingDistribution: {
    name: string;
    value: number;
  }[];

  signalDistribution: {
    name: string;
    value: number;
  }[];
}
