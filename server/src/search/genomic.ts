import { genomicSearch } from "../helper/searchHelper";

export async function searchGenomic(searchTerm: string) {
  const genomics = await genomicSearch(searchTerm);

  return {
    genomics
  }
}
