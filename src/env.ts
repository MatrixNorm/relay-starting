import { makeExecutableSchema } from "@graphql-tools/schema";
import { addMocksToSchema } from "@graphql-tools/mock";
import { graphql } from "graphql";
import { Environment, Network, RecordSource, Store } from "relay-runtime";
// @ts-ignore
import schemaDefsText from "raw-loader!./schema.graphql";

function waitFor(timeout: number) {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}

const mockedSchema = addMocksToSchema({
  schema: makeExecutableSchema({ typeDefs: schemaDefsText }),
});

export const createMockedRelayEnvironment = (
  { timeout }: { timeout: number } = { timeout: 200 }
) => {
  const network = Network.create(async (operation, variables) => {
    await waitFor(timeout);
    const response = await graphql(mockedSchema, operation.text || "", {}, {}, variables);
    return response;
  });
  const store = new Store(new RecordSource());
  const environment = new Environment({ network, store });

  // @ts-ignore
  window.printStore = () => {
    // @ts-ignore
    console.log(environment.getStore().getSource()._records);
  };

  return environment;
};
