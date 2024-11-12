import React, { Dispatch, FormEvent, SetStateAction, useMemo, useState } from "react"
import { Button, DatePicker, Input, ModalBody, ModalFooter, ModalHeader, Radio, RadioGroup, Spinner, Textarea } from "@nextui-org/react"
import { getLocalTimeZone, today } from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";

import { CategoryType, PatientSummary } from "@/utils/types"
import { CheckboxGroup } from "./CheckboxGroup";

export const UploadPatient = ({ onClose, setPatients }: { onClose: () => void, setPatients: Dispatch<SetStateAction<PatientSummary[]>> }) => {
  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(today(getLocalTimeZone()));
  const [sex, setSex] = useState("");
  const [diagnosticInfo, setDiagnosticInfo] = useState("");
  const [treatmentInfo, setTreatmentInfo] = useState("");
  const [categories, setCategories] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const readyToSubmit = useMemo(
    () => name && dateOfBirth && sex && diagnosticInfo,
    [name, dateOfBirth, sex, diagnosticInfo]
  );

  const handleCreatePatient = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      // Construct an object with the input values
      const patientData = {
        name,
        dateOfBirth: new Date(dateOfBirth.toString()).toISOString(),
        sex,
        diagnosticInfo,
        treatmentInfo,
        categories
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/patient`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patientData),
      });

      if (response.ok) {
        const newPatient = await response.json();

        // Append the new patient to the existing list
        setPatients(currentPatients => [...currentPatients, newPatient]);

        // Close the modal
        onClose();

        // Reset the form
        setName("");
        setDateOfBirth(today(getLocalTimeZone()));
        setSex("");
        setDiagnosticInfo("");
        setTreatmentInfo("");
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
        Upload a New Patient
      </ModalHeader>
      <ModalBody>
        {/* Patient's Name */}
        <Input autoFocus label="Patient's Name" placeholder="Enter the patient's name" variant="underlined" value={name} onValueChange={setName} />

        {/* Patient's Date of Birth */}
        <div className="flex flex-col gap-4">
          <I18nProvider locale="en-GB">
            <DatePicker showMonthAndYearPickers variant="underlined" label="Patient's Date of Birth" maxValue={today(getLocalTimeZone())} value={dateOfBirth} onChange={setDateOfBirth} />
          </I18nProvider>
        </div>

        {/* Patient's Sex */}
        <RadioGroup value={sex} onValueChange={setSex}>
          <p className="text-sm">Patient&apos;s Sex</p>
          <Radio value="MALE">Male</Radio>
          <Radio value="FEMALE">Female</Radio>
          <Radio value="OTHER">Other</Radio>
        </RadioGroup>

        {/* Patient's Diagnostic Information */}
        <Textarea label="Patient's Diagnostic Information" placeholder="Enter patient's diagnostic information" type="text" variant="underlined" minRows={1} value={diagnosticInfo} onValueChange={setDiagnosticInfo} />

        {/* Patient's Treatment Information */}
        <Textarea label="Patient's Treatment Information" placeholder="Enter patient's treatment information" type="text" variant="underlined" minRows={1} value={treatmentInfo} onValueChange={setTreatmentInfo} />

        {/* Patient's Categories */}
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
        <Button color="primary" onClick={handleCreatePatient} disabled={isLoading || !readyToSubmit} className="disabled:bg-transparent disabled:border disabled:border-black disabled:text-black disabled:cursor-not-allowed disabled:opacity-50">
          {isLoading ? <Spinner color="default" /> : "Upload Patient"}
        </Button>
      </ModalFooter>
    </>
  )
}