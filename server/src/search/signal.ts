import { signalSearch } from "../helper/searchHelper";

export async function searchSignal(searchTerm: string) {
  const signals = await signalSearch(searchTerm);

  return {
    signals
  }
}
