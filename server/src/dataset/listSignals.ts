import { getSignals } from "../helper/datasetHelper";

export async function datasetListSignals() {
  // Get a list of all signals, with patients being anonymised
  // All signals will have the researcher email, so other researchers can contact the original researcher
  // If the signal belongs to a patient of the researcher, they can view the patient in more detail
  const signals = await getSignals();

  return {
    signals
  };
}
