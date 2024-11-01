"use client"
import React, { FormEvent, useEffect, useState } from "react"
import Link from "next/link"

import { Button, Chip, Divider, Modal, ModalContent, Spinner, useDisclosure } from "@nextui-org/react"
import { UsersIcon, InfoIcon, MailIcon, SlidersHorizontalIcon, PlusIcon } from "lucide-react"

import { calculateAge } from "@/utils/date"
import { PatientSummary } from "@/utils/types"

import { SearchBar } from "./SearchBar"
import { FilterPatient } from "./FilterPatient"
import { UploadPatient } from "./UploadPatient"

interface FilterState {
  selectedAges: string[];
  selectedSex: string[];
  selectedTreatment: string;
  selectedCategories: string[];
}

const initialFilterState: FilterState = {
  selectedAges: [],
  selectedSex: [],
  selectedTreatment: "",
  selectedCategories: []
};

export const PatientList = ({ researcherId }: { researcherId: string }) => {
  const [search, setSearch] = useState("");
  const [isLoadingSearch, setIsLoadingSearch] = useState<boolean>(false);

  const [patients, setPatients] = useState<PatientSummary[]>([]);
  const [originalPatients, setOriginalPatients] = useState<PatientSummary[]>([]);
  const [isLoadingPatients, setIsLoadingPatients] = useState<boolean>(true);

  const [filters, setFilters] = useState<FilterState>(initialFilterState);

  const { isOpen: isOpenFilter, onOpen: onOpenFilter, onOpenChange: onOpenFilterChange } = useDisclosure();
  const { isOpen: isOpenUpload, onOpen: onOpenUpload, onOpenChange: onOpenUploadChange } = useDisclosure();

  const getReadableFilterName = (filter: string): string => {
    return filter
      .split(/[_-]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setIsLoadingPatients(true);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dataset/list-patients`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPatients(data.patients);
          setOriginalPatients(data.patients);
        } else {
          const errorData = await response.json();
          console.error("Failed to fetch patients:", errorData);
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setIsLoadingPatients(false);
      }
    };

    fetchPatients();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setIsLoadingSearch(true);

      // Send the userData to using fetch
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/search/patients/${search}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        setPatients(responseData.patients);
        setOriginalPatients(responseData.patients);
      } else {
        // Handle error response from the API
        const errorData = await response.json();
        console.error(errorData);  // Set the error message received from backend
      }
    } catch (error) {
      // Handle any other errors
      console.error(error);
    } finally {
      setIsLoadingSearch(false);
    }
  };

  return (
    <div className="flex flex-col w-5/6 mt-12">
      <div className="flex flex-row gap-4 items-center">
        <UsersIcon size={42} />
        <h1 className="text-4xl font-extrabold tracking-wider">PATIENTS</h1>
      </div>

      <Divider className="my-8" />

      <div className="flex flex-row gap-4 w-full">
        <SearchBar handleSearchChange={handleSearchChange} handleSearch={handleSearch} isLoading={isLoadingSearch} />

        {/* Filter Button */}
        <Button color="primary" variant="bordered" size="lg" startContent={<SlidersHorizontalIcon />} onClick={onOpenFilter}>
          Filter
          {Object.values(filters).flat().filter(Boolean).length > 0 && (
            <Chip size="sm" color="primary" className="ml-2">
              {Object.values(filters).flat().filter(Boolean).length}
            </Chip>
          )}
        </Button>
        <Modal
          isOpen={isOpenFilter}
          onOpenChange={onOpenFilterChange}
          scrollBehavior="inside"
          size="4xl"
        >
          <ModalContent>
            {(onClose) => (
              <FilterPatient onClose={onClose} patients={originalPatients} setPatients={setPatients} filters={filters} setFilters={setFilters} />
            )}
          </ModalContent>
        </Modal>

        {/* Upload Patient Button */}
        <Button color="primary" variant="solid" size="lg" startContent={<PlusIcon />} onClick={onOpenUpload}>Upload Patient</Button>
        <Modal
          isOpen={isOpenUpload}
          onOpenChange={onOpenUploadChange}
          scrollBehavior="inside"
          size="4xl"
        >
          <ModalContent>
            {(onClose) => (
              <UploadPatient onClose={onClose} patients={patients} setPatients={setPatients} />
            )}
          </ModalContent>
        </Modal>
      </div>

      {/* Active Filters Display */}
      {Object.values(filters).flat().filter(Boolean).length > 0 && (
        <div className="flex flex-row flex-wrap gap-2 items-center mb-8">
          <span className="font-semibold">Active Filters:</span>
          {filters.selectedAges.map(age => (
            <Chip
              key={age}
              variant="flat"
              color="primary"
            >
              Age: {getReadableFilterName(age)}
            </Chip>
          ))}
          {filters.selectedSex.map(sex => (
            <Chip
              key={sex}
              variant="flat"
              color="primary"
            >
              Sex: {getReadableFilterName(sex)}
            </Chip>
          ))}
          {filters.selectedTreatment && (
            <Chip
              variant="flat"
              color="primary"
            >
              Treatment: {getReadableFilterName(filters.selectedTreatment)}
            </Chip>
          )}
          {filters.selectedCategories.map(category => (
            <Chip
              key={category}
              variant="flat"
              color="primary"
            >
              Category: {getReadableFilterName(category)}
            </Chip>
          ))}
        </div>
      )}

      {isLoadingPatients || isLoadingSearch ? <Spinner label="Fetching patient data..." color="primary" /> :
        patients.length === 0 ? <p className="flex w-full justify-center items-center font-bold">No patients found.</p> :
          <div className="grid grid-cols-2 gap-8 mb-12">
            {patients.map(patient => (
              <div key={patient.id} className="grid grid-cols-2 gap-x-12 gap-y-4 bg-gray-100 w-full rounded-xl shadow-xl px-6 py-4">
                <div className="flex flex-col flex-wrap">
                  <p className="text-2xl text-biomedata-blue font-bold">{patient.researcherId === researcherId ? patient.name : "REDACTED"}</p>
                  <div className="flex flex-row gap-4">
                    <p><span className="font-bold">Age: </span>{calculateAge(patient.dateOfBirth)}</p>
                    <p><span className="font-bold">Sex: </span>{patient.sex}</p>
                  </div>
                </div>

                <div></div>

                <div className="flex flex-col">
                  <p className="text-lg font-semibold">Diagnostic Information</p>
                  <p className="text-sm h-16 line-clamp-3">{patient.diagnosticInfo}</p>
                </div>

                <div className="flex flex-col">
                  <p className="text-lg font-semibold">Treatment Found</p>
                  <p className="text-sm">{patient.treatmentInfo === "" ? "No" : "Yes"}</p>
                </div>

                <div className="flex flex-col justify-end">
                  <div className="flex flex-row gap-2 items-end flex-wrap">
                    {patient.categories.map((category, index) => (
                      <Chip
                        key={`${patient.id}-${category}-${index}`}
                        color="secondary"
                        variant="flat"
                      >
                        {category}
                      </Chip>
                    ))}
                  </div>
                </div>

                <div className="flex items-end justify-end">
                  {patient.researcherId === researcherId ? <Link href={`/patient/${patient.id}`}><Button color="primary"><InfoIcon />View Profile</Button></Link> : <Link href={`mailto:${patient.researcherEmail}`}><Button color="primary"><MailIcon />{patient.researcherEmail}</Button></Link>}
                </div>
              </div>
            ))}
          </div>}
    </div>
  )
}
