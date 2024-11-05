"use client"
import React, { FormEvent, useEffect, useState } from "react"
import Link from "next/link"

import { Button, Chip, Divider, Modal, ModalContent, Spinner, useDisclosure } from "@nextui-org/react"
import { InfoIcon, MailIcon, SlidersHorizontalIcon, SyringeIcon } from "lucide-react"

import { PhenotypeSummary } from "@/utils/types"

import { SearchBar } from "./SearchBar"
import { FilterPhenotype } from "./FilterPhenotype"

interface FilterState {
  selectedCategories: string[];
}

const initialFilterState: FilterState = {
  selectedCategories: []
};

export const PhenotypeList = ({ researcherId }: { researcherId: string }) => {
  const [search, setSearch] = useState("");
  const [isLoadingSearch, setIsLoadingSearch] = useState<boolean>(false);

  const [phenotypes, setPhenotypes] = useState<PhenotypeSummary[]>([]);
  const [originalPhenotypes, setOriginalPhenotypes] = useState<PhenotypeSummary[]>([]);
  const [isLoadingPhenotypes, setIsLoadingPhenotypes] = useState<boolean>(true);

  const [filters, setFilters] = useState<FilterState>(initialFilterState);

  const { isOpen: isOpenFilter, onOpen: onOpenFilter, onOpenChange: onOpenFilterChange } = useDisclosure();

  const getReadableFilterName = (filter: string): string => {
    return filter
      .split(/[_-]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  useEffect(() => {
    const fetchPhenotypes = async () => {
      try {
        setIsLoadingPhenotypes(true);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dataset/list-phenotypes`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPhenotypes(data.phenotypes);
          setOriginalPhenotypes(data.phenotypes);
        } else {
          const errorData = await response.json();
          console.error("Failed to fetch phenotypes:", errorData);
        }
      } catch (error) {
        console.error("Error fetching phenotypes:", error);
      } finally {
        setIsLoadingPhenotypes(false);
      }
    };

    fetchPhenotypes();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setIsLoadingSearch(true);

      // Send the userData to using fetch
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/search/phenotypes/${search}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        setPhenotypes(responseData.phenotypes);
        setOriginalPhenotypes(responseData.phenotypes);
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
        <SyringeIcon size={42} />
        <h1 className="text-4xl font-extrabold tracking-wider">PHENOTYPES</h1>
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
              <FilterPhenotype onClose={onClose} phenotypes={originalPhenotypes} setPhenotypes={setPhenotypes} filters={filters} setFilters={setFilters} />
            )}
          </ModalContent>
        </Modal>
      </div>

      {/* Active Filters Display */}
      {Object.values(filters).flat().filter(Boolean).length > 0 && (
        <div className="flex flex-row flex-wrap gap-2 items-center mb-8">
          <span className="font-semibold">Active Filters:</span>
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

      {isLoadingPhenotypes || isLoadingSearch ? <Spinner label="Fetching phenotype data..." color="primary" /> :
        phenotypes.length === 0 ? <p className="flex w-full justify-center items-center font-bold">No phenotypes found.</p> :
          <div className="grid grid-cols-2 gap-8 mb-12">
            {phenotypes.map(phenotype => (
              <div key={phenotype.id} className="grid grid-cols-2 gap-x-12 gap-y-4 bg-gray-100 w-full rounded-xl shadow-xl px-6 py-4">
                <div className="flex flex-col col-span-2 flex-wrap">
                  <p className="text-2xl text-biomedata-blue font-bold">{phenotype.name}</p>
                </div>

                <div className="flex flex-col col-span-2">
                  <p className="text-lg font-semibold">Description</p>
                  <p className="text-sm h-16 line-clamp-3">{phenotype.description}</p>
                </div>

                <div className="flex flex-col justify-end">
                  <div className="flex flex-row gap-2 items-end flex-wrap">
                    {phenotype.categories.map((category, index) => (
                      <Chip
                        key={`${phenotype.id}-${category}-${index}`}
                        color="secondary"
                        variant="flat"
                      >
                        {getReadableFilterName(category).toUpperCase()}
                      </Chip>
                    ))}
                  </div>
                </div>

                <div className="flex items-end justify-end">
                  {phenotype.researcherId === researcherId ? <Link href={`/phenotype/${phenotype.id}`}><Button color="primary"><InfoIcon />More Details</Button></Link> : <Link href={`mailto:${phenotype.researcherEmail}`}><Button color="primary"><MailIcon />{phenotype.researcherEmail}</Button></Link>}
                </div>
              </div>
            ))}
          </div>}
    </div>
  )
}
