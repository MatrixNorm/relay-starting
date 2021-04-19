import { makeExecutableSchema } from "@graphql-tools/schema";
import { addMocksToSchema } from "@graphql-tools/mock";
import { graphql } from "graphql";
import { Environment, Network, RecordSource, Store } from "relay-runtime";
// @ts-ignore
import schemaDefsText from "raw-loader!./schema.graphql";

function sleepAsync(timeout: number) {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}

const mockedSchema = addMocksToSchema({
  schema: makeExecutableSchema({ typeDefs: schemaDefsText }),
  mocks: {
    Query: () => ({
      composers: [...new Array(5)],
    }),
    Composer: () => ({
      name: "Sergey Prokofiev",
    }),
  },
});

export const createMockedRelayEnvironment = (
  { timeout }: { timeout: number } = { timeout: 200 }
) => {
  const fetchFn = async (operation, variables) => {
    await sleepAsync(timeout);
    const response = await graphql(mockedSchema, operation.text || "", {}, {}, variables);
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
