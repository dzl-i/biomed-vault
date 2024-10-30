import { Button, Spinner } from "@nextui-org/react"
import { SearchIcon } from "lucide-react"
import { ChangeEventHandler, FormEventHandler } from "react"

export const SearchBar = ({ handleSearchChange, handleSearch, isLoading }: { handleSearchChange: ChangeEventHandler<HTMLInputElement>, handleSearch: FormEventHandler<HTMLFormElement>, isLoading: boolean }) => {
  return (
    <form className="flex flex-row items-center gap-4 mb-8 w-full" onSubmit={handleSearch}>
      {/* Search Section */}
      <div className="flex flex-row flex-grow items-center px-4 bg-biomedata-gray rounded-2xl">
        <SearchIcon />
        <input placeholder="What would you like to look for?" className="px-4 py-3 bg-transparent w-full text-lg focus:outline-none" onChange={handleSearchChange} />
      </div>

      <Button type="submit" color="primary" variant="bordered" size="lg">
        {isLoading ? <Spinner color="default" /> : "Search"}
      </Button>
    </form>
  );
}
