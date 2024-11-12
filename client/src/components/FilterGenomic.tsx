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
      filteredResults = filteredResults.filter(genomic =>
        filters.dataType.includes(genomic.dataType)
      );
    }

    // Filter by data quality if any data quality options are selected
    if (filters.quality.length > 0) {
      filteredResults = filteredResults.filter(genomic =>
        filters.quality.includes(genomic.quality)
      );
    }

    // Filter by categories if any categories are selected
    if (filters.categories.length > 0) {
      filteredResults = filteredResults.filter(genomic =>
        genomic.categories.some(category =>
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