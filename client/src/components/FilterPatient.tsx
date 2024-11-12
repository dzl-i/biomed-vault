import { Dispatch, SetStateAction } from "react"
import { Button, Checkbox, CheckboxGroup, ModalBody, ModalFooter, ModalHeader, Radio, RadioGroup } from "@nextui-org/react"

import { CategoryType, PatientSummary } from "@/utils/types"
import { calculateAge } from "@/utils/date";
import { CheckboxGroup as CustomCheckboxGroup } from "./CheckboxGroup";

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
  onClose: () => void;
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
    onClose();
  };

  const resetFilters = () => {
    setFilters({
      selectedAges: [],
      selectedSex: [],
      selectedTreatment: "",
      selectedCategories: []
    });

    setPatients(patients);
    onClose();
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
        <CustomCheckboxGroup value={filters.selectedCategories} onValueChange={(value) => setFilters(prev => ({ ...prev, selectedCategories: value }))}>
          {/* Disease Classifications */}
          <div className="mb-2">
            <p className="text-sm font-semibold mb-1">Disease Classifications</p>
            <div className="flex flex-row flex-wrap gap-x-4 gap-y-2">
              <CustomCheckboxGroup.Checkbox value={CategoryType.ONCOLOGICAL}>Oncological</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.CARDIOVASCULAR}>Cardiovascular</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.NEUROLOGICAL}>Neurological</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.RESPIRATORY}>Respiratory</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.GASTROINTESTINAL}>Gastrointestinal</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.ENDOCRINE}>Endocrine</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.IMMUNOLOGICAL}>Immunological</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.MUSCULOSKELETAL}>Musculoskeletal</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.DERMATOLOGICAL}>Dermatological</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.GENETIC_DISORDER}>Genetic Disorder</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.INFECTIOUS_DISEASE}>Infectious Disease</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.RARE_DISEASE}>Rare Disease</CustomCheckboxGroup.Checkbox>
            </div>
          </div>

          {/* Clinical Aspects */}
          <div className="mb-2">
            <p className="text-sm font-semibold mb-1">Clinical Aspects</p>
            <div className="flex flex-row flex-wrap gap-x-4 gap-y-2">
              <CustomCheckboxGroup.Checkbox value={CategoryType.PRIMARY_DIAGNOSIS}>Primary Diagnosis</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.SECONDARY_DIAGNOSIS}>Secondary Diagnosis</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.ACUTE_CARE}>Acute Care</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.CHRONIC_CARE}>Chronic Care</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.PALLIATIVE_CARE}>Palliative Care</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.PREVENTIVE_CARE}>Preventive Care</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.CLINICAL_TRIAL}>Clinical Trial</CustomCheckboxGroup.Checkbox>
            </div>
          </div>

          {/* Treatment Categories */}
          <div className="mb-2">
            <p className="text-sm font-semibold mb-1">Treatment Categories</p>
            <div className="flex flex-row flex-wrap gap-x-4 gap-y-2">
              <CustomCheckboxGroup.Checkbox value={CategoryType.CHEMOTHERAPY}>Chemotherapy</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.IMMUNOTHERAPY}>Immunotherapy</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.TARGETED_THERAPY}>Targeted Therapy</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.HORMONE_THERAPY}>Hormone Therapy</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.RADIATION_THERAPY}>Radiation Therapy</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.SURGICAL}>Surgical</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.COMBINATION_THERAPY}>Combination Therapy</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.EXPERIMENTAL_THERAPY}>Experimental Therapy</CustomCheckboxGroup.Checkbox>
            </div>
          </div>

          {/* Demographic Scope */}
          <div className="mb-2">
            <p className="text-sm font-semibold mb-1">Demographic Scope</p>
            <div className="flex flex-row flex-wrap gap-x-4 gap-y-2">
              <CustomCheckboxGroup.Checkbox value={CategoryType.PEDIATRIC}>Pediatric</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.ADULT}>Adult</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.GERIATRIC}>Geriatric</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.MATERNAL}>Maternal</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.FAMILIAL}>Familial</CustomCheckboxGroup.Checkbox>
            </div>
          </div>

          {/* Anatomical Systems */}
          <div className="mb-2">
            <p className="text-sm font-semibold mb-1">Anatomical Systems</p>
            <div className="flex flex-row flex-wrap gap-x-4 gap-y-2">
              <CustomCheckboxGroup.Checkbox value={CategoryType.CENTRAL_NERVOUS}>Central Nervous</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.PERIPHERAL_NERVOUS}>Peripheral Nervous</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.CARDIAC}>Cardiac</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.VASCULAR}>Vascular</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.RESPIRATION}>Respiration</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.DIGESTIVE}>Digestive</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.HEPATIC}>Hepatic</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.PANCREATIC}>Pancreatic</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.RENAL}>Renal</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.URINARY}>Urinary</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.REPRODUCTIVE}>Reproductive</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.SKELETAL}>Skeletal</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.MUSCULAR}>Muscular</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.INTEGUMENTARY}>Integumentary</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.LYMPHATIC}>Lymphatic</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.ENDOCRINE_THYROID}>Endocrine (Thyroid)</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.ENDOCRINE_ADRENAL}>Endocrine (Adrenal)</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.ENDOCRINE_PITUITARY}>Endocrine (Pituitary)</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.OCULAR}>Ocular</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.AUDITORY}>Auditory</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.ORAL}>Oral</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.JOINT}>Joint</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.HEMATOLOGIC}>Hematologic</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.IMMUNE}>Immune</CustomCheckboxGroup.Checkbox>
            </div>
          </div>
        </CustomCheckboxGroup>
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