import { phenotypeSearch } from "../helper/searchHelper";

export async function searchPhenotype(searchTerm: string) {
  const phenotypes = await phenotypeSearch(searchTerm);

  return {
    phenotypes
  }
}
