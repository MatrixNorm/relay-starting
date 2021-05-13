import * as React from "react";
import { OperationDescriptor } from "react-relay";
//@ts-ignore
import { createMockEnvironment } from "relay-test-utils";
import * as tr from "react-test-renderer";
import { ComposersQuery, Root, SelectorsQuery } from "../App";
import { createManuallyControlledRelayEnvironment } from "../env";

function getOperationText(operation: OperationDescriptor) {
  return operation.request.node.params.text;
}

function getOperationName(operation: OperationDescriptor) {
  return operation.request.node.operation.name;
}

describe("xxx", () => {
  test("t1", () => {
    const env = createMockEnvironment();
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
    const renderer = tr.create(<Root env={env} />);
    console.log(JSON.stringify(renderer.toJSON(), null, 2));
  });

  test("t2", (done) => {
    const [env, getPendingRequests] = createManuallyControlledRelayEnvironment();
    const renderer = tr.create(<Root env={env} />);
    console.log(JSON.stringify(renderer.toJSON(), null, 2));
    const pendingRequest = getPendingRequests();
    console.log(pendingRequest);
    pendingRequest[0].resolver();
    console.log(pendingRequest);

    setTimeout(() => {
      console.log(JSON.stringify(renderer.toJSON(), null, 2));
      done();
    }, 0);
  });
});
