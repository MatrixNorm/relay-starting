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

const Query = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    composers: {
      type: new GraphQLList(new GraphQLNonNull(Composer)),
      args: { country: { type: Country } },
    },
  }),
});

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

export default new GraphQLSchema({
  query: Query,
});

export const QueryToPleaseRelayCompiler = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    composers: {
      type: new GraphQLList(new GraphQLNonNull(Composer)),
      args: { country: { type: Country } },
    },
    __schema: {
      type: new GraphQLNonNull(__Schema),
    },
    __type: {
      type: __Type,
      args: { name: { type: new GraphQLNonNull(GraphQLString) } },
    },
  }),
});
