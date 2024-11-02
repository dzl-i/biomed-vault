import React, { Dispatch, FormEvent, SetStateAction, useMemo, useState } from "react"
import { Button, Checkbox, CheckboxGroup, DatePicker, Input, ModalBody, ModalFooter, ModalHeader, Radio, RadioGroup, Spinner, Textarea } from "@nextui-org/react"
import { getLocalTimeZone, today } from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";

import { CategoryType, PatientSummary } from "@/utils/types"

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
        <CheckboxGroup color="primary" value={categories} onValueChange={setCategories}>
          {/* Disease Categories */}
          <div className="mb-2">
            <p className="text-sm font-semibold mb-1">Disease Categories</p>
            <div className="flex flex-row flex-wrap gap-x-4 gap-y-2">
              <Checkbox value={CategoryType.DISEASE}>Disease</Checkbox>
              <Checkbox value={CategoryType.CANCER}>Cancer</Checkbox>
              <Checkbox value={CategoryType.CARDIOVASCULAR}>Cardiovascular</Checkbox>
              <Checkbox value={CategoryType.NEUROLOGICAL}>Neurological</Checkbox>
              <Checkbox value={CategoryType.GENETIC}>Genetic</Checkbox>
              <Checkbox value={CategoryType.METABOLIC}>Metabolic</Checkbox>
              <Checkbox value={CategoryType.IMMUNOLOGICAL}>Immunological</Checkbox>
              <Checkbox value={CategoryType.INFECTIOUS}>Infectious</Checkbox>
              <Checkbox value={CategoryType.DEVELOPMENTAL}>Developmental</Checkbox>
            </div>
          </div>

          {/* Clinical Categories */}
          <div className="mb-2">
            <p className="text-sm font-semibold mb-1">Clinical Categories</p>
            <div className="flex flex-row flex-wrap gap-x-4 gap-y-2">
              <Checkbox value={CategoryType.DIAGNOSIS}>Diagnosis</Checkbox>
              <Checkbox value={CategoryType.TREATMENT}>Treatment</Checkbox>
              <Checkbox value={CategoryType.SCREENING}>Screening</Checkbox>
              <Checkbox value={CategoryType.PREVENTION}>Prevention</Checkbox>
              <Checkbox value={CategoryType.EMERGENCY}>Emergency</Checkbox>
            </div>
          </div>

          {/* Phenotype Categories */}
          <div className="mb-2">
            <p className="text-sm font-semibold mb-1">Phenotype Categories</p>
            <div className="flex flex-row flex-wrap gap-x-4 gap-y-2">
              <Checkbox value={CategoryType.SYMPTOM}>Symptom</Checkbox>
              <Checkbox value={CategoryType.SYNDROME}>Syndrome</Checkbox>
              <Checkbox value={CategoryType.COMPLICATION}>Complication</Checkbox>
              <Checkbox value={CategoryType.SIDE_EFFECT}>Side Effect</Checkbox>
            </div>
          </div>

          {/* Genetic Categories */}
          <div className="mb-2">
            <p className="text-sm font-semibold mb-1">Genetic Categories</p>
            <div className="flex flex-row flex-wrap gap-x-4 gap-y-2">
              <Checkbox value={CategoryType.MUTATION}>Mutation</Checkbox>
              <Checkbox value={CategoryType.VARIANT}>Variant</Checkbox>
              <Checkbox value={CategoryType.POLYMORPHISM}>Polymorphism</Checkbox>
              <Checkbox value={CategoryType.DELETION}>Deletion</Checkbox>
              <Checkbox value={CategoryType.INSERTION}>Insertion</Checkbox>
              <Checkbox value={CategoryType.FUSION}>Fusion</Checkbox>
              <Checkbox value={CategoryType.AMPLIFICATION}>Amplification</Checkbox>
            </div>
          </div>

          {/* Treatment Categories */}
          <div className="mb-2">
            <p className="text-sm font-semibold mb-1">Treatment Categories</p>
            <div className="flex flex-row flex-wrap gap-x-4 gap-y-2">
              <Checkbox value={CategoryType.DRUG}>Drug</Checkbox>
              <Checkbox value={CategoryType.THERAPY}>Therapy</Checkbox>
              <Checkbox value={CategoryType.SURGERY}>Surgery</Checkbox>
              <Checkbox value={CategoryType.RADIATION}>Radiation</Checkbox>
              <Checkbox value={CategoryType.IMMUNOTHERAPY}>Immunotherapy</Checkbox>
              <Checkbox value={CategoryType.GENE_THERAPY}>Gene Therapy</Checkbox>
              <Checkbox value={CategoryType.HORMONE_THERAPY}>Hormone Therapy</Checkbox>
            </div>
          </div>

          {/* Demographic Categories */}
          <div className="mb-2">
            <p className="text-sm font-semibold mb-1">Demographic Categories</p>
            <div className="flex flex-row flex-wrap gap-x-4 gap-y-2">
              <Checkbox value={CategoryType.PEDIATRIC}>Pediatric</Checkbox>
              <Checkbox value={CategoryType.ADULT}>Adult</Checkbox>
              <Checkbox value={CategoryType.GERIATRIC}>Geriatric</Checkbox>
              <Checkbox value={CategoryType.MATERNAL}>Maternal</Checkbox>
            </div>
          </div>

          {/* Anatomical Categories */}
          <div className="mb-2">
            <p className="text-sm font-semibold mb-1">Anatomical Categories</p>
            <div className="flex flex-row flex-wrap gap-x-4 gap-y-2">
              <Checkbox value={CategoryType.BRAIN}>Brain</Checkbox>
              <Checkbox value={CategoryType.HEART}>Heart</Checkbox>
              <Checkbox value={CategoryType.LUNG}>Lung</Checkbox>
              <Checkbox value={CategoryType.LIVER}>Liver</Checkbox>
              <Checkbox value={CategoryType.KIDNEY}>Kidney</Checkbox>
              <Checkbox value={CategoryType.BONE}>Bone</Checkbox>
              <Checkbox value={CategoryType.MUSCLE}>Muscle</Checkbox>
              <Checkbox value={CategoryType.BLOOD}>Blood</Checkbox>
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