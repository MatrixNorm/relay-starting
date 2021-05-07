import * as React from "react";
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils";
import * as tr from "react-test-renderer";
import { Root } from "../App";
import { OperationDescriptor } from "react-relay";

function getOperationText(operation: OperationDescriptor) {
  return operation.request.node.params.text;
}

describe("xxx", () => {
  test("t1", () => {
    let env = createMockEnvironment();
    let container = tr.create(<Root env={env} />);
    console.log(env.mock.getAllOperations().length);
    let [x, y] = env.mock.getAllOperations();
    console.log(getOperationText(x));
    console.log(getOperationText(y));
    console.log(getOperationText(env.mock.getMostRecentOperation()));
    // env.mock.resolve(x, {
    //   data: {
    //     countries: { enumValues: ["A", "B"] },
    //     workKinds: { enumValues: ["X", "Y"] },
    //   },
    // });
    env.mock.resolveMostRecentOperation({
      data: {
        composers: [
          {
            id: "1",
            name: "Scriabin",
            works: { id: "1", name: "X", kind: "a", yearOfPublication: 1902 },
          },
        ],
      },
    });
    console.log(env.mock.getAllOperations().forEach(getOperationText));
  });
});
