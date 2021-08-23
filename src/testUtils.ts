const util = require("util");

export function isPending(p: Promise<any>) {
  return util.inspect(p).includes("<pending>");
}

export function isRejected(p: Promise<any>) {
  return util.inspect(p).includes("<rejected>");
}

export function isResolved(p: Promise<any>) {
  return !isRejected(p) && !isPending(p);
}
