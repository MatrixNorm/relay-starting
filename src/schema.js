import {
  GraphQLEnumType,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLInterfaceType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  __Schema,
  __Type,
} from "graphql";

function enumType(name, values) {
  return new GraphQLEnumType({
    name: name,
    values: Object.fromEntries(values.map((x, i) => [x, { value: i }])),
  });
}

const Node = new GraphQLInterfaceType({
  name: "Node",
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
});

const Composer = new GraphQLObjectType({
  name: "Composer",
  interfaces: [Node],
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    country: { type: Country },
    bio: { type: GraphQLString },
    works: {
      type: new GraphQLList(new GraphQLNonNull(Work)),
      args: { kind: { type: WorkKind } },
    },
  }),
});

const Work = new GraphQLObjectType({
  name: "Work",
  interfaces: [Node],
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    author: { type: Composer },
    kind: { type: WorkKind },
    yearOfPublication: { type: GraphQLInt },
    description: { type: GraphQLString },
    likesCount: { type: GraphQLInt },
  }),
});

const WorkKind = enumType("WorkKind", [
  "BALLET_SUITE",
  "OPERA",
  "PIANO_CONCERTO",
  "PIANO_PRELUDE",
  "PIANO_ETUDE",
  "PIANO_SONATA",
  "STRING_QUARTET",
  "SYMPHONY",
]);

const Country = enumType("Country", [
  "Austria",
  "France",
  "Italy",
  "Germany",
  "Poland",
  "Russia",
]);

const queryFields = {
  composers: {
    type: new GraphQLList(new GraphQLNonNull(Composer)),
    args: { country: { type: Country } },
  },
  composerById: {
    type: Composer,
    args: { composerId: { type: new GraphQLNonNull(GraphQLID) } },
  },
  workById: {
    type: Work,
    args: { workId: { type: new GraphQLNonNull(GraphQLID) } },
  },
};

const Query = new GraphQLObjectType({
  name: "Query",
  fields: queryFields,
});

/**
 * Need thi for writeSchema.js script that generates schema.graphql file
 * consumed by Relay compiler. The latter needs full graphql schema incluing
 * types for introspection.
 */
export const QueryToPleaseRelayCompiler = new GraphQLObjectType({
  name: "Query",
  fields: {
    ...queryFields,
    __schema: {
      type: new GraphQLNonNull(__Schema),
    },
    __type: {
      type: __Type,
      args: { name: { type: new GraphQLNonNull(GraphQLString) } },
    },
  },
});

export const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    incrementWorkLikesCount: {
      type: new GraphQLNonNull(IncrementWorkLikesCountPayload),
      args: {
        input: { type: new GraphQLNonNull(IncrementWorkLikesCountInput) },
      },
    },
  }),
});

const IncrementWorkLikesCountInput = new GraphQLInputObjectType({
  name: "IncrementWorkLikesCountInput",
  fields: {
    workId: { type: new GraphQLNonNull(GraphQLID) },
  },
});

const IncrementWorkLikesCountPayload = new GraphQLObjectType({
  name: "IncrementWorkLikesCountPayload",
  fields: {
    work: { type: Work },
  },
});

export default new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});
