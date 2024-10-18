import { imagingSearch } from "../helper/searchHelper";

export async function searchImaging(searchTerm: string) {
  const imaging = await imagingSearch(searchTerm);

  return {
    imaging
  }
}
