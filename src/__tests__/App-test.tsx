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
      return {
        data: {
          countries: { enumValues: [{ name: "A" }, { name: "B" }] },
          workKinds: { enumValues: [{ name: "X" }, { name: "Y" }] },
        },
      };
    });
    env.mock.queueOperationResolver((op: OperationDescriptor) => {
      return {
        data: {
          composers: [
            {
              id: "Composer#1",
              name: "Scriabin",
              works: [
                { id: "Work#1", name: "X", kind: "a", yearOfPublication: 1902 },
                { id: "Work#2", name: "Y", kind: "b", yearOfPublication: 1909 },
              ],
            },
          ],
        },
      };
    });
    env.mock.queuePendingOperation(SelectorsQuery, {});
    env.mock.queuePendingOperation(ComposersQuery, {});
    console.log("---------");
    let renderer = tr.create(<Root env={env} />);
    console.log(JSON.stringify(renderer.toJSON(), null, 2));
  });
});
