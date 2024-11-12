import React, { ChangeEvent, FormEvent, useMemo, useState } from "react"
import { Button, Input, ModalBody, ModalFooter, ModalHeader, Select, SelectItem, Spinner, Textarea } from "@nextui-org/react"

import { CategoryType, ImagingSummary } from "@/utils/types"
import { CheckboxGroup } from "./CheckboxGroup";

const imagingType = [
  { key: "MRI", label: "Magnetic Resonance Imaging (MRI)" },
  { key: "CT", label: "Computed Tomography Scan (CT Scan)" },
  { key: "XRAY", label: "X-Ray" },
  { key: "ULTRASOUND", label: "Ultrasound" },
  { key: "PETSCAN", label: "Positron Emission Tomography Scan (PET Scan)" },
];

interface UploadImagingProps {
  onClose: () => void;
  setImagings: (phenotype: ImagingSummary) => void;
  patientId: string;
}

export const UploadImaging = ({ onClose, setImagings, patientId }: UploadImagingProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageType, setImageType] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState("");
  const [categories, setCategories] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const readyToSubmit = useMemo(
    () => name && description && imageType && image && imageUrl,
    [name, description, imageType, image, imageUrl]
  );

  const handleSelectImageTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setImageType(e.target.value);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result)
        } else {
          reject(new Error('Failed to convert file to base64'))
        }
      }
      reader.onerror = (error) => reject(error)
    })
  }

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (e.g., limit to 5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      console.error("File size must be less than 5MB", imageFile)
      return
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      console.error("Only JPEG, PNG, and GIF files are allowed")
      return
    }

    try {
      setImageFile(file)
      const base64String = await fileToBase64(file)
      setImage(base64String)
    } catch (err) {
      console.error("Failed to process image")
      console.error(err)
    }
  }

  const handleCreateImaging = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      const imagingData = {
        patientId,
        name,
        description,
        imageType,
        image,
        imageUrl,
        categories
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/imaging`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(imagingData),
      });

      if (response.ok) {
        const newImaging = await response.json();

        // Append the new imaging to the existing list
        setImagings(newImaging);

        // Close the modal
        onClose();

        // Reset the form
        setName("");
        setDescription("");
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
        Upload a New Imaging Data
      </ModalHeader>
      <ModalBody>
        {/* Imaging's Name */}
        <Input autoFocus label="Imaging's Name" placeholder="Enter the imaging's name" variant="underlined" value={name} onValueChange={setName} />

        {/* Imaging's Description */}
        <Textarea label="Imaging's Description" placeholder="Enter imaging's description" type="text" variant="underlined" minRows={1} value={description} onValueChange={setDescription} />

        {/* Imaging Data Type */}
        <Select label="Imaging Data Type" variant="underlined" placeholder="Select a data type" selectedKeys={[imageType]} className="max-w-sm" onChange={handleSelectImageTypeChange}>
          {imagingType.map((type) => (
            <SelectItem key={type.key}>
              {type.label}
            </SelectItem>
          ))}
        </Select>

        {/* File Upload Input */}
        <div className="flex flex-col gap-2 mt-1">
          <label className="text-xs font-medium">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-primary file:text-white
              hover:file:bg-primary/80
              cursor-pointer"
          />
        </div>

        {/* Image's URL */}
        <Input autoFocus label="Image's URL" placeholder="Enter the image's URL" variant="underlined" value={imageUrl} onValueChange={setImageUrl} />

        {/* Imaging's Categories */}
        <CheckboxGroup value={categories} onValueChange={setCategories}>
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
        <Button color="danger" variant="flat" onClick={onClose}>
          Close
        </Button>
        <Button color="primary" onClick={handleCreateImaging} disabled={isLoading || !readyToSubmit} className="disabled:bg-transparent disabled:border disabled:border-black disabled:text-black disabled:cursor-not-allowed disabled:opacity-50">
          {isLoading ? <Spinner color="default" /> : "Upload Imaging"}
        </Button>
      </ModalFooter>
    </>
  )
}