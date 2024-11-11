import { ImagingType, SignalType } from "@prisma/client";
import { getGenomics, getImaging, getPatients, getPhenotypes, getSignals } from "../helper/datasetHelper";
import { getGenomicsStats, getPatientDemographics, getPhenotypeTraitsCloud } from "../helper/visualisationHelper";

export async function visualisationData() {
  const patients = await getPatients();
  const { patientDemographics } = getPatientDemographics(patients);

  const phenotypes = await getPhenotypes();
  const { phenotypeTraitsCloud } = getPhenotypeTraitsCloud(phenotypes);

  const genomics = await getGenomics();
  const { genomicDistribution, mutationTypesCloud } = getGenomicsStats(genomics);

  const imagings = await getImaging();
  const imagingDistribution = Object.values(ImagingType).map(type => ({
    name: type,
    value: imagings.filter(img => img.imageType === type).length
  }));

  const signals = await getSignals();
  const signalDistribution = Object.values(SignalType).map(type => ({
    name: type,
    value: signals.filter(signal => signal.signalType === type).length
  }));

  return {
    patientDemographics,
    phenotypeTraitsCloud,
    genomicDistribution,
    mutationTypesCloud,
    imagingDistribution,
    signalDistribution,
  }
}
