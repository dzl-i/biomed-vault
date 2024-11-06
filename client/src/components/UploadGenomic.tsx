import React, { ChangeEvent, Dispatch, FormEvent, SetStateAction, useMemo, useState } from "react"
import { Button, Chip, Input, ModalBody, ModalFooter, ModalHeader, Select, SelectItem, Spinner, Textarea } from "@nextui-org/react"

import { CategoryType, GenomicSummary } from "@/utils/types"
import { CheckboxGroup } from "./CheckboxGroup";
import { PlusCircleIcon, X } from "lucide-react";

const dataTypes = [
  { key: "WGS", label: "Whole Genome Sequencing (WGS)" },
  { key: "WES", label: "Whole Exome Sequencing (WES)" },
  { key: "RNA", label: "RNA-Sequencing" },
  { key: "TARGETTED", label: "Targeted Sequencing" },
];

const qualities = [
  { key: "UNKNOWN", label: "Unknown" },
  { key: "LOW", label: "Low" },
  { key: "MEDIUM", label: "Medium" },
  { key: "HIGH", label: "High" },
];

export const UploadGenomic = ({ onClose, setGenomics }: { onClose: () => void, setGenomics: Dispatch<SetStateAction<GenomicSummary[]>> }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dataType, setDataType] = useState("");
  const [geneName, setGeneName] = useState("");
  const [geneNames, setGeneNames] = useState<string[]>([]);
  const [mutationType, setMutationType] = useState("");
  const [mutationTypes, setMutationTypes] = useState<string[]>([]);
  const [impact, setImpact] = useState("");
  const [impacts, setImpacts] = useState<string[]>([]);
  const [rawDataUrl, setRawDataUrl] = useState("");
  const [quality, setQuality] = useState("");
  const [categories, setCategories] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const readyToSubmit = useMemo(
    () => name && description && geneNames && mutationTypes && impacts && rawDataUrl && quality,
    [name, description, geneNames, mutationTypes, impacts, rawDataUrl, quality]
  );

  const handleSelectDataTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setDataType(e.target.value);
  };

  const handleSelectDataQualityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setQuality(e.target.value);
  };

  const handleAddGeneName = () => {
    if (geneName.trim() && !geneNames.includes(geneName.trim())) {
      setGeneNames([...geneNames, geneName.trim()]);
      setGeneName("");
    }
  };

  const handleRemoveGeneName = (geneName: string) => {
    setGeneNames(geneNames.filter(t => t !== geneName));
  };

  const handleAddMutationType = () => {
    if (mutationType.trim() && !mutationTypes.includes(mutationType.trim())) {
      setMutationTypes([...mutationTypes, mutationType.trim()]);
      setMutationType("");
    }
  };

  const handleRemoveMutationType = (mutationType: string) => {
    setMutationTypes(mutationTypes.filter(t => t !== mutationType));
  };

  const handleAddImpact = () => {
    if (impact.trim() && !impacts.includes(impact.trim())) {
      setImpacts([...impacts, impact.trim()]);
      setImpact("");
    }
  };

  const handleRemoveImpact = (impact: string) => {
    setImpacts(impacts.filter(t => t !== impact));
  };

  const handleCreateGenomic = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      // Construct an object with the input values
      const genomicData = {
        name,
        description,
        dataType,
        geneNames,
        mutationTypes,
        impacts,
        rawDataUrl,
        quality,
        categories
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/genomic`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(genomicData),
      });

      if (response.ok) {
        const newGenomic = await response.json();

        // Append the new genomic to the existing list
        setGenomics(currentGenomics => [...currentGenomics, newGenomic]);

        // Close the modal
        onClose();

        // Reset the form
        setName("");
        setDescription("");
        setDataType("");
        setGeneNames([]);
        setMutationTypes([]);
        setImpacts([]);
        setQuality("");
        setCategories([]);
      } else {
        // Handle error response from the API
        const errorData = await response.json();
        console.error(errorData);  // Set the error message received from backend
      }
    } catch (error) {
      // Handle any other errors
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ModalHeader className="flex flex-col gap-1 text-center text-3xl">
        Upload a New Genomic
      </ModalHeader>
      <ModalBody>
        {/* Genomic's Name */}
        <Input autoFocus label="Genomic's Name" placeholder="Enter the genomic's name" variant="underlined" value={name} onValueChange={setName} />

        {/* Genomic's Description */}
        <Textarea label="Genomic's Description" placeholder="Enter genomic's description" type="text" variant="underlined" minRows={1} value={description} onValueChange={setDescription} />

        {/* Genomic's Data Type */}
        <Select label="Genomic's Data Type" variant="underlined" placeholder="Select a data type" selectedKeys={[dataType]} className="max-w-sm" onChange={handleSelectDataTypeChange}>
          {dataTypes.map((type) => (
            <SelectItem key={type.key}>
              {type.label}
            </SelectItem>
          ))}
        </Select>

        {/* Genomic's Gene Name */}
        <div className="flex flex-row items-end gap-4">
          <Input label="Genomic's Gene Name" placeholder="Enter a genomic gene name" type="text" variant="underlined" value={geneName} onValueChange={setGeneName} />
          <Button type="button" color="primary" onClick={handleAddGeneName} className="shrink-0">
            <PlusCircleIcon />
          </Button>
        </div>

        {/* Selected Gene Names */}
        <div className={`flex flex-wrap gap-2 mb-2 ${geneNames.length === 0 ? "hidden" : ""}`}>
          {geneNames.map(geneName => (
            <Chip key={geneName} variant="flat" color="secondary" className="flex flex-row items-center gap-1" endContent={<X className="h-4 w-4 cursor-pointer" onClick={() => handleRemoveGeneName(geneName)} />}>
              {geneName}
            </Chip>
          ))}
        </div>

        {/* Genomic's Mutation Type */}
        <div className="flex flex-row items-end gap-4">
          <Input label="Genomic's Mutation Type" placeholder="Enter a genomic mutation type" type="text" variant="underlined" value={mutationType} onValueChange={setMutationType} />
          <Button type="button" color="primary" onClick={handleAddMutationType} className="shrink-0">
            <PlusCircleIcon />
          </Button>
        </div>

        {/* Selected Mutation Types */}
        <div className={`flex flex-wrap gap-2 mb-2 ${mutationTypes.length === 0 ? "hidden" : ""}`}>
          {mutationTypes.map(mutationType => (
            <Chip key={mutationType} variant="flat" color="secondary" className="flex flex-row items-center gap-1" endContent={<X className="h-4 w-4 cursor-pointer" onClick={() => handleRemoveMutationType(mutationType)} />}>
              {mutationType}
            </Chip>
          ))}
        </div>

        {/* Genomic's Impact */}
        <div className="flex flex-row items-end gap-4">
          <Input label="Genomic's Impact" placeholder="Enter a genomic impact" type="text" variant="underlined" value={impact} onValueChange={setImpact} />
          <Button type="button" color="primary" onClick={handleAddImpact} className="shrink-0">
            <PlusCircleIcon />
          </Button>
        </div>

        {/* Selected Impacts */}
        <div className={`flex flex-wrap gap-2 mb-2 ${impacts.length === 0 ? "hidden" : ""}`}>
          {impacts.map(impact => (
            <Chip key={impact} variant="flat" color="secondary" className="flex flex-row items-center gap-1" endContent={<X className="h-4 w-4 cursor-pointer" onClick={() => handleRemoveImpact(impact)} />}>
              {impact}
            </Chip>
          ))}
        </div>

        {/* Genomic's Raw Data Url */}
        <Input label="Genomic's Raw Data URL" placeholder="Enter the genomic's raw data URL" variant="underlined" value={rawDataUrl} onValueChange={setRawDataUrl} />

        {/* Genomic's Data Quality */}
        <Select label="Genomic's Data Quality" variant="underlined" placeholder="Select the data's quality" selectedKeys={[quality]} className="max-w-sm mb-2" onChange={handleSelectDataQualityChange}>
          {qualities.map((quality) => (
            <SelectItem key={quality.key}>
              {quality.label}
            </SelectItem>
          ))}
        </Select>

        {/* Genomic's Categories */}
        <CheckboxGroup value={categories} onValueChange={setCategories}>
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

          {/* Genomic Categories */}
          <div className="mb-2">
            <p className="text-sm font-semibold mb-1">Genomic Categories</p>
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
      </ModalBody >
      <ModalFooter className="justify-center gap-4">
        <Button color="danger" variant="flat" onClick={onClose}>
          Close
        </Button>
        <Button color="primary" onClick={handleCreateGenomic} disabled={isLoading || !readyToSubmit} className="disabled:bg-transparent disabled:border disabled:border-black disabled:text-black disabled:cursor-not-allowed disabled:opacity-50">
          {isLoading ? <Spinner color="default" /> : "Upload Genomic"}
        </Button>
      </ModalFooter>
    </>
  )
}