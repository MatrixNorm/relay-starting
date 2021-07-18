import * as gql from "graphql";
import { addMocksToSchema, createMockStore } from "@graphql-tools/mock";
import schema from "../schema";

function printStore() {
  //@ts-ignore
  console.log(store.store);
}

function log(value: any) {
  console.log(JSON.stringify(value));
}

const store = createMockStore({
  schema,
  mocks: {
    // Query: () => ({
    //   composers: [...new Array(2)],
    // }),
    Composer: () => ({
      name: "Scriabin",
      bio: "Wow. Such great composer.",
      works: [...new Array(2)],
    }),
    Work: () => ({
      name: `Op. 1`,
      description: `Composed in summer of 1901 work is a great example of modal
       mixture common tone enharmonic double chromatic mediant modulation`,
    }),
  },
});

const mockedSchema = addMocksToSchema({
  schema,
  store,
  resolvers: (store) => ({
    Query: {
      composerById: (_, { composerId }) => {
        return store.get("Composer", composerId);
      },
      composers: (_, { country }) => {
        const composers = store.get("Query", "ROOT", "composers");
        console.log(composers);
      },
    },
    Mutation: {
      incrementWorkLikesCount: (_, { input }) => {
        const { workId } = input;
        const currentLikes = (store.get("Work", workId, "likesCount") || 0) as number;
        store.set("Work", workId, "likesCount", currentLikes + 1);
        return { work: store.get("Work", workId) };
      },
    },
  }),
});

describe("mutate mock store", () => {
  test("t0", () => {
    const { data } = gql.graphqlSync(
      mockedSchema,
      `query {
        composerById(composerId: "qwerty") {
          id
          name
          works {
            id
            name
            likesCount
          }
        }
      }`
    );
    log(data);
    const work = (data as any).composerById.works[0];
    log(work);

    const mutResult = gql.graphqlSync({
      schema: mockedSchema,
      source: `mutation IncrementWorkLikesCount ($input: IncrementWorkLikesCountInput!){
        incrementWorkLikesCount(input: $input) {
          work {
            id
            likesCount
          }
        }
      }`,
      variableValues: { input: { workId: work.id } },
    });

    log(mutResult);
  });
});
