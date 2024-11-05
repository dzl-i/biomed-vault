import { Dispatch, SetStateAction } from "react"
import { Button, Checkbox, CheckboxGroup, ModalBody, ModalFooter, ModalHeader } from "@nextui-org/react"

import { CategoryType, GenomicSummary } from "@/utils/types"
import { CheckboxGroup as CustomCheckboxGroup } from "./CheckboxGroup";

interface FilterState {
  dataType: string[];
  quality: string[];
  categories: string[];
}

interface Props {
  onClose: () => void;
  genomics: GenomicSummary[];
  setGenomics: Dispatch<SetStateAction<GenomicSummary[]>>;
  filters: FilterState;
  setFilters: Dispatch<SetStateAction<FilterState>>;
}


export const FilterGenomic = ({ onClose, genomics, setGenomics, filters, setFilters }: Props) => {

  const applyFilters = () => {
    let filteredResults = [...genomics];

    // Filter by data type if any data type options are selected
    if (filters.dataType.length > 0) {
      filteredResults = filteredResults.filter(patient =>
        filters.dataType.includes(patient.dataType)
      );
    }

    // Filter by data quality if any data quality options are selected
    if (filters.quality.length > 0) {
      filteredResults = filteredResults.filter(patient =>
        filters.quality.includes(patient.quality)
      );
    }

    // Filter by categories if any categories are selected
    if (filters.categories.length > 0) {
      filteredResults = filteredResults.filter(patient =>
        patient.categories.some(category =>
          filters.categories.includes(category)
        )
      );
    }

    setGenomics(filteredResults);
    onClose();
  };

  const resetFilters = () => {
    setFilters({
      dataType: [],
      quality: [],
      categories: []
    });

    setGenomics(genomics);
    onClose();
  };

  return (
    <>
      <ModalHeader className="flex flex-col gap-1 text-center text-3xl">
        Filter Genomics
      </ModalHeader>
      <ModalBody>
        {/* Filter by Data Type */}
        <CheckboxGroup label="Select Data Type" color="primary" value={filters.dataType} onValueChange={(value) => setFilters(prev => ({ ...prev, dataType: value }))} className="mb-4">
          <Checkbox value="WGS">Whole Genome Sequencing (WGS)</Checkbox>
          <Checkbox value="WES">Whole Exome Sequencing (WES)</Checkbox>
          <Checkbox value="RNA">RNA-Sequencing</Checkbox>
          <Checkbox value="TARGETTED">Targeted Sequencing</Checkbox>
        </CheckboxGroup>

        {/* Filter by Data Quality */}
        <CheckboxGroup label="Select Data Quality" color="primary" value={filters.quality} onValueChange={(value) => setFilters(prev => ({ ...prev, quality: value }))} className="mb-4">
          <Checkbox value="UNKNOWN">Unknown</Checkbox>
          <Checkbox value="LOW">Low</Checkbox>
          <Checkbox value="MEDIUM">Medium</Checkbox>
          <Checkbox value="HIGH">High</Checkbox>
        </CheckboxGroup>

        {/* Filter by Categories */}
        <CustomCheckboxGroup value={filters.categories} onValueChange={(value) => setFilters(prev => ({ ...prev, categories: value }))}>
          {/* Disease Categories */}
          <div className="mb-2">
            <p className="text-sm font-semibold mb-1">Disease Categories</p>
            <div className="flex flex-row flex-wrap gap-x-4 gap-y-2">
              <CustomCheckboxGroup.Checkbox value={CategoryType.DISEASE}>Disease</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.CANCER}>Cancer</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.CARDIOVASCULAR}>Cardiovascular</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.NEUROLOGICAL}>Neurological</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.GENETIC}>Genetic</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.METABOLIC}>Metabolic</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.IMMUNOLOGICAL}>Immunological</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.INFECTIOUS}>Infectious</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.DEVELOPMENTAL}>Developmental</CustomCheckboxGroup.Checkbox>
            </div>
          </div>

          {/* Clinical Categories */}
          <div className="mb-2">
            <p className="text-sm font-semibold mb-1">Clinical Categories</p>
            <div className="flex flex-row flex-wrap gap-x-4 gap-y-2">
              <CustomCheckboxGroup.Checkbox value={CategoryType.DIAGNOSIS}>Diagnosis</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.TREATMENT}>Treatment</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.SCREENING}>Screening</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.PREVENTION}>Prevention</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.EMERGENCY}>Emergency</CustomCheckboxGroup.Checkbox>
            </div>
          </div>

          {/* Genomic Categories */}
          <div className="mb-2">
            <p className="text-sm font-semibold mb-1">Genomic Categories</p>
            <div className="flex flex-row flex-wrap gap-x-4 gap-y-2">
              <CustomCheckboxGroup.Checkbox value={CategoryType.SYMPTOM}>Symptom</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.SYNDROME}>Syndrome</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.COMPLICATION}>Complication</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.SIDE_EFFECT}>Side Effect</CustomCheckboxGroup.Checkbox>
            </div>
          </div>

          {/* Genetic Categories */}
          <div className="mb-2">
            <p className="text-sm font-semibold mb-1">Genetic Categories</p>
            <div className="flex flex-row flex-wrap gap-x-4 gap-y-2">
              <CustomCheckboxGroup.Checkbox value={CategoryType.MUTATION}>Mutation</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.VARIANT}>Variant</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.POLYMORPHISM}>Polymorphism</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.DELETION}>Deletion</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.INSERTION}>Insertion</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.FUSION}>Fusion</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.AMPLIFICATION}>Amplification</CustomCheckboxGroup.Checkbox>
            </div>
          </div>

          {/* Treatment Categories */}
          <div className="mb-2">
            <p className="text-sm font-semibold mb-1">Treatment Categories</p>
            <div className="flex flex-row flex-wrap gap-x-4 gap-y-2">
              <CustomCheckboxGroup.Checkbox value={CategoryType.DRUG}>Drug</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.THERAPY}>Therapy</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.SURGERY}>Surgery</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.RADIATION}>Radiation</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.IMMUNOTHERAPY}>Immunotherapy</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.GENE_THERAPY}>Gene Therapy</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.HORMONE_THERAPY}>Hormone Therapy</CustomCheckboxGroup.Checkbox>
            </div>
          </div>

          {/* Demographic Categories */}
          <div className="mb-2">
            <p className="text-sm font-semibold mb-1">Demographic Categories</p>
            <div className="flex flex-row flex-wrap gap-x-4 gap-y-2">
              <CustomCheckboxGroup.Checkbox value={CategoryType.PEDIATRIC}>Pediatric</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.ADULT}>Adult</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.GERIATRIC}>Geriatric</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.MATERNAL}>Maternal</CustomCheckboxGroup.Checkbox>
            </div>
          </div>

          {/* Anatomical Categories */}
          <div className="mb-2">
            <p className="text-sm font-semibold mb-1">Anatomical Categories</p>
            <div className="flex flex-row flex-wrap gap-x-4 gap-y-2">
              <CustomCheckboxGroup.Checkbox value={CategoryType.BRAIN}>Brain</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.HEART}>Heart</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.LUNG}>Lung</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.LIVER}>Liver</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.KIDNEY}>Kidney</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.BONE}>Bone</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.MUSCLE}>Muscle</CustomCheckboxGroup.Checkbox>
              <CustomCheckboxGroup.Checkbox value={CategoryType.BLOOD}>Blood</CustomCheckboxGroup.Checkbox>
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