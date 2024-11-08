"use client"
import React, { FormEvent, useEffect, useState } from "react"
import Link from "next/link"

import { Button, Chip, Divider, Modal, ModalContent, Spinner, useDisclosure } from "@nextui-org/react"
import { InfoIcon, ActivityIcon, SlidersHorizontalIcon } from "lucide-react"

import { SignalSummary } from "@/utils/types"

import { SearchBar } from "./SearchBar"
import { FilterSignal } from "./FilterSignal"

interface FilterState {
  signalType: string[];
  categories: string[];
}

const initialFilterState: FilterState = {
  signalType: [],
  categories: [],
};

export const SignalList = () => {
  const [search, setSearch] = useState("");
  const [isLoadingSearch, setIsLoadingSearch] = useState<boolean>(false);

  const [signals, setSignals] = useState<SignalSummary[]>([]);
  const [originalSignals, setOriginalSignals] = useState<SignalSummary[]>([]);
  const [isLoadingSignals, setIsLoadingSignals] = useState<boolean>(true);

  const [filters, setFilters] = useState<FilterState>(initialFilterState);

  const { isOpen: isOpenFilter, onOpen: onOpenFilter, onOpenChange: onOpenFilterChange } = useDisclosure();

  const getReadableFilterName = (filter: string): string => {
    return filter
      .split(/[_-]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        setIsLoadingSignals(true);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dataset/list-signals`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setSignals(data.signals);
          setOriginalSignals(data.signals);
        } else {
          const errorData = await response.json();
          console.error("Failed to fetch signals:", errorData);
        }
      } catch (error) {
        console.error("Error fetching signals:", error);
      } finally {
        setIsLoadingSignals(false);
      }
    };

    fetchSignals();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setIsLoadingSearch(true);

      // Send the userData to using fetch
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/search/signals/${search}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        setSignals(responseData.signals);
        setOriginalSignals(responseData.signals);
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
        <ActivityIcon size={42} />
        <h1 className="text-4xl font-extrabold tracking-wider">SIGNALS</h1>
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
              <FilterSignal onClose={onClose} signals={originalSignals} setSignals={setSignals} filters={filters} setFilters={setFilters} />
            )}
          </ModalContent>
        </Modal>
      </div>

      {/* Active Filters Display */}
      {Object.values(filters).flat().filter(Boolean).length > 0 && (
        <div className="flex flex-row flex-wrap gap-2 items-center mb-8">
          <span className="font-semibold">Active Filters:</span>
          {filters.signalType.map(signalType => (
            <Chip
              key={signalType}
              variant="flat"
              color="primary"
            >
              Signal Type: {signalType}
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

      {isLoadingSignals || isLoadingSearch ? <Spinner label="Fetching signal data..." color="primary" /> :
        signals.length === 0 ? <p className="flex w-full justify-center items-center font-bold">No signals found.</p> :
          <div className="grid grid-cols-2 gap-8 mb-12">
            {signals.map(signal => (
              <div key={signal.id} className="grid grid-cols-2 gap-x-12 gap-y-4 bg-gray-100 w-full rounded-xl shadow-xl px-6 py-4">
                <div className="flex flex-col col-span-2 flex-wrap">
                  <p className="text-2xl text-biomedata-blue font-bold">{signal.name}</p>
                </div>

                <div className="flex flex-row col-span-2 gap-4">
                  <p><span className="font-bold">Signal Type: </span>{signal.signalType}</p>
                </div>

                <div className="flex flex-col col-span-2">
                  <p className="text-lg font-semibold">Description</p>
                  <p className="text-sm h-16 line-clamp-3">{signal.description}</p>
                </div>

                <div className="flex flex-col justify-end">
                  <div className="flex flex-row gap-2 items-end flex-wrap">
                    {signal.categories.map((category, index) => (
                      <Chip
                        key={`${signal.id}-${category}-${index}`}
                        color="secondary"
                        variant="flat"
                      >
                        {getReadableFilterName(category).toUpperCase()}
                      </Chip>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 items-end justify-end">
                  <Link href={`/signal/${signal.id}`}><Button color="primary"><InfoIcon />More Details</Button></Link>
                </div>
              </div>
            ))}
          </div>}
    </div>
  )
}
