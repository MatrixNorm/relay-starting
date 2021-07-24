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
    composers: { type: new GraphQLList(new GraphQLNonNull(Composer)) },
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
    works: { type: new GraphQLList(new GraphQLNonNull(Work)) },
  }),
});

const Work = new GraphQLObjectType({
  name: "Work",
  interfaces: [Node],
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    author: { type: Composer },
    type: { type: CompositionType },
    yearOfPublication: { type: GraphQLInt },
  }),
});

const CompositionType = enumType("CompositionType", [
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

export default new GraphQLSchema({
  query: Query,
});
