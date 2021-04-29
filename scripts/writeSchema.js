import * as fs from "fs";
import * as path from "path";
import schema from "../src/schema.js";
import { printSchema } from "graphql";

const schemaPath = path.resolve(__dirname, "../resources/schema.graphql");

fs.writeFileSync(schemaPath, printSchema(schema));

console.log("Wrote " + schemaPath);
