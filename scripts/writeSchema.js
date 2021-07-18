import * as fs from "fs";
import * as path from "path";
import { Mutation, QueryToPleaseRelayCompiler } from "../src/schema.js";
import { GraphQLSchema, printSchema, printIntrospectionSchema } from "graphql";

const schema = new GraphQLSchema({
  query: QueryToPleaseRelayCompiler,
  mutation: Mutation,
});

const schemaPath = path.resolve(__dirname, "../resources/schema.graphql");

fs.writeFileSync(
  schemaPath,
  `${printSchema(schema)}\n${printIntrospectionSchema(schema)}`
);

console.log("Wrote " + schemaPath);
