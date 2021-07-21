import { makeExecutableSchema } from "@graphql-tools/schema";
import { addMocksToSchema } from "@graphql-tools/mock";
import { graphql } from "graphql";
import { Environment, Network, RecordSource, Store } from "relay-runtime";
// @ts-ignore
import schemaDefsText from "raw-loader!./schema.graphql";
// types
import { RequestParameters, Variables } from "relay-runtime";

function sleepAsync(timeout: number) {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}

const mockedSchema = addMocksToSchema({
  schema: makeExecutableSchema({ typeDefs: schemaDefsText }),
  mocks: {
    Query: () => ({
      composers: [...new Array(3)],
    }),
    Composer: () => ({
      name: () => {
        let goats = [
          "Beethoven",
          "Mussorgsky",
          "Prokofiev",
          "Rachmaninoff",
          "Rimsky-Korsakov",
          "Scriabin",
          "Tchaikovsky",
        ];
        return goats[Math.floor(Math.random() * goats.length)];
      },
    }),
    Work: () => ({
      name: `Op. ${Math.floor(Math.random() * 100) + 1}`,
    }),
  },
});

export const createMockedRelayEnvironment = (
  { timeout }: { timeout: number } = { timeout: 500 }
) => {
  const fetchFn = async (operation: RequestParameters, variables: Variables) => {
    await sleepAsync(timeout);
    const response = await graphql({
      schema: mockedSchema,
      source: operation.text || "",
      variableValues: variables,
    });
    return response;
  };
  // @ts-ignore
  const network = Network.create(fetchFn);
  const store = new Store(new RecordSource());
  const environment = new Environment({ network, store });

  // @ts-ignore
  window.__relayStore = environment.getStore();

  return environment;
};
