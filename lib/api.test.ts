import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

beforeEach(() => {
  process.env.NEXT_PUBLIC_AUTH_SERVICE_URL = "http://localhost:9999";
  process.env.SESSION_COOKIE_NAME = "auth_session";
  vi.resetModules();
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("apiFetch", () => {
  it("returns data on 200", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({ hello: "world" }),
        }),
      ),
    );
    const { apiFetch } = await import("./api");
    const result = await apiFetch<{ hello: string }>("/test");
    expect(result.error).toBeNull();
    if (result.data === null) throw new Error("expected data");
    expect(result.data.hello).toBe("world");
  });

  it("returns error on 401", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Promise.resolve({
          ok: false,
          status: 401,
          json: async () => ({ message: "Unauthorized" }),
        }),
      ),
    );
    const { apiFetch } = await import("./api");
    const result = await apiFetch<unknown>("/x");
    expect(result.data).toBeNull();
    if (result.error === null) throw new Error("expected error");
    expect(result.error.status).toBe(401);
    expect(result.error.message).toBe("Unauthorized");
  });

  it("returns error on 500 with fallback message", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Promise.resolve({
          ok: false,
          status: 500,
          json: async () => ({}),
        }),
      ),
    );
    const { apiFetch } = await import("./api");
    const result = await apiFetch<unknown>("/x");
    expect(result.data).toBeNull();
    if (result.error === null) throw new Error("expected error");
    expect(result.error.message).toBe("Ocurrió un error inesperado");
  });

  it("returns error on network failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Promise.reject(new Error("network"))),
    );
    const { apiFetch } = await import("./api");
    const result = await apiFetch<unknown>("/x");
    expect(result.data).toBeNull();
    if (result.error === null) throw new Error("expected error");
    expect(result.error.message).toBe("Error de red");
    expect(result.error.status).toBe(0);
  });
});
