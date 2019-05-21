import { times, identity } from "ramda";

// *
// * fixtureFactory let's you quickly create lots of different records for your DB
// *

type FactoryInstruction = (index: number) => string | number;
export type FactoryInstructions<T> = { [key in keyof T]: FactoryInstruction };
type FixtureFactoryOptions = { nrOfRecordsToGenerate: number };

export const fixtureFactory = <T extends object>(
  factoryInstructions: FactoryInstructions<T>,
  { nrOfRecordsToGenerate }: FixtureFactoryOptions
) => {
  return times(identity, nrOfRecordsToGenerate).map((index) => {
    type Record = { [key in keyof T]: string | number };
    let record = {} as Record;
    for (const key in factoryInstructions) {
      const factoryFunction = factoryInstructions[key];
      const value = factoryFunction(index);
      record[key] = value;
    }
    return record;
  });
};
