import { addMocksToSchema, createMockStore } from "@graphql-tools/mock";
import { graphql } from "graphql";
import * as rr from "relay-runtime";
import schema from "./schema";

function sleepPromise(timeout: number) {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}

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
  let latestPendingResponse: Promise<any> = Promise.resolve();
  // XXX
  async function getNextResponse(request: rr.RequestParameters, variables: rr.Variables) {
    await latestPendingResponse;
    await sleepPromise(timeout);
    return await graphql(mockedSchema, request.text || "", {}, {}, variables);
  }

  const network = rr.Network.create(
    // @ts-ignore
    async (request: rr.RequestParameters, variables: rr.Variables) => {
      console.log(request.text, variables);
      const nextResponse = getNextResponse(request, variables);
      latestPendingResponse = nextResponse;
      return nextResponse;
    }
  );
  const store = new rr.Store(new rr.RecordSource());
  const environment = new rr.Environment({ network, store });

  // @ts-ignore
  window.__relayStore = environment.getStore();

  return environment;
};
