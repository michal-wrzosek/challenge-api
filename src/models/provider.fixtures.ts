import Provider, { ProviderProps } from "./provider";
import { FactoryInstructions, fixtureFactory } from "../test/fixtureFactory";
import { US_STATES } from "../types/USStates";

const getRandomFrom = (array: string[]) => () => {
  return array[Math.round(Math.random() * (array.length - 1))];
};

const getRandomState = getRandomFrom(Object.keys(US_STATES));

export const providersFactoryInstructions: FactoryInstructions<ProviderProps> = {
  providerId: (i: number) => `provider_${i}`,
  name: (i: number) => `name_${i}`,
  street: (i: number) => `street_${i}`,
  city: (i: number) => `city_${i}`,
  state: getRandomState,
  zipcode: (i: number) => `zipcode_${i}`,
  hospitalReferralRegionDesc: (i: number) => `hospitalReferralRegionDesc_${i}`,
  totalDischarges: () => Math.floor(Math.random() * 100),
  avgCoveredCharges: () => Math.floor(Math.random() * 100),
  avgTotalPayments: () => Math.floor(Math.random() * 100),
  avgMedicarePayments: () => Math.floor(Math.random() * 100),
  drgDefinition: (i: number) => `drgDefinition_${i}`,
};

export const providerFixtures = async (nrOfRecordsToGenerate: number) => {
  const records = fixtureFactory(providersFactoryInstructions, {
    nrOfRecordsToGenerate,
  });
  return await Provider.insertMany(records);
};
