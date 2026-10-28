import { test } from "node:test";
import assert from "node:assert/strict";
import asyncHandler from "../middlewares/asyncHandler.js";
import errorHandler from "../middlewares/errorHandler.js";

const mockRes = (statusCode = 200, headersSent = false) => ({
  statusCode,
  headersSent,
  status(code) { this.statusCode = code; return this; },
  json(body) { this.body = body; },
});

test("asyncHandler forwards rejected errors to next", async () => {
  const forwarded = await new Promise((resolve) => {
    asyncHandler(async () => { throw new Error("boom"); })({}, mockRes(), resolve);
  });
  assert.equal(forwarded.message, "boom");
});

test("errorHandler keeps preset status, then err.status, then 500", () => {
  const preset = mockRes(404);
  errorHandler(new Error("not found"), {}, preset, () => {});
  assert.equal(preset.statusCode, 404);
  assert.deepEqual(preset.body, { message: "not found" });

  const fromErr = mockRes();
  errorHandler(Object.assign(new Error("bad json"), { status: 400 }), {}, fromErr, () => {});
  assert.equal(fromErr.statusCode, 400);

  const fallback = mockRes();
  errorHandler(new Error("boom"), {}, fallback, () => {});
  assert.equal(fallback.statusCode, 500);
});

test("errorHandler delegates to next when headers are already sent", () => {
  const res = mockRes(200, true);
  let delegated = false;
  errorHandler(new Error("late"), {}, res, () => { delegated = true; });
  assert.equal(delegated, true);
  assert.equal(res.body, undefined);
});
