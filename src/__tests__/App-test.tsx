import * as React from "react";
import { OperationDescriptor } from "react-relay";
import * as tr from "react-test-renderer";
import { Root } from "../App";
import { createManuallyControlledRelayEnvironment } from "../env";

const eventLoopNextTick = () => new Promise((resolve) => setTimeout(resolve, 0));

function getOperationText(operation: OperationDescriptor) {
  return operation.request.node.params.text;
}

function getOperationName(operation: OperationDescriptor) {
  return operation.request.node.operation.name;
}

describe("xxx", () => {
  // test("t1", () => {
  //   const env = createMockEnvironment();
  //   env.mock.queueOperationResolver((op: OperationDescriptor) => {
  //     return {
  //       data: {
  //         countries: { enumValues: [{ name: "A" }, { name: "B" }] },
  //         workKinds: { enumValues: [{ name: "X" }, { name: "Y" }] },
  //       },
  //     };
  //   });
  //   env.mock.queueOperationResolver((op: OperationDescriptor) => {
  //     return {
  //       data: {
  //         composers: [
  //           {
  //             id: "Composer#1",
  //             name: "Scriabin",
  //             works: [
  //               { id: "Work#1", name: "X", kind: "a", yearOfPublication: 1902 },
  //               { id: "Work#2", name: "Y", kind: "b", yearOfPublication: 1909 },
  //             ],
  //           },
  //         ],
  //       },
  //     };
  //   });
  //   env.mock.queuePendingOperation(SelectorsQuery, {});
  //   env.mock.queuePendingOperation(ComposersQuery, {});
  //   console.log("---------");
  //   const renderer = tr.create(<Root env={env} />);
  //   console.log(JSON.stringify(renderer.toJSON(), null, 2));
  // });

  test("t2", async () => {
    const [env, getPendingRequests] = createManuallyControlledRelayEnvironment();
    const renderer = tr.create(<Root env={env} />);
    console.log(JSON.stringify(renderer.toJSON(), null, 2));
    const pendingRequests = getPendingRequests();
    pendingRequests[0].resolver({
      countries: { enumValues: [{ name: "Russia" }, { name: "Austria" }] },
      workKinds: { enumValues: [{ name: "Piano sonata" }, { name: "Symphony" }] },
      composers: [
        {
          id: "Composer#1",
          name: "Scriabin",
          works: [
            {
              id: "Work#1",
              name: "Op. 22",
              kind: "PIANO_PRELUDE",
              yearOfPublication: 1902,
            },
            {
              id: "Work#2",
              name: "Op. 31",
              kind: "PIANO_ETUDE",
              yearOfPublication: 1909,
            },
          ],
        },
      ],
    });
    await eventLoopNextTick();
    console.log(JSON.stringify(renderer.toJSON(), null, 2));
  });
});
