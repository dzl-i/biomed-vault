"use client"

import { Button, Card, CardBody, CardHeader, Chip, Divider, Link, Spinner } from "@nextui-org/react"
import { ImagingDetail } from "@/utils/types";
import { useEffect, useState } from "react";
import { InfoIcon, MailIcon, PencilIcon, ActivityIcon } from "lucide-react";
import Image from "next/image";

const imagingTypes = [
  { key: "MRI", label: "Magnetic Resonance Imaging (MRI)" },
  { key: "CT", label: "Computed Tomography Scan (CT Scan)" },
  { key: "XRAY", label: "X-Ray" },
  { key: "ULTRASOUND", label: "Ultrasound" },
  { key: "PETSCAN", label: "Positron Emission Tomography Scan (PET Scan)" },
];

export const ImagingOverview = ({ researcherId, imagingId }: { researcherId: string, imagingId: string }) => {
  const [imaging, setImaging] = useState<ImagingDetail | null>(null);
  const [isLoadingImagingOverview, setIsLoadingImagingOverview] = useState(true);

  const getReadableCategoryName = (filter: string): string => {
    return filter
      .split(/[_-]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  useEffect(() => {
    const fetchImagingOverview = async () => {
      try {
        setIsLoadingImagingOverview(true);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/overview/imaging/${imagingId}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const result = await response.json();
          setImaging(result);
        } else {
          const errorData = await response.json();
          console.error("Failed to fetch imaging:", errorData);
        }
      } catch (error) {
        console.error("Error fetching imaging:", error);
      } finally {
        setIsLoadingImagingOverview(false);
      }
    };

    fetchImagingOverview();
  }, [imagingId]);

  const renderBase64Image = (base64String: string) => {
    if (!base64String) return null;

    const imageSource = base64String.startsWith('data:image/')
      ? base64String
      : `data:image/png;base64,${base64String}`;

    return (
      <Image
        src={imageSource}
        alt="Image"
        className="max-w-full h-auto rounded-lg shadow-lg"
        width={1000}
        height={1000}
      />
    );
  }

  if (isLoadingImagingOverview) {
    return (
      <div className="flex justify-center items-center w-full h-64">
        <Spinner size="lg" label="Fetching imaging data..." />
      </div>
    );
  }

  if (!imaging) {
    return (
      <div className="flex justify-center items-center w-full h-64">
        <p className="text-lg">No imaging data found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-5/6 my-12">
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <div className="flex flex-row items-center gap-4">
          <ActivityIcon size={42} />
          <p className="text-5xl font-extrabold">{imaging.name}</p>
        </div>
        <p className="text-foreground-500">Imaging ID: {imaging.id}</p>
      </div>

      <Divider className="my-8" />

      <div className="flex flex-col gap-6">
        {/* Imaging Information */}
        <Card className="pb-1">
          <CardHeader className="flex flex-row w-full px-8">
            <h3 className="text-lg font-bold flex flex-grow">Imaging Information</h3>
            <Button color="primary" variant="bordered" className={`${imaging.researcherId === researcherId ? "" : "hidden"}`} startContent={<PencilIcon />}>Edit</Button>
          </CardHeader>
          <Divider />
          <CardBody className="px-8 space-y-4">
            <div>
              <h4 className="font-semibold mb-1">Name</h4>
              <p className="text-foreground-600">{imaging.name}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Description</h4>
              <p className="text-foreground-600">{imaging.description}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Imaging Type</h4>
              {imagingTypes.find(type => type.key === imaging.imageType)?.label || imaging.imageType}
            </div>
            <div>
              <h4 className="font-semibold mb-1">Image URL</h4>
              <Link href={`${imaging.imageUrl}`} className="hover:underline">{imaging.imageUrl}</Link>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Image</h4>
              <div>{renderBase64Image(imaging.image)}</div>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Categories</h4>
              <div className="flex flex-row gap-2">
                {imaging.categories.map((category) => (
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
            <Button color="primary" variant="bordered" className={`${imaging.researcherId === researcherId ? "" : "hidden"}`} startContent={<PencilIcon />}>Edit</Button>
          </CardHeader>
          <Divider />
          <CardBody className="px-8 space-y-4">
            <div>
              <h4 className="font-semibold mb-1">View Patient Profile</h4>
              <Link href={`/patient/${imaging.patientId}`}><Button color="primary"><InfoIcon />View Profile</Button></Link>
            </div>
          </CardBody>
        </Card>

        {/* Researcher Information */}
        <Card className="pb-1">
          <CardHeader className="flex flex-row w-full px-8">
            <h3 className="text-lg font-bold flex flex-grow">Researcher Information</h3>
            <Button color="primary" variant="bordered" className={`${imaging.researcherId === researcherId ? "" : "hidden"}`} startContent={<PencilIcon />}>Edit</Button>
          </CardHeader>
          <Divider />
          <CardBody className="px-8 space-y-4">
            <div>
              <h4 className="font-semibold mb-1">Name</h4>
              <p className="text-foreground-600">{imaging.researcherName}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Institution</h4>
              <p className="text-foreground-600">{imaging.researcherInstitution}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Email</h4>
              <Link href={`mailto:${imaging.researcherEmail}`}><Button color="primary"><MailIcon />{imaging.researcherEmail}</Button></Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}