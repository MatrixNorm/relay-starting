import { RequestSerializer } from "../env";
import * as tu from "../testUtils";

const eventLoopNextTick = () => new Promise((resolve) => setTimeout(resolve, 0));

describe("****", () => {
  test("t_1", async () => {
    const rs = new RequestSerializer();
    const resp = rs.add(() => Promise.resolve());
    expect(tu.isPending(resp)).toEqual(true);
    await eventLoopNextTick();
    expect(tu.isResolved(resp)).toEqual(true);
  });

  // test("t_2", async () => {
  //   const rs = new RequestSerializer();
  //   const respFn1 = async () => {};
  //   const resp = rs.add(() => Promise.resolve());
  //   await eventLoopNextTick();
  //   expect(tu.isResolved(resp)).toEqual(true);
  // });
});
