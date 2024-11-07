"use client"

import { Button, Card, CardBody, CardHeader, Chip, Divider, getKeyValue, Modal, ModalContent, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from "@nextui-org/react"
import { GenomicSummary, ImagingSummary, PatientDetail, PhenotypeSummary, SignalSummary } from "@/utils/types";
import { useEffect, useState } from "react";
import { PencilIcon, PlusIcon, UserIcon } from "lucide-react";
import { UploadPhenotype } from "./UploadPhenotype";
import { UploadGenomic } from "./UploadGenomic";
import { UploadImaging } from "./UploadImaging";
import { UploadSignal } from "./UploadSignal";
import { useRouter } from "next/navigation";

const phenotypeColumns = [
  {
    key: "name",
    label: "NAME",
  },
  {
    key: "description",
    label: "DESCRIPTION",
  },
  {
    key: "traits",
    label: "TRAITS",
  },
  {
    key: "categories",
    label: "CATEGORIES",
  },
];

const genomicColumns = [
  {
    key: "name",
    label: "NAME",
  },
  {
    key: "description",
    label: "DESCRIPTION",
  },
  {
    key: "dataType",
    label: "DATA TYPE",
  },
  {
    key: "quality",
    label: "QUALITY",
  },
  {
    key: "categories",
    label: "CATEGORIES",
  },
];

const imagingColumns = [
  {
    key: "name",
    label: "NAME",
  },
  {
    key: "description",
    label: "DESCRIPTION",
  },
  {
    key: "imageType",
    label: "IMAGE TYPE",
  },
  {
    key: "categories",
    label: "CATEGORIES",
  },
];

const signalColumns = [
  {
    key: "name",
    label: "NAME",
  },
  {
    key: "description",
    label: "DESCRIPTION",
  },
  {
    key: "signalType",
    label: "SIGNAL TYPE",
  },
  {
    key: "categories",
    label: "CATEGORIES",
  },
];

export const PatientOverview = ({ patientId }: { patientId: string }) => {
  const [patient, setPatient] = useState<PatientDetail | null>(null);
  const [isLoadingPatientOverview, setIsLoadingPatientOverview] = useState(true);

  const { isOpen: isOpenUploadPhenotype, onOpen: onOpenUploadPhenotype, onOpenChange: onOpenUploadPhenotypeChange } = useDisclosure();
  const { isOpen: isOpenUploadGenomic, onOpen: onOpenUploadGenomic, onOpenChange: onOpenUploadGenomicChange } = useDisclosure();
  const { isOpen: isOpenUploadImaging, onOpen: onOpenUploadImaging, onOpenChange: onOpenUploadImagingChange } = useDisclosure();
  const { isOpen: isOpenUploadSignal, onOpen: onOpenUploadSignal, onOpenChange: onOpenUploadSignalChange } = useDisclosure();

  const router = useRouter();

  const handlePhenotypeUpload = (newPhenotype: PhenotypeSummary) => {
    if (patient) {
      setPatient({
        ...patient,
        phenotypeData: [...patient.phenotypeData, newPhenotype]
      });
    }
  };

  const handleGenomicUpload = (newGenomic: GenomicSummary) => {
    if (patient) {
      setPatient({
        ...patient,
        genomicData: [...patient.genomicData, newGenomic]
      });
    }
  };

  const handleImagingUpload = (newImaging: ImagingSummary) => {
    if (patient) {
      setPatient({
        ...patient,
        imagingData: [...patient.imagingData, newImaging]
      });
    }
  };

  const handleSignalUpload = (newSignal: SignalSummary) => {
    if (patient) {
      setPatient({
        ...patient,
        signalData: [...patient.signalData, newSignal]
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadableCategoryName = (filter: string): string => {
    return filter
      .split(/[_-]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  useEffect(() => {
    const fetchPatientOverview = async () => {
      try {
        setIsLoadingPatientOverview(true);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/overview/patient/${patientId}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const result = await response.json();
          setPatient(result);
        } else {
          const errorData = await response.json();
          console.error("Failed to fetch patient:", errorData);
        }
      } catch (error) {
        console.error("Error fetching patient:", error);
      } finally {
        setIsLoadingPatientOverview(false);
      }
    };

    fetchPatientOverview();
  }, [patientId]);

  if (isLoadingPatientOverview) {
    return (
      <div className="flex justify-center items-center w-full h-64">
        <Spinner size="lg" label="Fetching patient data..." />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex justify-center items-center w-full h-64">
        <p className="text-lg">No patient data found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-5/6 my-12">
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <div className="flex flex-row gap-4">
          <UserIcon size={42} />
          <p className="text-5xl font-extrabold">{patient.name}</p>
        </div>
        <p className="text-foreground-500">Patient ID: {patient.id}</p>
      </div>

      <Divider className="my-8" />

      <div className="flex flex-col gap-6">
        {/* Patient Information */}
        <Card className="pb-1">
          <CardHeader className="flex flex-row w-full px-8">
            <h3 className="text-lg font-bold flex flex-grow">Patient Information</h3>
            <Button color="primary" variant="bordered"><PencilIcon />Edit</Button>
          </CardHeader>
          <Divider />
          <CardBody className="px-8 space-y-4">
            <div>
              <h4 className="font-semibold mb-1">Date of Birth</h4>
              <p className="text-foreground-600">{formatDate(patient.dateOfBirth)}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Age</h4>
              <p className="text-foreground-600">{patient.sex.charAt(0) + patient.sex.slice(1).toLowerCase()}</p>
            </div>
          </CardBody>
        </Card>

        <Card className="pb-1">
          {/* Medical Information */}
          <CardHeader className="flex flex-row w-full px-8">
            <h3 className="text-lg font-bold flex flex-grow">Medical Information</h3>
            <Button color="primary" variant="bordered"><PencilIcon />Edit</Button>
          </CardHeader>
          <Divider />
          <CardBody className="px-8 space-y-4">
            <div>
              <h4 className="font-semibold mb-1">Diagnosis</h4>
              <p className="text-foreground-600">{patient.diagnosticInfo}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Treatment</h4>
              <p className="text-foreground-600">{patient.treatmentInfo}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Categories</h4>
              <div className="flex flex-row flex-wrap gap-2">
                {patient.categories.map((category) => (
                  <Chip key={category} color="secondary" variant="flat">{getReadableCategoryName(category)}</Chip>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Phenotype Information */}
        <Card className="pb-1">
          <CardHeader className="flex flex-row w-full px-8">
            <h3 className="text-lg font-bold flex flex-grow">Phenotype Information</h3>
            <Button color="primary" variant="bordered"><PencilIcon />Edit</Button>

            {/* Upload Phenotype Button */}
            <Button color="primary" variant="solid" startContent={<PlusIcon />} onClick={onOpenUploadPhenotype} className="ml-3">Upload Phenotype</Button>
            <Modal isOpen={isOpenUploadPhenotype} onOpenChange={onOpenUploadPhenotypeChange} scrollBehavior="inside" size="4xl">
              <ModalContent>
                {(onClose) => (
                  <UploadPhenotype onClose={onClose} setPhenotypes={handlePhenotypeUpload} patientId={patientId} />
                )}
              </ModalContent>
            </Modal>
          </CardHeader>
          <Divider />
          <CardBody className="px-8 space-y-4">
            <Table aria-label="Table for Phenotype Data">
              <TableHeader columns={phenotypeColumns}>
                {(column) => <TableColumn key={column.key} width={"25%"}>{column.label}</TableColumn>}
              </TableHeader>
              <TableBody items={patient.phenotypeData}>
                {(item) => (
                  <TableRow key={item.id} className="rounded-2xl hover:cursor-pointer hover:bg-foreground-100" onClick={() => router.push(`/phenotype/${item.id}`)}>
                    {(columnKey) => (
                      <TableCell>
                        {columnKey === "traits" ? (
                          <div className="flex flex-wrap gap-1">
                            {item[columnKey].map((trait: string, index: number) => (
                              <Chip key={index} size="sm" variant="flat" color="warning">
                                {trait}
                              </Chip>
                            ))}
                          </div>
                        ) : columnKey === "categories" ? (
                          <div className="flex flex-wrap gap-1">
                            {item[columnKey].map((category: string, index: number) => (
                              <Chip key={index} size="sm" color="secondary" variant="flat">
                                {getReadableCategoryName(category)}
                              </Chip>
                            ))}
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

        {/* Genomic Information */}
        <Card className="pb-1">
          <CardHeader className="flex flex-row w-full px-8">
            <h3 className="text-lg font-bold flex flex-grow">Genomic Information</h3>
            <Button color="primary" variant="bordered"><PencilIcon />Edit</Button>

            {/* Upload Genomic Button */}
            <Button color="primary" variant="solid" startContent={<PlusIcon />} onClick={onOpenUploadGenomic} className="ml-3">Upload Genomic</Button>
            <Modal isOpen={isOpenUploadGenomic} onOpenChange={onOpenUploadGenomicChange} scrollBehavior="inside" size="4xl">
              <ModalContent>
                {(onClose) => (
                  <UploadGenomic onClose={onClose} setGenomics={handleGenomicUpload} patientId={patientId} />
                )}
              </ModalContent>
            </Modal>
          </CardHeader>
          <Divider />
          <CardBody className="px-8 space-y-4">
            <Table aria-label="Table for Genomic Data">
              <TableHeader columns={genomicColumns}>
                {(column) => <TableColumn key={column.key} width={"20%"}>{column.label}</TableColumn>}
              </TableHeader>
              <TableBody items={patient.genomicData}>
                {(item) => (
                  <TableRow key={item.id} className="rounded-2xl hover:cursor-pointer hover:bg-foreground-100" onClick={() => router.push(`/genomic/${item.id}`)}>
                    {(columnKey) => (
                      <TableCell>
                        {columnKey === "categories" ? (
                          <div className="flex flex-wrap gap-1">
                            {item[columnKey].map((category: string, index: number) => (
                              <Chip key={index} size="sm" color="secondary" variant="flat">
                                {getReadableCategoryName(category)}
                              </Chip>
                            ))}
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

        {/* Imaging Information */}
        <Card className="pb-1">
          <CardHeader className="flex flex-row w-full px-8">
            <h3 className="text-lg font-bold flex flex-grow">Imaging Information</h3>
            <Button color="primary" variant="bordered"><PencilIcon />Edit</Button>

            {/* Upload Imaging Button */}
            <Button color="primary" variant="solid" startContent={<PlusIcon />} onClick={onOpenUploadImaging} className="ml-3">Upload Imaging</Button>
            <Modal isOpen={isOpenUploadImaging} onOpenChange={onOpenUploadImagingChange} scrollBehavior="inside" size="4xl">
              <ModalContent>
                {(onClose) => (
                  <UploadImaging onClose={onClose} setImagings={handleImagingUpload} patientId={patientId} />
                )}
              </ModalContent>
            </Modal>
          </CardHeader>
          <Divider />
          <CardBody className="px-8 space-y-4">
            <Table aria-label="Table for Imaging Data">
              <TableHeader columns={imagingColumns}>
                {(column) => <TableColumn key={column.key} width={"25%"}>{column.label}</TableColumn>}
              </TableHeader>
              <TableBody items={patient.imagingData}>
                {(item) => (
                  <TableRow key={item.id} className="rounded-2xl hover:cursor-pointer hover:bg-foreground-100" onClick={() => router.push(`/imaging/${item.id}`)}>
                    {(columnKey) => (
                      <TableCell>
                        {columnKey === "categories" ? (
                          <div className="flex flex-wrap gap-1">
                            {item[columnKey].map((category: string, index: number) => (
                              <Chip key={index} size="sm" color="secondary" variant="flat">
                                {getReadableCategoryName(category)}
                              </Chip>
                            ))}
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

        {/* Signal Information */}
        <Card className="pb-1">
          <CardHeader className="flex flex-row w-full px-8">
            <h3 className="text-lg font-bold flex flex-grow">Signal Information</h3>
            <Button color="primary" variant="bordered"><PencilIcon />Edit</Button>

            {/* Upload Signal Button */}
            <Button color="primary" variant="solid" startContent={<PlusIcon />} onClick={onOpenUploadSignal} className="ml-3">Upload Signal</Button>
            <Modal isOpen={isOpenUploadSignal} onOpenChange={onOpenUploadSignalChange} scrollBehavior="inside" size="4xl">
              <ModalContent>
                {(onClose) => (
                  <UploadSignal onClose={onClose} setSignals={handleSignalUpload} patientId={patientId} />
                )}
              </ModalContent>
            </Modal>
          </CardHeader>
          <Divider />
          <CardBody className="px-8 space-y-4">
            <Table aria-label="Table for Signal Data">
              <TableHeader columns={signalColumns}>
                {(column) => <TableColumn key={column.key} width={"25%"}>{column.label}</TableColumn>}
              </TableHeader>
              <TableBody items={patient.signalData}>
                {(item) => (
                  <TableRow key={item.id} className="rounded-2xl hover:cursor-pointer hover:bg-foreground-100" onClick={() => router.push(`/signal/${item.id}`)}>
                    {(columnKey) => (
                      <TableCell>
                        {columnKey === "categories" ? (
                          <div className="flex flex-wrap gap-1">
                            {item[columnKey].map((category: string, index: number) => (
                              <Chip key={index} size="sm" color="secondary" variant="flat">
                                {getReadableCategoryName(category)}
                              </Chip>
                            ))}
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