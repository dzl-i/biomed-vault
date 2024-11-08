"use client"

import { Button, Card, CardBody, CardHeader, Divider, getKeyValue, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react"
import { ResearcherDetail } from "@/utils/types";
import { useEffect, useState } from "react";
import { PencilIcon, CircleUserIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const patientColumns = [
  { key: "name", label: "NAME" },
  { key: "dateOfBirth", label: "DATE OF BIRTH" },
  { key: "sex", label: "SEX" },
  { key: "diagnosticInfo", label: "DIAGNOSTIC INFORMATION" },
  { key: "treatmentInfo", label: "TREATMENT INFORMATION" },
];

export const ResearcherProfile = ({ researcherId }: { researcherId: string }) => {
  const [researcher, setResearcher] = useState<ResearcherDetail | null>(null);
  const [isLoadingResearcherProfile, setIsLoadingResearcherProfile] = useState(true);

  const router = useRouter();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  useEffect(() => {
    const fetchResearcherProfile = async () => {
      try {
        setIsLoadingResearcherProfile(true);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/researcher/profile`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const result = await response.json();
          setResearcher(result.researcher);
        } else {
          const errorData = await response.json();
          console.error("Failed to fetch researcher:", errorData);
        }
      } catch (error) {
        console.error("Error fetching researcher:", error);
      } finally {
        setIsLoadingResearcherProfile(false);
      }
    };

    fetchResearcherProfile();
  }, [researcherId]);

  if (isLoadingResearcherProfile) {
    return (
      <div className="flex justify-center items-center w-full h-64">
        <Spinner size="lg" label="Fetching researcher data..." />
      </div>
    );
  }

  if (!researcher) {
    return (
      <div className="flex justify-center items-center w-full h-64">
        <p className="text-lg">No researcher data found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-5/6 my-12">
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <div className="flex flex-row items-center gap-4">
          <CircleUserIcon size={42} />
          <p className="text-5xl font-extrabold">{researcher.name}</p>
        </div>
        <p className="text-foreground-500">Researcher ID: {researcher.id}</p>
      </div>

      <Divider className="my-8" />

      <div className="flex flex-col gap-6">
        {/* Researcher Information */}
        <Card className="pb-1">
          <CardHeader className="flex flex-row w-full px-8">
            <h3 className="text-lg font-bold flex flex-grow">Researcher Information</h3>
            <Button color="primary" variant="bordered" className={`${researcher.id === researcherId ? "" : "hidden"}`} startContent={<PencilIcon />}>Edit</Button>
          </CardHeader>
          <Divider />
          <CardBody className="px-8 space-y-4">
            <div>
              <h4 className="font-semibold mb-1">Name</h4>
              <p className="text-foreground-600">{researcher.name}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Email</h4>
              <p className="text-foreground-600">{researcher.email}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Username</h4>
              <p className="text-foreground-600">{researcher.username}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Institution</h4>
              <p className="text-foreground-600">{researcher.institution}</p>
            </div>
          </CardBody>
        </Card>

        {/* Patient List */}
        <Card className="pb-1">
          <CardHeader className="flex flex-row w-full px-8">
            <h3 className="text-lg font-bold flex flex-grow">Patient List</h3>
            <Button color="primary" variant="bordered" className={`${researcher.id === researcherId ? "" : "hidden"}`} startContent={<PencilIcon />}>Edit</Button>
          </CardHeader>
          <Divider />
          <CardBody className="px-8 space-y-4">
            <Table aria-label="Table for Patient List">
              <TableHeader columns={patientColumns}>
                {(column) => <TableColumn key={column.key} width={"20%"}>{column.label}</TableColumn>}
              </TableHeader>
              <TableBody items={researcher.patients} emptyContent={"No rows to display."}>
                {(item) => (
                  <TableRow key={item.id} className="rounded-2xl hover:cursor-pointer hover:bg-foreground-100" onClick={() => router.push(`/patient/${item.id}`)}>
                    {(columnKey) => (
                      <TableCell>
                        {columnKey === "name" ? (
                          <div>
                            {researcher.id === researcherId ? item[columnKey] : "REDACTED"}
                          </div>
                        ) :
                          columnKey === "dateOfBirth" ? (
                            <div>
                              {formatDate(item[columnKey])}
                            </div>
                          ) : (
                            <div className="line-clamp-3" title={getKeyValue(item, columnKey)}>
                              {getKeyValue(item, columnKey)}
                            </div>
                          )}
                      </TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}