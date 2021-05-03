import { addMocksToSchema, createMockStore } from "@graphql-tools/mock";
import { graphql } from "graphql";
import { Environment, Network, RecordSource, Store } from "relay-runtime";
import schema from "./schema";

function sleepAsync(timeout: number) {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}
console.log(schema);
const store = createMockStore({
  schema,
  mocks: {
    Query: () => ({
      composers: [...new Array(5)],
    }),
    Composer: () => ({
      name: () => {
        let goats = [
          "Beethoven",
          "Mussorgsky",
          "Prokofiev",
          "Rachmaninov",
          "Rimsky-Korsakov",
          "Scriabin",
          "Tchaikovsky",
        ];
        return goats[Math.floor(Math.random() * goats.length)];
      },
      works: [...new Array(4)],
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
  // resolvers: (store) => ({
  //   Query: {
  //     composers: (_, { country }) => store.get("User", id),
  //   },
  // }),
});

export const createMockedRelayEnvironment = (
  { timeout }: { timeout: number } = { timeout: 500 }
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
