import { resolvePlugin } from "@babel/core";
import { addMocksToSchema, createMockStore } from "@graphql-tools/mock";
import * as gql from "graphql";
import * as rr from "relay-runtime";
import schema from "./schema";

function isNil(x: any): boolean {
  return x === undefined || x === null;
}

function sleepPromise(timeout: number) {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}

const store = createMockStore({
  schema,
  mocks: {
    Query: () => ({
      composers: [...new Array(2)],
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
      works: [...new Array(2)],
    }),
    Work: () => ({
      name: `Op. ${Math.floor(Math.random() * 100) + 1}`,
    }),
  },
});

const mockedSchema = addMocksToSchema({
  schema,
  store,
  resolvers: (store) => ({
    Query: {
      composers: (_, { country }) => {
        // IF gql request has variables like {} (that is
        // 'country' key is missing) then here 'country'
        // will have value of 'undefined'. But if variables
        // are like {country: undefined} then value will
        // be 'null'.
        const composerRefs: any = store.get(
          "Query",
          "ROOT",
          "composers",
          !isNil(country) ? { country } : undefined
        );

        if (!isNil(country)) {
          for (let ref of composerRefs) {
            store.set("Composer", ref.$ref.key, "country", country);
          }
        }

        return composerRefs;
      },
    },
    Composer: {
      works: (composer, { kind }) => {
        const workRefs: any = store.get(
          "Composer",
          composer.$ref.key,
          "works",
          !isNil(kind) ? { kind } : undefined
        );

        if (!isNil(kind)) {
          for (let ref of workRefs) {
            store.set("Work", ref.$ref.key, "kind", kind);
          }
        }

        return workRefs;
      },
    },
  }),
});

/**
 * Environment that serializes responses.
 * Each response waits until previous response is done.
 * Every response takes equal `timeout` to simulate network delay.
 */
export const createMockedRelayEnvironment = (
  { timeout }: { timeout: number } = { timeout: 500 }
) => {
  // we are starting with resolved promise
  let __latestResponsePromise: Promise<any> = Promise.resolve();

  const network = rr.Network.create(
    async (request: rr.RequestParameters, variables: rr.Variables) => {
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
      // Typescript type for GraphQLResponse is wrong because
      // null value it does not permit.
      return __latestResponsePromise as Promise<rr.GraphQLResponse>;
    }
  );
  const store = new rr.Store(new rr.RecordSource());
  const environment = new rr.Environment({ network, store });
  // @ts-ignore
  window.__relayStore = environment.getStore()._recordSource._records;
  return environment;
};

/**
 * XXX
 *
 */

export class RequestSerializer {
  queue: any[];

  constructor() {
    this.queue = [];
  }

  add(responseFn: () => Promise<any>) {
    let greenLight;

    if (this.queue.length === 0) {
      greenLight = Promise.resolve();
      this.queue.push(() => {});
    } else {
      let resolveGreenLight;
      greenLight = new Promise((resolve) => {
        resolveGreenLight = resolve;
      });
      this.queue.push(resolveGreenLight);
    }

    const response = (async function () {
      await greenLight;
      return await responseFn();
    })();
    response.finally(() => this._remove());
    return response;
  }

  private _remove() {
    this.queue.shift();
    if (this.queue.length > 0) {
      const resolveGreenLight = this.queue[0];
      resolveGreenLight();
    }
  }
}

export const createMockedRelayEnvironment2 = (
  { timeout }: { timeout: number } = { timeout: 500 }
) => {
  const requestSerializer = new RequestSerializer();

  const fetchFn = (
    request: rr.RequestParameters,
    variables: rr.Variables
  ): Promise<rr.GraphQLResponse> => {
    return requestSerializer.add(async function () {
      await sleepPromise(timeout);
      return gql.graphqlSync({
        schema: mockedSchema,
        source: request.text || "",
        variableValues: variables,
      });
    }) as Promise<rr.GraphQLResponse>;
  };

  const network = rr.Network.create(fetchFn);
  const store = new rr.Store(new rr.RecordSource());
  const environment = new rr.Environment({ network, store });
  // @ts-ignore
  window.__relayStore = environment.getStore()._recordSource._records;
  return environment;
};

/**
 * This environment is useful for testing.
 *
 */

type PendingRequest = {
  request: rr.RequestParameters;
  variables: rr.Variables;
  resolverFn: (data: any) => void;
};

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
