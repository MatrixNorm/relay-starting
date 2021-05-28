import { resolvePlugin } from "@babel/core";
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
      bio: "Wow. Such great composer.",
      works: [...new Array(4)],
    }),
    Work: () => ({
      name: `Op. ${Math.floor(Math.random() * 100) + 1}`,
      description:
        "Greate example of Modal Mixture Common Tone Enharmonic Double Chromatic Mediant Modulation",
    }),
  },
});

const mockedSchema = addMocksToSchema({
  schema,
  store,
});

/**
 * Environment that serializes every request with equal
 * `timeout` delay between them.
 */
export const createMockedRelayEnvironment = (
  { timeout }: { timeout: number } = { timeout: 500 }
) => {
  let latestPendingResponse: Promise<any> = Promise.resolve();
  // XXX
  async function getNextResponse(request: rr.RequestParameters, variables: rr.Variables) {
    await latestPendingResponse;
    await sleepPromise(timeout);
    return await gql.graphql(mockedSchema, request.text || "", {}, {}, variables);
  }

  const network = rr.Network.create(
    async (request: rr.RequestParameters, variables: rr.Variables) => {
      //console.log(request.text, variables);
      const nextResponse = getNextResponse(request, variables);
      latestPendingResponse = nextResponse;
      return nextResponse as Promise<rr.GraphQLResponse>;
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
  resolver: any;
};

export const createManuallyControlledRelayEnvironment: () => [
  rr.Environment,
  () => PendingRequest[]
] = () => {
  let pendingRequests: PendingRequest[] = [];

  function getPendingRequests(): PendingRequest[] {
    return pendingRequests;
  }

  const network = rr.Network.create(
    (request: rr.RequestParameters, variables: rr.Variables) => {
      //console.log(request.text, variables);
      let resolver = null;

      const responsePromise = new Promise((resolve) => {
        resolver = (data: any) => {
          resolve({ data });
          const j = pendingRequests.findIndex((pending) => pending.request === request);
          pendingRequests.splice(j, 1);
        };
      });
      pendingRequests.push({ request, variables, resolver });
      return responsePromise as Promise<rr.GraphQLResponse>;
    }
  );
  const store = new rr.Store(new rr.RecordSource());
  const environment = new rr.Environment({ network, store });
  return [environment, getPendingRequests];
};
