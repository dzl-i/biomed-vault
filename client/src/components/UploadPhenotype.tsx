import React, { Dispatch, FormEvent, SetStateAction, useMemo, useState } from "react"
import { Button, Chip, Input, ModalBody, ModalFooter, ModalHeader, Spinner, Textarea } from "@nextui-org/react"

import { CategoryType, PhenotypeSummary } from "@/utils/types"
import { CheckboxGroup } from "./CheckboxGroup";
import { PlusCircleIcon, X } from "lucide-react";

interface UploadPhenotypeProps {
  onClose: () => void;
  setPhenotypes: (phenotype: PhenotypeSummary) => void;
  patientId: string;
}

export const UploadPhenotype = ({ onClose, setPhenotypes, patientId }: UploadPhenotypeProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [trait, setTrait] = useState("");
  const [traits, setTraits] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const readyToSubmit = useMemo(
    () => name && description && traits,
    [name, description, traits]
  );

  const handleAddTrait = () => {
    if (trait.trim() && !traits.includes(trait.trim())) {
      setTraits([...traits, trait.trim()]);
      setTrait("");
    }
  };

  const handleRemoveTrait = (trait: string) => {
    setTraits(traits.filter(t => t !== trait));
  };

  const handleCreatePhenotype = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      // Construct an object with the input values
      const phenotypeData = {
        name,
        description,
        traits,
        categories
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/phenotype`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(phenotypeData),
      });

      if (response.ok) {
        const newPhenotype = await response.json();

        // Append the new phenotype to the existing list
        setPhenotypes(newPhenotype);

        // Close the modal
        onClose();

        // Reset the form
        setName("");
        setDescription("");
        setTraits([]);
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
        Upload a New Phenotype Data
      </ModalHeader>
      <ModalBody>
        {/* Phenotype's Name */}
        <Input autoFocus label="Phenotype's Name" placeholder="Enter the phenotype's name" variant="underlined" value={name} onValueChange={setName} />

        {/* Phenotype's Description */}
        <Textarea label="Phenotype's Description" placeholder="Enter phenotype's description" type="text" variant="underlined" minRows={1} value={description} onValueChange={setDescription} />

        {/* Phenotype's Traits */}
        <div className="flex flex-row items-end gap-4">
          <Input label="Phenotype's Traits" placeholder="Enter a phenotype trait" type="text" variant="underlined" value={trait} onValueChange={setTrait} />
          <Button type="button" color="primary" onClick={handleAddTrait} className="shrink-0">
            <PlusCircleIcon />
          </Button>
        </div>

        {/* Selected Traits */}
        <div className="flex flex-wrap gap-2 mb-2">
          {traits.map(trait => (
            <Chip key={trait} variant="flat" color="secondary" className="flex flex-row items-center gap-1" endContent={<X className="h-4 w-4 cursor-pointer" onClick={() => handleRemoveTrait(trait)} />}>
              {trait}
            </Chip>
          ))}
        </div>

        {/* Phenotype's Categories */}
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
        <Button color="danger" variant="flat" onClick={onClose}>
          Close
        </Button>
        <Button color="primary" onClick={handleCreatePhenotype} disabled={isLoading || !readyToSubmit} className="disabled:bg-transparent disabled:border disabled:border-black disabled:text-black disabled:cursor-not-allowed disabled:opacity-50">
          {isLoading ? <Spinner color="default" /> : "Upload Phenotype"}
        </Button>
      </ModalFooter>
    </>
  )
}