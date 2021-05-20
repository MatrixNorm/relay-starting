import {
  GraphQLEnumType,
  GraphQLID,
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
  "SYMTHONY",
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
};

const Query = new GraphQLObjectType({
  name: "Query",
  fields: queryFields,
});

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

export default new GraphQLSchema({
  query: Query,
});
