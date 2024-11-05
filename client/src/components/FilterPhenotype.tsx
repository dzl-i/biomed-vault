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
      filteredResults = filteredResults.filter(patient =>
        patient.categories.some(category =>
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
          {/* Disease Categories */}
          <div className="mb-2">
            <p className="text-sm font-semibold mb-1">Disease Categories</p>
            <div className="flex flex-row flex-wrap gap-x-4 gap-y-2">
              <CheckboxGroup.Checkbox value={CategoryType.DISEASE}>Disease</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.CANCER}>Cancer</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.CARDIOVASCULAR}>Cardiovascular</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.NEUROLOGICAL}>Neurological</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.GENETIC}>Genetic</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.METABOLIC}>Metabolic</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.IMMUNOLOGICAL}>Immunological</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.INFECTIOUS}>Infectious</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.DEVELOPMENTAL}>Developmental</CheckboxGroup.Checkbox>
            </div>
          </div>

          {/* Clinical Categories */}
          <div className="mb-2">
            <p className="text-sm font-semibold mb-1">Clinical Categories</p>
            <div className="flex flex-row flex-wrap gap-x-4 gap-y-2">
              <CheckboxGroup.Checkbox value={CategoryType.DIAGNOSIS}>Diagnosis</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.TREATMENT}>Treatment</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.SCREENING}>Screening</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.PREVENTION}>Prevention</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.EMERGENCY}>Emergency</CheckboxGroup.Checkbox>
            </div>
          </div>

          {/* Phenotype Categories */}
          <div className="mb-2">
            <p className="text-sm font-semibold mb-1">Phenotype Categories</p>
            <div className="flex flex-row flex-wrap gap-x-4 gap-y-2">
              <CheckboxGroup.Checkbox value={CategoryType.SYMPTOM}>Symptom</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.SYNDROME}>Syndrome</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.COMPLICATION}>Complication</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.SIDE_EFFECT}>Side Effect</CheckboxGroup.Checkbox>
            </div>
          </div>

          {/* Genetic Categories */}
          <div className="mb-2">
            <p className="text-sm font-semibold mb-1">Genetic Categories</p>
            <div className="flex flex-row flex-wrap gap-x-4 gap-y-2">
              <CheckboxGroup.Checkbox value={CategoryType.MUTATION}>Mutation</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.VARIANT}>Variant</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.POLYMORPHISM}>Polymorphism</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.DELETION}>Deletion</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.INSERTION}>Insertion</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.FUSION}>Fusion</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.AMPLIFICATION}>Amplification</CheckboxGroup.Checkbox>
            </div>
          </div>

          {/* Treatment Categories */}
          <div className="mb-2">
            <p className="text-sm font-semibold mb-1">Treatment Categories</p>
            <div className="flex flex-row flex-wrap gap-x-4 gap-y-2">
              <CheckboxGroup.Checkbox value={CategoryType.DRUG}>Drug</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.THERAPY}>Therapy</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.SURGERY}>Surgery</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.RADIATION}>Radiation</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.IMMUNOTHERAPY}>Immunotherapy</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.GENE_THERAPY}>Gene Therapy</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.HORMONE_THERAPY}>Hormone Therapy</CheckboxGroup.Checkbox>
            </div>
          </div>

          {/* Demographic Categories */}
          <div className="mb-2">
            <p className="text-sm font-semibold mb-1">Demographic Categories</p>
            <div className="flex flex-row flex-wrap gap-x-4 gap-y-2">
              <CheckboxGroup.Checkbox value={CategoryType.PEDIATRIC}>Pediatric</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.ADULT}>Adult</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.GERIATRIC}>Geriatric</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.MATERNAL}>Maternal</CheckboxGroup.Checkbox>
            </div>
          </div>

          {/* Anatomical Categories */}
          <div className="mb-2">
            <p className="text-sm font-semibold mb-1">Anatomical Categories</p>
            <div className="flex flex-row flex-wrap gap-x-4 gap-y-2">
              <CheckboxGroup.Checkbox value={CategoryType.BRAIN}>Brain</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.HEART}>Heart</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.LUNG}>Lung</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.LIVER}>Liver</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.KIDNEY}>Kidney</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.BONE}>Bone</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.MUSCLE}>Muscle</CheckboxGroup.Checkbox>
              <CheckboxGroup.Checkbox value={CategoryType.BLOOD}>Blood</CheckboxGroup.Checkbox>
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