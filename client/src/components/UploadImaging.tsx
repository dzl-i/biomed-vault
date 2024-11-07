import React, { ChangeEvent, Dispatch, FormEvent, SetStateAction, useMemo, useState } from "react"
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

export const UploadImaging = ({ onClose, setImagings }: { onClose: () => void, setImagings: Dispatch<SetStateAction<ImagingSummary[]>> }) => {
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
        setImagings(currentImagings => [...currentImagings, newImaging]);

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
        Upload a New Imaging
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

          {/* Imaging Categories */}
          <div className="mb-2">
            <p className="text-sm font-semibold mb-1">Imaging Categories</p>
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
        <Button color="primary" onClick={handleCreateImaging} disabled={isLoading || !readyToSubmit} className="disabled:bg-transparent disabled:border disabled:border-black disabled:text-black disabled:cursor-not-allowed disabled:opacity-50">
          {isLoading ? <Spinner color="default" /> : "Upload Imaging"}
        </Button>
      </ModalFooter>
    </>
  )
}