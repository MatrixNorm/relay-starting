import { addMocksToSchema, createMockStore } from "@graphql-tools/mock";
import * as gql from "graphql";
import * as rr from "relay-runtime";
import schema from "./schema";

function sleepPromise(timeout: number) {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}

const store = createMockStore({
  schema,
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
      works: [...new Array(3)],
    }),
    Work: () => ({
      name: `Op. ${Math.floor(Math.random() * 100) + 1}`,
    }),
  },
});

window.mockStore = store;

const mockedSchema = addMocksToSchema({
  schema,
  store,
  resolvers: (store) => ({
    Query: {
      composers: (_, { country }) => {
        const composers = store.get(
          "Query",
          "ROOT",
          "composers",
          country !== undefined ? { country } : undefined
        );
        console.log(composers);
        console.log(store.set("Composer", composers[0].$ref.key, "name", "XXX"));
        return composers;
      },
    },
  }),
});

/**
 * Environment that serializes responses.
 * Each response takes equal `timeout` to simulate network delay.
 */
export const createMockedRelayEnvironment = (
  { timeout }: { timeout: number } = { timeout: 500 }
) => {
  // we are starting with resolved promise
  let __latestResponsePromise: Promise<any> = Promise.resolve();

  const network = rr.Network.create(
    async (request: rr.RequestParameters, variables: rr.Variables) => {
      console.log(request.text, variables);
      // closure captures value of __latestResponsePromise
      async function createNextResponsePromise() {
        await __latestResponsePromise;
        await sleepPromise(timeout);
        return gql.graphqlSync({
          schema: mockedSchema,
          source: request.text || "",
          variableValues: variables,
        });
      }

      __latestResponsePromise = createNextResponsePromise();
      // Typescript type for GraphQLResponse is wrong because it does not permit
      // null value.
      return __latestResponsePromise as Promise<rr.GraphQLResponse>;
    }
  );
  const store = new rr.Store(new rr.RecordSource());
  const environment = new rr.Environment({ network, store });
  // @ts-ignore
  window.__relayStore = environment.getStore();
  return environment;
};

type PendingRequest = {
  request: rr.RequestParameters;
  variables: rr.Variables;
  resolverFn: (data: any) => void;
};

// This environment is useful for testing.
export const createManuallyControlledRelayEnvironment: () => [
  rr.Environment,
  () => PendingRequest[]
] = () => {
  let __pendingResponses: PendingRequest[] = [];

  const network = rr.Network.create(
    (request: rr.RequestParameters, variables: rr.Variables) => {
      let resolverFn = (_: rr.PayloadData) => {};

      const responsePromise = new Promise((resolve) => {
        resolverFn = (data: rr.PayloadData) => {
          resolve({ data });
          const j = __pendingResponses.findIndex(
            (pending) => pending.request.id === request.id
          );
          __pendingResponses.splice(j, 1);
        };
      });

      __pendingResponses.push({ request, variables, resolverFn });

      return responsePromise as Promise<rr.GraphQLResponse>;
    }
  );

  const store = new rr.Store(new rr.RecordSource());
  const environment = new rr.Environment({ network, store });
  return [environment, () => __pendingResponses];
};
