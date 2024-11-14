"use client"

import { Button, Card, CardBody, CardHeader, Chip, Divider, Link, Spinner } from "@nextui-org/react"
import { SignalDetail } from "@/utils/types";
import { useEffect, useState } from "react";
import { InfoIcon, MailIcon, PencilIcon, ActivityIcon } from "lucide-react";
import { SignalVisualization } from "./SignalVisualisation";

const signalTypes = [
  { key: "ECG", label: "Electrocardiography (ECG)" },
  { key: "EEG", label: "Electroencephalography (EEG)" },
  { key: "EMG", label: "Electromyography (EMG)" },
  { key: "EOG", label: "Electrooculography (EOG)" },
];

export const SignalOverview = ({ researcherId, signalId }: { researcherId: string, signalId: string }) => {
  const [signal, setSignal] = useState<SignalDetail | null>(null);
  const [isLoadingSignalOverview, setIsLoadingSignalOverview] = useState(true);

  const getReadableCategoryName = (filter: string): string => {
    return filter
      .split(/[_-]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  useEffect(() => {
    const fetchSignalOverview = async () => {
      try {
        setIsLoadingSignalOverview(true);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/overview/signal/${signalId}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const result = await response.json();
          setSignal(result);
        } else {
          const errorData = await response.json();
          console.error("Failed to fetch signal:", errorData);
        }
      } catch (error) {
        console.error("Error fetching signal:", error);
      } finally {
        setIsLoadingSignalOverview(false);
      }
    };

    fetchSignalOverview();
  }, [signalId]);

  if (isLoadingSignalOverview) {
    return (
      <div className="flex justify-center items-center w-full h-64">
        <Spinner size="lg" label="Fetching signal data..." />
      </div>
    );
  }

  if (!signal) {
    return (
      <div className="flex justify-center items-center w-full h-64">
        <p className="text-lg">No signal data found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-5/6 my-12">
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <div className="flex flex-row items-center gap-4">
          <ActivityIcon size={42} />
          <p className="text-5xl font-extrabold">{signal.name}</p>
        </div>
        <p className="text-foreground-500">Signal ID: {signal.id}</p>
      </div>

      <Divider className="my-8" />

      <div className="flex flex-col gap-6">
        {/* Signal Information */}
        <Card className="pb-1">
          <CardHeader className="flex flex-row w-full px-8">
            <h3 className="text-lg font-bold flex flex-grow">Signal Information</h3>
            <Button color="primary" variant="bordered" className={`${signal.researcherId === researcherId ? "" : "hidden"}`} startContent={<PencilIcon />}>Edit</Button>
          </CardHeader>
          <Divider />
          <CardBody className="px-8 space-y-4">
            <div>
              <h4 className="font-semibold mb-1">Name</h4>
              <p className="text-foreground-600">{signal.name}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Description</h4>
              <p className="text-foreground-600">{signal.description}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Signal Type</h4>
              {signalTypes.find(type => type.key === signal.signalType)?.label || signal.signalType}
            </div>
            <div>
              <h4 className="font-semibold mb-1">Duration (in seconds)</h4>
              <p className="text-foreground-600">{signal.duration}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Sample Rate (in Hertz)</h4>
              <p className="text-foreground-600">{signal.sampleRate}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Signal Visualisation</h4>
              <SignalVisualization dataPoints={signal.dataPoints} />
            </div>
            <div>
              <h4 className="font-semibold mb-1">Categories</h4>
              <div className="flex flex-row gap-2">
                {signal.categories.map((category) => (
                  <Chip color="secondary" variant="flat" key={category}>{getReadableCategoryName(category)}</Chip>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Patient Information */}
        <Card className="pb-1">
          <CardHeader className="flex flex-row w-full px-8">
            <h3 className="text-lg font-bold flex flex-grow">Patient Information</h3>
            <Button color="primary" variant="bordered" className={`${signal.researcherId === researcherId ? "" : "hidden"}`} startContent={<PencilIcon />}>Edit</Button>
          </CardHeader>
          <Divider />
          <CardBody className="px-8 space-y-4">
            <div>
              <h4 className="font-semibold mb-1">View Patient Profile</h4>
              <Link href={`/patient/${signal.patientId}`}><Button color="primary"><InfoIcon />View Profile</Button></Link>
            </div>
          </CardBody>
        </Card>

        {/* Researcher Information */}
        <Card className="pb-1">
          <CardHeader className="flex flex-row w-full px-8">
            <h3 className="text-lg font-bold flex flex-grow">Researcher Information</h3>
            <Button color="primary" variant="bordered" className={`${signal.researcherId === researcherId ? "" : "hidden"}`} startContent={<PencilIcon />}>Edit</Button>
          </CardHeader>
          <Divider />
          <CardBody className="px-8 space-y-4">
            <div>
              <h4 className="font-semibold mb-1">Name</h4>
              <p className="text-foreground-600">{signal.researcherName}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Institution</h4>
              <p className="text-foreground-600">{signal.researcherInstitution}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Email</h4>
              <Link href={`mailto:${signal.researcherEmail}`}><Button color="primary"><MailIcon />{signal.researcherEmail}</Button></Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}