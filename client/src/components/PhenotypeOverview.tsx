"use client"

import { Button, Card, CardBody, CardHeader, Chip, Divider, Link, Spinner } from "@nextui-org/react"
import { PhenotypeDetail } from "@/utils/types";
import { useEffect, useState } from "react";
import { InfoIcon, MailIcon, PencilIcon, SyringeIcon } from "lucide-react";

export const PhenotypeOverview = ({ researcherId, phenotypeId }: { researcherId: string, phenotypeId: string }) => {
  const [phenotype, setPhenotype] = useState<PhenotypeDetail | null>(null);
  const [isLoadingPhenotypeOverview, setIsLoadingPhenotypeOverview] = useState(true);

  const getReadableCategoryName = (filter: string): string => {
    return filter
      .split(/[_-]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  useEffect(() => {
    const fetchPhenotypeOverview = async () => {
      try {
        setIsLoadingPhenotypeOverview(true);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/overview/phenotype/${phenotypeId}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const result = await response.json();
          setPhenotype(result);
        } else {
          const errorData = await response.json();
          console.error("Failed to fetch phenotype:", errorData);
        }
      } catch (error) {
        console.error("Error fetching phenotype:", error);
      } finally {
        setIsLoadingPhenotypeOverview(false);
      }
    };

    fetchPhenotypeOverview();
  }, [phenotypeId]);

  if (isLoadingPhenotypeOverview) {
    return (
      <div className="flex justify-center items-center w-full h-64">
        <Spinner size="lg" label="Fetching phenotype data..." />
      </div>
    );
  }

  if (!phenotype) {
    return (
      <div className="flex justify-center items-center w-full h-64">
        <p className="text-lg">No phenotype data found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-5/6 my-12">
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <div className="flex flex-row items-center gap-4">
          <SyringeIcon size={42} />
          <p className="text-5xl font-extrabold">{phenotype.name}</p>
        </div>
        <p className="text-foreground-500">Phenotype ID: {phenotype.id}</p>
      </div>

      <Divider className="my-8" />

      <div className="flex flex-col gap-6">
        {/* Phenotype Information */}
        <Card className="pb-1">
          <CardHeader className="flex flex-row w-full px-8">
            <h3 className="text-lg font-bold flex flex-grow">Phenotype Information</h3>
            <Button color="primary" variant="bordered" className={`${phenotype.researcherId === researcherId ? "" : "hidden"}`} startContent={<PencilIcon />}>Edit</Button>
          </CardHeader>
          <Divider />
          <CardBody className="px-8 space-y-4">
            <div>
              <h4 className="font-semibold mb-1">Name</h4>
              <p className="text-foreground-600">{phenotype.name}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Description</h4>
              <p className="text-foreground-600">{phenotype.description}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Traits</h4>
              <div className="flex flex-row gap-2">
                {phenotype.traits.map((trait) => (
                  <Chip color="warning" variant="flat" key={trait}>{trait}</Chip>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Categories</h4>
              <div className="flex flex-row gap-2">
                {phenotype.categories.map((category) => (
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
            <Button color="primary" variant="bordered" className={`${phenotype.researcherId === researcherId ? "" : "hidden"}`} startContent={<PencilIcon />}>Edit</Button>
          </CardHeader>
          <Divider />
          <CardBody className="px-8 space-y-4">
            <div>
              <h4 className="font-semibold mb-1">View Patient Profile</h4>
              <Link href={`/patient/${phenotype.patientId}`}><Button color="primary"><InfoIcon />View Profile</Button></Link>
            </div>
          </CardBody>
        </Card>

        {/* Researcher Information */}
        <Card className="pb-1">
          <CardHeader className="flex flex-row w-full px-8">
            <h3 className="text-lg font-bold flex flex-grow">Researcher Information</h3>
            <Button color="primary" variant="bordered" className={`${phenotype.researcherId === researcherId ? "" : "hidden"}`} startContent={<PencilIcon />}>Edit</Button>
          </CardHeader>
          <Divider />
          <CardBody className="px-8 space-y-4">
            <div>
              <h4 className="font-semibold mb-1">Name</h4>
              <p className="text-foreground-600">{phenotype.researcherName}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Institution</h4>
              <p className="text-foreground-600">{phenotype.researcherInstitution}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Email</h4>
              <Link href={`mailto:${phenotype.researcherEmail}`}><Button color="primary"><MailIcon />{phenotype.researcherEmail}</Button></Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}