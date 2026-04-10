import { describe, expect, it } from "vitest";

import { loginSchema, registerSchema } from "./auth";

describe("loginSchema", () => {
  it("rejects invalid email", () => {
    const r = loginSchema.safeParse({
      email: "not-an-email",
      password: "123456",
    });
    expect(r.success).toBe(false);
  });

  it("rejects password shorter than 6 characters", () => {
    const r = loginSchema.safeParse({ email: "a@b.co", password: "short" });
    expect(r.success).toBe(false);
  });

  it("accepts valid credentials", () => {
    const r = loginSchema.safeParse({
      email: "user@example.com",
      password: "123456",
    });
    expect(r.success).toBe(true);
  });
});

describe("registerSchema", () => {
  it("rejects mismatched passwords", () => {
    const r = registerSchema.safeParse({
      email: "u@example.com",
      confirmEmail: "u@example.com",
      password: "123456",
      confirmPassword: "654321",
    });
    expect(r.success).toBe(false);
  });

  it("rejects mismatched emails", () => {
    const r = registerSchema.safeParse({
      email: "u@example.com",
      confirmEmail: "other@example.com",
      password: "123456",
      confirmPassword: "123456",
    });
    expect(r.success).toBe(false);
  });

  it("accepts valid registration payload", () => {
    const r = registerSchema.safeParse({
      fullName: "Club Norte",
      email: "club@example.com",
      confirmEmail: "club@example.com",
      password: "123456",
      confirmPassword: "123456",
    });
    expect(r.success).toBe(true);
  });
});
