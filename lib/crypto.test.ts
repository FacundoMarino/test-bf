import { describe, expect, it } from "vitest";

import { hashPassword } from "./crypto";

describe("hashPassword", () => {
  it("returns a 64-character hex string", async () => {
    const h = await hashPassword("password123");
    expect(h).toMatch(/^[0-9a-f]{64}$/);
  });

  it("is deterministic for the same input", async () => {
    const a = await hashPassword("same");
    const b = await hashPassword("same");
    expect(a).toBe(b);
  });

  it("differs for different inputs", async () => {
    const a = await hashPassword("a");
    const b = await hashPassword("b");
    expect(a).not.toBe(b);
  });
});
