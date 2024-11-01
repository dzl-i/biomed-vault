import { Dispatch, MouseEventHandler, SetStateAction, useState } from "react"
import { Button, Checkbox, CheckboxGroup, ModalBody, ModalFooter, ModalHeader, Radio, RadioGroup } from "@nextui-org/react"

import { CategoryType, PatientSummary } from "@/utils/types"
import { calculateAge } from "@/utils/date";

// Age range interface
interface AgeRange {
  min: number;
  max: number;
}

interface FilterState {
  selectedAges: string[];
  selectedSex: string[];
  selectedTreatment: string;
  selectedCategories: string[];
}

interface Props {
  onClose: MouseEventHandler<HTMLButtonElement>;
  patients: PatientSummary[];
  setPatients: Dispatch<SetStateAction<PatientSummary[]>>;
  filters: FilterState;
  setFilters: Dispatch<SetStateAction<FilterState>>;
}

// Map age group values to actual age ranges
const ageRanges: Record<string, AgeRange> = {
  INFANCY: { min: 0, max: 1 },
  TODDLER: { min: 2, max: 4 },
  CHILD: { min: 5, max: 12 },
  TEENAGER: { min: 13, max: 19 },
  ADULT: { min: 20, max: 39 },
  "MIDDLE-AGE-ADULT": { min: 40, max: 59 },
  "SENIOR-ADULT": { min: 60, max: 150 },
};

export const FilterPatient = ({ onClose, patients, setPatients, filters, setFilters }: Props) => {
  const isInSelectedAgeRange = (birthDate: string): boolean => {
    if (filters.selectedAges.length === 0) return true;

    const age = calculateAge(birthDate);
    return filters.selectedAges.some(ageGroup => {
      const range = ageRanges[ageGroup];
      return age >= range.min && age <= range.max;
    });
  };

  const applyFilters = () => {
    let filteredResults = [...patients];

    // Filter by age if any age groups are selected
    if (filters.selectedAges.length > 0) {
      filteredResults = filteredResults.filter(patient =>
        isInSelectedAgeRange(patient.dateOfBirth)
      );
    }

    // Filter by sex if any sex options are selected
    if (filters.selectedSex.length > 0) {
      filteredResults = filteredResults.filter(patient =>
        filters.selectedSex.includes(patient.sex)
      );
    }

    // Filter by treatment status
    if (filters.selectedTreatment) {
      filteredResults = filteredResults.filter(patient => {
        const hasTreatment = patient.treatmentInfo.trim().length > 0;
        return filters.selectedTreatment === "FOUND" ? hasTreatment : !hasTreatment;
      });
    }

    // Filter by categories if any categories are selected
    if (filters.selectedCategories.length > 0) {
      filteredResults = filteredResults.filter(patient =>
        patient.categories.some(category =>
          filters.selectedCategories.includes(category)
        )
      );
    }

    setPatients(filteredResults);
    onClose({} as any);
  };

  const resetFilters = () => {
    setFilters({
      selectedAges: [],
      selectedSex: [],
      selectedTreatment: "",
      selectedCategories: []
    });

    setPatients(patients);
    onClose({} as any);
  };

  return (
    <>
      <ModalHeader className="flex flex-col gap-1 text-center text-3xl">
        Filter Patients
      </ModalHeader>
      <ModalBody>
        {/* Filter by Age */}
        <CheckboxGroup label="Select ages of interest" color="primary" value={filters.selectedAges} onValueChange={(value) => setFilters(prev => ({ ...prev, selectedAges: value }))} className="mb-4">
          <Checkbox value="INFANCY">Infancy: 0 - 1 year</Checkbox>
          <Checkbox value="TODDLER">Toddler: 2 - 4 years</Checkbox>
          <Checkbox value="CHILD">Child: 5 - 12 years</Checkbox>
          <Checkbox value="TEENAGER">Teenager: 13 - 19 years</Checkbox>
          <Checkbox value="ADULT">Adult: 20 - 39 years</Checkbox>
          <Checkbox value="MIDDLE-AGE-ADULT">Middle-Age Adult: 40 - 59 years</Checkbox>
          <Checkbox value="SENIOR-ADULT">Senior Adult: 60+ years</Checkbox>
        </CheckboxGroup>

        {/* Filter by Sex */}
        <CheckboxGroup label="Select sex of interest" color="primary" value={filters.selectedSex} onValueChange={(value) => setFilters(prev => ({ ...prev, selectedSex: value }))} className="mb-4">
          <Checkbox value="MALE">Male</Checkbox>
          <Checkbox value="FEMALE">Female</Checkbox>
          <Checkbox value="OTHER">Other</Checkbox>
        </CheckboxGroup>

        {/* Filter by Treatment Type */}
        <RadioGroup label="Select treatment type" value={filters.selectedTreatment} onValueChange={(value) => setFilters(prev => ({ ...prev, selectedTreatment: value }))} className="mb-4">
          <Radio value="FOUND">Found</Radio>
          <Radio value="NOT-FOUND">Not Found</Radio>
        </RadioGroup>

        {/* Filter by Categories */}
        <CheckboxGroup label="Select categories of interest" color="primary" value={filters.selectedCategories} onValueChange={(value) => setFilters(prev => ({ ...prev, selectedCategories: value }))}>
          {/* Disease Categories */}
          <div className="mb-2">
            <p className="text-sm font-semibold mb-1">Disease Categories</p>
            <div className="flex flex-row flex-wrap gap-x-4 gap-y-2">
              <Checkbox value={CategoryType.DISEASE}>Disease</Checkbox>
              <Checkbox value={CategoryType.CANCER}>Cancer</Checkbox>
              <Checkbox value={CategoryType.CARDIOVASCULAR}>Cardiovascular</Checkbox>
              <Checkbox value={CategoryType.NEUROLOGICAL}>Neurological</Checkbox>
              <Checkbox value={CategoryType.GENETIC}>Genetic</Checkbox>
              <Checkbox value={CategoryType.METABOLIC}>Metabolic</Checkbox>
              <Checkbox value={CategoryType.IMMUNOLOGICAL}>Immunological</Checkbox>
              <Checkbox value={CategoryType.INFECTIOUS}>Infectious</Checkbox>
              <Checkbox value={CategoryType.DEVELOPMENTAL}>Developmental</Checkbox>
            </div>
          </div>

          {/* Clinical Categories */}
          <div className="mb-2">
            <p className="text-sm font-semibold mb-1">Clinical Categories</p>
            <div className="flex flex-row flex-wrap gap-x-4 gap-y-2">
              <Checkbox value={CategoryType.DIAGNOSIS}>Diagnosis</Checkbox>
              <Checkbox value={CategoryType.TREATMENT}>Treatment</Checkbox>
              <Checkbox value={CategoryType.SCREENING}>Screening</Checkbox>
              <Checkbox value={CategoryType.PREVENTION}>Prevention</Checkbox>
              <Checkbox value={CategoryType.EMERGENCY}>Emergency</Checkbox>
            </div>
          </div>

          {/* Phenotype Categories */}
          <div className="mb-2">
            <p className="text-sm font-semibold mb-1">Phenotype Categories</p>
            <div className="flex flex-row flex-wrap gap-x-4 gap-y-2">
              <Checkbox value={CategoryType.SYMPTOM}>Symptom</Checkbox>
              <Checkbox value={CategoryType.SYNDROME}>Syndrome</Checkbox>
              <Checkbox value={CategoryType.COMPLICATION}>Complication</Checkbox>
              <Checkbox value={CategoryType.SIDE_EFFECT}>Side Effect</Checkbox>
            </div>
          </div>

          {/* Genetic Categories */}
          <div className="mb-2">
            <p className="text-sm font-semibold mb-1">Genetic Categories</p>
            <div className="flex flex-row flex-wrap gap-x-4 gap-y-2">
              <Checkbox value={CategoryType.MUTATION}>Mutation</Checkbox>
              <Checkbox value={CategoryType.VARIANT}>Variant</Checkbox>
              <Checkbox value={CategoryType.POLYMORPHISM}>Polymorphism</Checkbox>
              <Checkbox value={CategoryType.DELETION}>Deletion</Checkbox>
              <Checkbox value={CategoryType.INSERTION}>Insertion</Checkbox>
              <Checkbox value={CategoryType.FUSION}>Fusion</Checkbox>
              <Checkbox value={CategoryType.AMPLIFICATION}>Amplification</Checkbox>
            </div>
          </div>

          {/* Treatment Categories */}
          <div className="mb-2">
            <p className="text-sm font-semibold mb-1">Treatment Categories</p>
            <div className="flex flex-row flex-wrap gap-x-4 gap-y-2">
              <Checkbox value={CategoryType.DRUG}>Drug</Checkbox>
              <Checkbox value={CategoryType.THERAPY}>Therapy</Checkbox>
              <Checkbox value={CategoryType.SURGERY}>Surgery</Checkbox>
              <Checkbox value={CategoryType.RADIATION}>Radiation</Checkbox>
              <Checkbox value={CategoryType.IMMUNOTHERAPY}>Immunotherapy</Checkbox>
              <Checkbox value={CategoryType.GENE_THERAPY}>Gene Therapy</Checkbox>
              <Checkbox value={CategoryType.HORMONE_THERAPY}>Hormone Therapy</Checkbox>
            </div>
          </div>

          {/* Demographic Categories */}
          <div className="mb-2">
            <p className="text-sm font-semibold mb-1">Demographic Categories</p>
            <div className="flex flex-row flex-wrap gap-x-4 gap-y-2">
              <Checkbox value={CategoryType.PEDIATRIC}>Pediatric</Checkbox>
              <Checkbox value={CategoryType.ADULT}>Adult</Checkbox>
              <Checkbox value={CategoryType.GERIATRIC}>Geriatric</Checkbox>
              <Checkbox value={CategoryType.MATERNAL}>Maternal</Checkbox>
            </div>
          </div>

          {/* Anatomical Categories */}
          <div className="mb-2">
            <p className="text-sm font-semibold mb-1">Anatomical Categories</p>
            <div className="flex flex-row flex-wrap gap-x-4 gap-y-2">
              <Checkbox value={CategoryType.BRAIN}>Brain</Checkbox>
              <Checkbox value={CategoryType.HEART}>Heart</Checkbox>
              <Checkbox value={CategoryType.LUNG}>Lung</Checkbox>
              <Checkbox value={CategoryType.LIVER}>Liver</Checkbox>
              <Checkbox value={CategoryType.KIDNEY}>Kidney</Checkbox>
              <Checkbox value={CategoryType.BONE}>Bone</Checkbox>
              <Checkbox value={CategoryType.MUSCLE}>Muscle</Checkbox>
              <Checkbox value={CategoryType.BLOOD}>Blood</Checkbox>
            </div>
          </div>
        </CheckboxGroup>
      </ModalBody>
      <ModalFooter className="justify-center gap-4">
        <Button color="danger" variant="bordered" onClick={resetFilters}>
          Reset Filters
        </Button>
        <Button color="danger" variant="bordered" onClick={onClose}>
          Close
        </Button>
        <Button color="primary" onClick={applyFilters}>
          Apply Filter
        </Button>
      </ModalFooter>
    </>
  )
}