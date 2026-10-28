import { test } from "node:test";
import assert from "node:assert/strict";
import { isValidQty, isMidtransPaid } from "../controllers/orderController.js";
import asyncHandler from "../middlewares/asyncHandler.js";

test("isValidQty rejects fractional, non-positive and over-stock qty", () => {
  assert.equal(isValidQty(2, 5), true);
  assert.equal(isValidQty(5, 5), true);
  assert.equal(isValidQty(0.1, 5), false);
  assert.equal(isValidQty(-3, 5), false);
  assert.equal(isValidQty(0, 5), false);
  assert.equal(isValidQty(6, 5), false);
  assert.equal(isValidQty(NaN, 5), false);
});

test("isMidtransPaid only accepts settlement or accepted capture", () => {
  assert.equal(isMidtransPaid({ transaction_status: "settlement" }), true);
  assert.equal(isMidtransPaid({ transaction_status: "capture", fraud_status: "accept" }), true);
  assert.equal(isMidtransPaid({ transaction_status: "capture", fraud_status: "challenge" }), false);
  assert.equal(isMidtransPaid({ transaction_status: "pending" }), false);
  assert.equal(isMidtransPaid({ transaction_status: "expire" }), false);
});

test("asyncHandler does not respond again after headers are sent", async (t) => {
  t.mock.method(console, "error", () => {});
  let responded = false;
  const res = { headersSent: true, status() { responded = true; return this; }, json() {} };

  asyncHandler(async () => { throw new Error("boom"); })({}, res, () => {});
  await new Promise(setImmediate);

  assert.equal(responded, false);
});
