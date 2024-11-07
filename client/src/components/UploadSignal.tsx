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
        duration,
        sampleRate,
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
        <Input type="number" step={0.01} label="Signal Duration (in milliseconds)" placeholder="Enter the signal duration (in milliseconds)" variant="underlined" value={duration} onValueChange={setDuration} />

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

          {/* Signal Categories */}
          <div className="mb-2">
            <p className="text-sm font-semibold mb-1">Signal Categories</p>
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
        <Button color="primary" onClick={handleCreateSignal} disabled={isLoading || !readyToSubmit} className="disabled:bg-transparent disabled:border disabled:border-black disabled:text-black disabled:cursor-not-allowed disabled:opacity-50">
          {isLoading ? <Spinner color="default" /> : "Upload Signal"}
        </Button>
      </ModalFooter>
    </>
  )
}