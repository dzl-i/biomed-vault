import { Dispatch, SetStateAction } from "react"
import { Button, ModalBody, ModalFooter, ModalHeader } from "@nextui-org/react"

import { CategoryType, PhenotypeSummary } from "@/utils/types"
import { CheckboxGroup } from "./CheckboxGroup";

interface FilterState {
  selectedCategories: string[];
}

interface Props {
  onClose: () => void;
  phenotypes: PhenotypeSummary[];
  setPhenotypes: Dispatch<SetStateAction<PhenotypeSummary[]>>;
  filters: FilterState;
  setFilters: Dispatch<SetStateAction<FilterState>>;
}


export const FilterPhenotype = ({ onClose, phenotypes, setPhenotypes, filters, setFilters }: Props) => {

  const applyFilters = () => {
    let filteredResults = [...phenotypes];

    // Filter by categories if any categories are selected
    if (filters.selectedCategories.length > 0) {
      filteredResults = filteredResults.filter(phenotype =>
        phenotype.categories.some(category =>
          filters.selectedCategories.includes(category)
        )
      );
    }

    setPhenotypes(filteredResults);
    onClose();
  };

  const resetFilters = () => {
    setFilters({
      selectedCategories: []
    });

    setPhenotypes(phenotypes);
    onClose();
  };

  return (
    <>
      <ModalHeader className="flex flex-col gap-1 text-center text-3xl">
        Filter Phenotypes
      </ModalHeader>
      <ModalBody>
        {/* Filter by Categories */}
        <CheckboxGroup value={filters.selectedCategories} onValueChange={(value) => setFilters(prev => ({ ...prev, selectedCategories: value }))}>
          {/* Disease Classifications */}
          <div className="mb-2">
            <p className="text-sm font-semibold mb-1">Disease Classifications</p>
            <div className="flex flex-row flex-wrap gap-x-4 gap-y-2">
              <CheckboxGroup.Checkbox value={CategoryType.ONCOLOGICAL}>Oncological</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.CARDIOVASCULAR}>Cardiovascular</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.NEUROLOGICAL}>Neurological</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.RESPIRATORY}>Respiratory</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.GASTROINTESTINAL}>Gastrointestinal</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.ENDOCRINE}>Endocrine</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.IMMUNOLOGICAL}>Immunological</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.MUSCULOSKELETAL}>Musculoskeletal</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.DERMATOLOGICAL}>Dermatological</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.GENETIC_DISORDER}>Genetic Disorder</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.INFECTIOUS_DISEASE}>Infectious Disease</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.RARE_DISEASE}>Rare Disease</CheckboxGroup.Checkbox>
            </div>
          </div>

          {/* Clinical Aspects */}
          <div className="mb-2">
            <p className="text-sm font-semibold mb-1">Clinical Aspects</p>
            <div className="flex flex-row flex-wrap gap-x-4 gap-y-2">
              <CheckboxGroup.Checkbox value={CategoryType.PRIMARY_DIAGNOSIS}>Primary Diagnosis</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.SECONDARY_DIAGNOSIS}>Secondary Diagnosis</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.ACUTE_CARE}>Acute Care</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.CHRONIC_CARE}>Chronic Care</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.PALLIATIVE_CARE}>Palliative Care</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.PREVENTIVE_CARE}>Preventive Care</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.CLINICAL_TRIAL}>Clinical Trial</CheckboxGroup.Checkbox>
            </div>
          </div>

          {/* Treatment Categories */}
          <div className="mb-2">
            <p className="text-sm font-semibold mb-1">Treatment Categories</p>
            <div className="flex flex-row flex-wrap gap-x-4 gap-y-2">
              <CheckboxGroup.Checkbox value={CategoryType.CHEMOTHERAPY}>Chemotherapy</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.IMMUNOTHERAPY}>Immunotherapy</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.TARGETED_THERAPY}>Targeted Therapy</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.HORMONE_THERAPY}>Hormone Therapy</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.RADIATION_THERAPY}>Radiation Therapy</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.SURGICAL}>Surgical</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.COMBINATION_THERAPY}>Combination Therapy</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.EXPERIMENTAL_THERAPY}>Experimental Therapy</CheckboxGroup.Checkbox>
            </div>
          </div>

          {/* Demographic Scope */}
          <div className="mb-2">
            <p className="text-sm font-semibold mb-1">Demographic Scope</p>
            <div className="flex flex-row flex-wrap gap-x-4 gap-y-2">
              <CheckboxGroup.Checkbox value={CategoryType.PEDIATRIC}>Pediatric</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.ADULT}>Adult</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.GERIATRIC}>Geriatric</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.MATERNAL}>Maternal</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.FAMILIAL}>Familial</CheckboxGroup.Checkbox>
            </div>
          </div>

          {/* Anatomical Systems */}
          <div className="mb-2">
            <p className="text-sm font-semibold mb-1">Anatomical Systems</p>
            <div className="flex flex-row flex-wrap gap-x-4 gap-y-2">
              <CheckboxGroup.Checkbox value={CategoryType.CENTRAL_NERVOUS}>Central Nervous</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.PERIPHERAL_NERVOUS}>Peripheral Nervous</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.CARDIAC}>Cardiac</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.VASCULAR}>Vascular</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.RESPIRATION}>Respiration</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.DIGESTIVE}>Digestive</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.HEPATIC}>Hepatic</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.PANCREATIC}>Pancreatic</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.RENAL}>Renal</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.URINARY}>Urinary</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.REPRODUCTIVE}>Reproductive</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.SKELETAL}>Skeletal</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.MUSCULAR}>Muscular</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.INTEGUMENTARY}>Integumentary</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.LYMPHATIC}>Lymphatic</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.ENDOCRINE_THYROID}>Endocrine (Thyroid)</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.ENDOCRINE_ADRENAL}>Endocrine (Adrenal)</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.ENDOCRINE_PITUITARY}>Endocrine (Pituitary)</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.OCULAR}>Ocular</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.AUDITORY}>Auditory</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.ORAL}>Oral</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.JOINT}>Joint</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.HEMATOLOGIC}>Hematologic</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.IMMUNE}>Immune</CheckboxGroup.Checkbox>
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