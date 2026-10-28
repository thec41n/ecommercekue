import { test } from "node:test";
import assert from "node:assert/strict";
import { createUser, loginUser } from "../controllers/userController.js";

const callHandler = (handler, body) =>
  new Promise((resolve) => {
    const res = { statusCode: 200, status(code) { this.statusCode = code; return this; } };
    handler({ body }, res, (err) => resolve({ status: res.statusCode, err }));
  });

test("loginUser rejects missing or non-string credentials before querying DB", async () => {
  for (const body of [
    { password: "secret" },
    { email: { $ne: null }, password: "secret" },
    { email: "a@b.com", password: { $gt: "" } },
  ]) {
    const { status, err } = await callHandler(loginUser, body);
    assert.equal(status, 400);
    assert.equal(err.message, "Email dan password wajib diisi!");
  }
});

test("createUser rejects non-string fields before querying DB", async () => {
  const { status, err } = await callHandler(createUser, {
    username: "budi",
    email: { $gt: "" },
    password: "secret",
  });
  assert.equal(status, 400);
  assert.equal(err.message, "Tolong isi semua input!");
});
