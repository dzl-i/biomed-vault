"use client"

import { Button, Card, CardBody, CardHeader, Chip, Divider, Link, Spinner } from "@nextui-org/react"
import { GenomicDetail } from "@/utils/types";
import { useEffect, useState } from "react";
import { InfoIcon, MailIcon, PencilIcon, SyringeIcon } from "lucide-react";

const dataTypes = [
  { key: "WGS", label: "Whole Genome Sequencing (WGS)" },
  { key: "WES", label: "Whole Exome Sequencing (WES)" },
  { key: "RNA", label: "RNA-Sequencing" },
  { key: "TARGETTED", label: "Targeted Sequencing" },
];

export const GenomicOverview = ({ researcherId, genomicId }: { researcherId: string, genomicId: string }) => {
  const [genomic, setGenomic] = useState<GenomicDetail | null>(null);
  const [isLoadingGenomicOverview, setIsLoadingGenomicOverview] = useState(true);

  const getReadableCategoryName = (filter: string): string => {
    return filter
      .split(/[_-]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  useEffect(() => {
    const fetchGenomicOverview = async () => {
      try {
        setIsLoadingGenomicOverview(true);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/overview/genomic/${genomicId}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const result = await response.json();
          setGenomic(result);
        } else {
          const errorData = await response.json();
          console.error("Failed to fetch genomic:", errorData);
        }
      } catch (error) {
        console.error("Error fetching genomic:", error);
      } finally {
        setIsLoadingGenomicOverview(false);
      }
    };

    fetchGenomicOverview();
  }, [genomicId]);

  if (isLoadingGenomicOverview) {
    return (
      <div className="flex justify-center items-center w-full h-64">
        <Spinner size="lg" label="Fetching genomic data..." />
      </div>
    );
  }

  if (!genomic) {
    return (
      <div className="flex justify-center items-center w-full h-64">
        <p className="text-lg">No genomic data found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-5/6 my-12">
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <div className="flex flex-row items-center gap-4">
          <SyringeIcon size={42} />
          <p className="text-5xl font-extrabold">{genomic.name}</p>
        </div>
        <p className="text-foreground-500">Genomic ID: {genomic.id}</p>
      </div>

      <Divider className="my-8" />

      <div className="flex flex-col gap-6">
        {/* Genomic Information */}
        <Card className="pb-1">
          <CardHeader className="flex flex-row w-full px-8">
            <h3 className="text-lg font-bold flex flex-grow">Genomic Information</h3>
            <Button color="primary" variant="bordered" className={`${genomic.researcherId === researcherId ? "" : "hidden"}`} startContent={<PencilIcon />}>Edit</Button>
          </CardHeader>
          <Divider />
          <CardBody className="px-8 space-y-4">
            <div>
              <h4 className="font-semibold mb-1">Name</h4>
              <p className="text-foreground-600">{genomic.name}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Description</h4>
              <p className="text-foreground-600">{genomic.description}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Data Type</h4>
              {dataTypes.find(type => type.key === genomic.dataType)?.label || genomic.dataType}
            </div>
            <div>
              <h4 className="font-semibold mb-1">Gene Names</h4>
              <div className="flex flex-row gap-2">
                {genomic.geneNames.map((geneName) => (
                  <Chip color="warning" variant="flat" key={geneName}>{geneName}</Chip>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Mutation Types</h4>
              <div className="flex flex-row gap-2">
                {genomic.mutationTypes.map((mutationType) => (
                  <Chip color="warning" variant="flat" key={mutationType}>{mutationType}</Chip>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Impacts</h4>
              <div className="flex flex-row gap-2">
                {genomic.impacts.map((impact) => (
                  <Chip color="warning" variant="flat" key={impact}>{impact}</Chip>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Raw Data URL</h4>
              <Link href={`${genomic.rawDataUrl}`} className="hover:underline">{genomic.rawDataUrl}</Link>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Data Quality</h4>
              <p className="text-foreground-600">{genomic.quality}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Categories</h4>
              <div className="flex flex-row gap-2">
                {genomic.categories.map((category) => (
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
            <Button color="primary" variant="bordered" className={`${genomic.researcherId === researcherId ? "" : "hidden"}`} startContent={<PencilIcon />}>Edit</Button>
          </CardHeader>
          <Divider />
          <CardBody className="px-8 space-y-4">
            <div>
              <h4 className="font-semibold mb-1">View Patient Profile</h4>
              <Link href={`/patient/${genomic.patientId}`}><Button color="primary"><InfoIcon />View Profile</Button></Link>
            </div>
          </CardBody>
        </Card>

        {/* Researcher Information */}
        <Card className="pb-1">
          <CardHeader className="flex flex-row w-full px-8">
            <h3 className="text-lg font-bold flex flex-grow">Researcher Information</h3>
            <Button color="primary" variant="bordered" className={`${genomic.researcherId === researcherId ? "" : "hidden"}`} startContent={<PencilIcon />}>Edit</Button>
          </CardHeader>
          <Divider />
          <CardBody className="px-8 space-y-4">
            <div>
              <h4 className="font-semibold mb-1">Name</h4>
              <p className="text-foreground-600">{genomic.researcherName}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Institution</h4>
              <p className="text-foreground-600">{genomic.researcherInstitution}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Email</h4>
              <Link href={`mailto:${genomic.researcherEmail}`}><Button color="primary"><MailIcon />{genomic.researcherEmail}</Button></Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}