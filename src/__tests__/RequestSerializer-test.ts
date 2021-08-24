import { RequestSerializer } from "../env";
import * as tu from "../testUtils";

describe("RequestSerializer", () => {
  test("t_1 first promise is unchanged", async () => {
    const rs = new RequestSerializer();
    const p = Promise.resolve();
    const resp = rs.add(p);
    expect(resp === p).toBe(true);
  });

  test("t_2 second promise always resolves after first", async () => {
    const rs = new RequestSerializer();
    let resolveP1: any;
    const p1 = new Promise((resolve) => {
      resolveP1 = resolve;
    });
    const p2 = Promise.resolve();

    rs.add(p1);
    const resp2 = rs.add(p2);
    expect(tu.isPromisePending(resp2)).toBe(true);
    resolveP1();
    await tu.eventLoopNextTick();
    expect(tu.isPromiseResolved(resp2)).toBe(true);
  });
});
