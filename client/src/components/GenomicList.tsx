"use client"
import React, { FormEvent, useEffect, useState } from "react"
import Link from "next/link"

import { Button, Chip, Divider, Modal, ModalContent, Spinner, useDisclosure } from "@nextui-org/react"
import { InfoIcon, SlidersHorizontalIcon, DnaIcon, SquareArrowOutUpRightIcon } from "lucide-react"

import { GenomicSummary } from "@/utils/types"

import { SearchBar } from "./SearchBar"
import { FilterGenomic } from "./FilterGenomic"

interface FilterState {
  dataType: string[];
  quality: string[];
  categories: string[];
}

const initialFilterState: FilterState = {
  dataType: [],
  quality: [],
  categories: [],
};

export const GenomicList = () => {
  const [search, setSearch] = useState("");
  const [isLoadingSearch, setIsLoadingSearch] = useState<boolean>(false);

  const [genomics, setGenomics] = useState<GenomicSummary[]>([]);
  const [originalGenomics, setOriginalGenomics] = useState<GenomicSummary[]>([]);
  const [isLoadingGenomics, setIsLoadingGenomics] = useState<boolean>(true);

  const [filters, setFilters] = useState<FilterState>(initialFilterState);

  const { isOpen: isOpenFilter, onOpen: onOpenFilter, onOpenChange: onOpenFilterChange } = useDisclosure();

  const getReadableFilterName = (filter: string): string => {
    return filter
      .split(/[_-]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  useEffect(() => {
    const fetchGenomics = async () => {
      try {
        setIsLoadingGenomics(true);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dataset/list-genomics`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setGenomics(data.genomics);
          setOriginalGenomics(data.genomics);
        } else {
          const errorData = await response.json();
          console.error("Failed to fetch genomics:", errorData);
        }
      } catch (error) {
        console.error("Error fetching genomics:", error);
      } finally {
        setIsLoadingGenomics(false);
      }
    };

    fetchGenomics();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setIsLoadingSearch(true);

      // Send the userData to using fetch
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/search/genomics/${search}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        setGenomics(responseData.genomics);
        setOriginalGenomics(responseData.genomics);
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
        <DnaIcon size={42} />
        <h1 className="text-4xl font-extrabold tracking-wider">GENOMICS</h1>
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
              <FilterGenomic onClose={onClose} genomics={originalGenomics} setGenomics={setGenomics} filters={filters} setFilters={setFilters} />
            )}
          </ModalContent>
        </Modal>
      </div>

      {/* Active Filters Display */}
      {Object.values(filters).flat().filter(Boolean).length > 0 && (
        <div className="flex flex-row flex-wrap gap-2 items-center mb-8">
          <span className="font-semibold">Active Filters:</span>
          {filters.dataType.map(dataType => (
            <Chip
              key={dataType}
              variant="flat"
              color="primary"
            >
              Data Type: {dataType}
            </Chip>
          ))}
          {filters.quality.map(quality => (
            <Chip
              key={quality}
              variant="flat"
              color="primary"
            >
              Data Quality: {getReadableFilterName(quality)}
            </Chip>
          ))}
          {filters.categories.map(category => (
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

      {isLoadingGenomics || isLoadingSearch ? <Spinner label="Fetching genomic data..." color="primary" /> :
        genomics.length === 0 ? <p className="flex w-full justify-center items-center font-bold">No genomics found.</p> :
          <div className="grid grid-cols-2 gap-8 mb-12">
            {genomics.map(genomic => (
              <div key={genomic.id} className="grid grid-cols-2 gap-x-12 gap-y-4 bg-gray-100 w-full rounded-xl shadow-xl px-6 py-4">
                <div className="flex flex-col col-span-2 flex-wrap">
                  <p className="text-2xl text-biomedata-blue font-bold">{genomic.name}</p>
                </div>

                {/* <div className="flex flex-row gap-4"> */}
                <p><span className="font-bold">Data Type: </span>{genomic.dataType}</p>
                <p><span className="font-bold">Data Quality: </span>{genomic.quality}</p>
                {/* </div> */}

                <div className="flex flex-col col-span-2">
                  <p className="text-lg font-semibold">Description</p>
                  <p className="text-sm h-16 line-clamp-3">{genomic.description}</p>
                </div>

                <div className="flex flex-col justify-end">
                  <div className="flex flex-row gap-2 items-end flex-wrap">
                    {genomic.categories.map((category, index) => (
                      <Chip
                        key={`${genomic.id}-${category}-${index}`}
                        color="secondary"
                        variant="flat"
                      >
                        {getReadableFilterName(category).toUpperCase()}
                      </Chip>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 items-end justify-end">
                  <Link href={genomic.rawDataUrl} target="_blank"><Button color="primary"><SquareArrowOutUpRightIcon />View Source</Button></Link>
                  <Link href={`/genomic/${genomic.id}`}><Button color="primary"><InfoIcon />More Details</Button></Link>
                </div>
              </div>
            ))}
          </div>}
    </div>
  )
}
