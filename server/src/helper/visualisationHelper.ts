import { CategoryType, DataQuality, GenomicDataType, Patient } from "@prisma/client";

const ageRanges = [
  { min: 0, max: 1, label: 'Infancy (0 - 1 year)' },
  { min: 2, max: 4, label: 'Toddler (2 - 4 years)' },
  { min: 5, max: 12, label: 'Child (5 - 12 years)' },
  { min: 13, max: 19, label: 'Teenager (13 - 19 years)' },
  { min: 20, max: 39, label: 'Adult (20 - 39 years)' },
  { min: 40, max: 59, label: 'Middle Age Adult (40 - 59 years)' },
  { min: 60, max: Infinity, label: 'Senior Adult (60+ years)' },
];

export function getPatientDemographics(patients: Patient[]) {
  const patientDemographics = ageRanges.map(range => ({
    age: range.label,
    male: 0,
    female: 0,
    other: 0,
  }));

  patients.forEach(patient => {
    // Calculate age
    const today = new Date();
    const birthDate = new Date(patient.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();

    // Adjust age depending on birth date
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    const rangeIndex = ageRanges.findIndex(
      range => age >= range.min && age <= range.max
    );

    if (rangeIndex !== -1) {
      switch (patient.sex) {
        case 'MALE':
          patientDemographics[rangeIndex].male++;
          break;
        case 'FEMALE':
          patientDemographics[rangeIndex].female++;
          break;
        case 'OTHER':
          patientDemographics[rangeIndex].other++;
          break;
      }
    }
  });

  return {
    patientDemographics
  };
}

export function getPhenotypeTraitsCloud(phenotypes: {
  id: string;
  name: string;
  description: string;
  traits: string[];
  categories: CategoryType[];
  researcherId: string;
  researcherEmail: string;
}[]) {
  const traitsFrequencyMap = new Map<string, number>();

  phenotypes.forEach(phenotype => {
    phenotype.traits.forEach(trait => {
      traitsFrequencyMap.set(
        trait,
        (traitsFrequencyMap.get(trait) || 0) + 1
      );
    });
  });

  const phenotypeTraitsCloud = Array.from(traitsFrequencyMap.entries())
    .map(([text, value]) => ({ text, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 30);

  return { phenotypeTraitsCloud };
};

export function getGenomicsStats(genomics: {
  id: string;
  name: string;
  description: string;
  dataType: GenomicDataType;
  geneName: string[];
  mutationTypes: string[];
  impacts: string[];
  rawDataUrl: string;
  quality: DataQuality;
  categories: CategoryType[];
  researcherId: string;
  researcherEmail: string;
}[]) {
  const genomicDistribution = Object.values(GenomicDataType).map(type => ({
    name: type,
    value: genomics.filter(g => g.dataType === type).length
  }));

  const mutationTypesMap = new Map<string, number>();

  genomics.forEach(genomic => {
    genomic.mutationTypes.forEach(mutation => {
      mutationTypesMap.set(
        mutation,
        (mutationTypesMap.get(mutation) || 0) + 1
      );
    });
  });

  const mutationTypesCloud = Array.from(mutationTypesMap.entries())
    .map(([text, value]) => ({ text, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 30);

  return {
    genomicDistribution,
    mutationTypesCloud
  }
}
