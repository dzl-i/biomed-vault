import React, { ChangeEvent, FormEvent, useMemo, useState } from "react"
import { Button, Input, ModalBody, ModalFooter, ModalHeader, Select, SelectItem, Spinner, Textarea } from "@nextui-org/react"

import { CategoryType, SignalSummary } from "@/utils/types"
import { CheckboxGroup } from "./CheckboxGroup";
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";

type ChartDataPoint = {
  time: number;
  value: number;
};

type TimeSeriesData = {
  [key: string]: number;
};

const signalTypes = [
  { key: "ECG", label: "Electrocardiography (ECG)" },
  { key: "EEG", label: "Electroencephalography (EEG)" },
  { key: "EMG", label: "Electromyography (EMG)" },
  { key: "EOG", label: "Electrooculography (EOG)" },
];

interface UploadSignalProps {
  onClose: () => void;
  setSignals: (phenotype: SignalSummary) => void;
  patientId: string;
}

export const UploadSignal = ({ onClose, setSignals, patientId }: UploadSignalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [signalType, setSignalType] = useState("");
  const [duration, setDuration] = useState("");
  const [sampleRate, setSampleRate] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [previewData, setPreviewData] = useState<ChartDataPoint[] | null>(null);
  const [dataPoints, setDataPoints] = useState("");
  const [categories, setCategories] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const readyToSubmit = useMemo(
    () => name && description && signalType && duration && sampleRate && file,
    [name, description, signalType, duration, sampleRate, file]
  );

  const handleSelectSignalTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSignalType(e.target.value);
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFile(file);
    setFileName(file.name);

    try {
      const text = await file.text();
      const data = JSON.parse(text) as TimeSeriesData;

      // Validate data format
      if (typeof data !== 'object' || data === null) {
        throw new Error('Data must be an object with time-value pairs');
      }

      // Convert to array format for charting
      const chartData: ChartDataPoint[] = Object.entries(data).map(([time, value]) => ({
        time: parseFloat(time),
        value: value
      }));

      // Sort by time
      chartData.sort((a, b) => a.time - b.time);

      setPreviewData(chartData);
      setDataPoints(JSON.stringify(chartData));
    } catch (error) {
      console.error('Invalid file format. Please upload a JSON file with time-value pairs', error);
      setPreviewData(null);
    }
  };

  const handleCreateSignal = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      // Construct an object with the input values
      const signalData = {
        patientId,
        name,
        description,
        signalType,
        duration: parseFloat(duration),
        sampleRate: parseFloat(sampleRate),
        dataPoints,
        categories
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/signal`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signalData),
      });

      if (response.ok) {
        const newSignal = await response.json();

        // Append the new signal to the existing list
        setSignals(newSignal);

        // Close the modal
        onClose();

        // Reset the form
        setName("");
        setDescription("");
        setSignalType("");
        setDuration("");
        setSampleRate("");
        setFile(null);
        setFileName("");
        setPreviewData(null);
        setDataPoints("");
        setCategories([]);
      } else {
        const errorData = await response.json();
        console.error(errorData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ModalHeader className="flex flex-col gap-1 text-center text-3xl">
        Upload a New Signal Data
      </ModalHeader>
      <ModalBody>
        {/* Signal Name */}
        <Input autoFocus label="Signal Name" placeholder="Enter the signal name" variant="underlined" value={name} onValueChange={setName} />

        {/* Signal Description */}
        <Textarea label="Signal Description" placeholder="Enter signal description" type="text" variant="underlined" minRows={1} value={description} onValueChange={setDescription} />

        {/* Signal Data Type */}
        <Select label="Signal Data Type" variant="underlined" placeholder="Select a data type" selectedKeys={[signalType]} className="max-w-sm" onChange={handleSelectSignalTypeChange}>
          {signalTypes.map((type) => (
            <SelectItem key={type.key}>
              {type.label}
            </SelectItem>
          ))}
        </Select>

        {/* Signal Duration */}
        <Input type="number" step={0.01} label="Signal Duration (in seconds)" placeholder="Enter the signal duration (in seconds)" variant="underlined" value={duration} onValueChange={setDuration} />

        {/* Signal Sample Rate */}
        <Input type="number" step={0.01} label="Signal Sample Rate (in Hertz)" placeholder="Enter the signal sample rate (in Hertz)" variant="underlined" value={sampleRate} onValueChange={setSampleRate} />

        {/* Signal Sample Rate */}
        <div className="group relative w-full mt-1">
          <label className="flex flex-col gap-1.5">
            <span className="block text-sm">
              Signal Data File (JSON)
            </span>
            <div className="relative flex items-center gap-3">
              <button type="button" className="px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors relative overflow-hidden cursor-pointer">
                Choose File
                <input type="file" accept=".json" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              </button>
              <span className="text-sm text-foreground-500">
                {fileName || "No file selected"}
              </span>
            </div>
            <p className="text-sm">Upload a JSON file with time-value pairs (e.g. &quot;0&quot;: 1.0, &quot;100&quot;: 1.5)</p>
          </label>
        </div>

        {previewData && (
          <div className="space-y-2">
            <p className="text-sm">Data Preview</p>
            <div className="border rounded-lg p-4 bg-white">
              <LineChart width={700} height={300} data={previewData} margin={{ top: 20, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="time"
                  label={{ value: 'Time (ms)', position: 'bottom' }}
                />
                <YAxis
                  label={{ value: 'Value', angle: -90, position: 'left' }}
                />
                <Tooltip />
                <Line type="linear" dataKey="value" stroke="#2563eb" dot={false} />
              </LineChart>
            </div>
          </div>
        )}

        {/* Signal Categories */}
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
        <Button color="primary" onClick={handleCreateSignal} disabled={isLoading || !readyToSubmit} className="disabled:bg-transparent disabled:border disabled:border-black disabled:text-black disabled:cursor-not-allowed disabled:opacity-50">
          {isLoading ? <Spinner color="default" /> : "Upload Signal"}
        </Button>
      </ModalFooter>
    </>
  )
}