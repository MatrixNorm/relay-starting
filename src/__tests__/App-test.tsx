import * as React from "react";
import * as tr from "react-test-renderer";
import * as tu from "../testUtils";
import { createRootComponent } from "../App";
import { createManuallyControlledRelayEnvironment } from "../env";

describe("xxx", () => {
  test("t_1 manuallyControlledRelayEnvironment", async () => {
    const [relayEnv, getPendingRequests] = createManuallyControlledRelayEnvironment();
    const Root = createRootComponent({ relayEnv });
    const renderer = tr.create(<Root />);
    //console.log(JSON.stringify(renderer.toJSON(), null, 2));
    const pendingRequests = getPendingRequests();
    console.log(pendingRequests);
    // pendingRequests[0].resolverFn({
    //   countries: { enumValues: [{ name: "Russia" }, { name: "Austria" }] },
    //   workKinds: { enumValues: [{ name: "Piano sonata" }, { name: "Symphony" }] },
    // });
    // await tu.eventLoopNextTick();
    // console.log(JSON.stringify(renderer.toJSON(), null, 2));
  });

  // test("t_2 using relay-test-utils mock environment", () => {
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
});
