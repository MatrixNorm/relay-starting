import * as React from "react";
//@ts-ignore
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils";
import * as tr from "react-test-renderer";
import { ComposersQuery, Root, SelectorsQuery } from "../App";
import { OperationDescriptor } from "react-relay";

function getOperationText(operation: OperationDescriptor) {
  return operation.request.node.params.text;
}

function getOperationName(operation: OperationDescriptor) {
  return operation.request.node.operation.name;
}

describe("xxx", () => {
  test("t1", () => {
    let env = createMockEnvironment();
    env.mock.queueOperationResolver((op: OperationDescriptor) => {
      console.log(1111, op);
      return {
        data: {
          countries: { enumValues: [{ name: "A" }, { name: "B" }] },
          workKinds: { enumValues: [{ name: "X" }, { name: "Y" }] },
        },
      };
    });
    env.mock.queuePendingOperation(SelectorsQuery, {});

    env.mock.queueOperationResolver((op: OperationDescriptor) => {
      console.log(2222, op);
      return {};
    });
    env.mock.queuePendingOperation(ComposersQuery, {});
    let renderer = tr.create(<Root env={env} />);
    console.log(JSON.stringify(renderer.toJSON(), null, 2));
    // env.mock.resolveMostRecentOperation({
    //   data: {
    //     composers: [
    //       {
    //         id: "1",
    //         name: "Scriabin",
    //         works: { id: "1", name: "X", kind: "a", yearOfPublication: 1902 },
    //       },
    //     ],
    //   },
    // });
    // console.log(env.mock.getAllOperations().forEach(getOperationText));
  });
});
