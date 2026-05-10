import client, { API_BASE_URL, getApiErrorMessage, getAuthToken } from "./client";

describe("api client", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("uses the configured API base URL", () => {
    expect(API_BASE_URL).toBe("http://localhost:8080");
    expect(client.defaults.baseURL).toBe("http://localhost:8080");
  });

  it("returns the auth token from localStorage", () => {
    localStorage.setItem("jwt", "token-123");
    expect(getAuthToken()).toBe("token-123");
  });

  it("adds Authorization when a JWT exists", async () => {
    localStorage.setItem("jwt", "token-123");
    const interceptor = client.interceptors.request.handlers[0].fulfilled;
    const config = await interceptor({ headers: {} });

    expect(config.headers.Authorization).toBe("Bearer token-123");
  });

  it("respects skipAuth in requests", async () => {
    localStorage.setItem("jwt", "token-123");
    const interceptor = client.interceptors.request.handlers[0].fulfilled;
    const config = await interceptor({ headers: {}, skipAuth: true });

    expect(config.headers.Authorization).toBeUndefined();
  });

  it("extracts a clear API error message", () => {
    expect(getApiErrorMessage({ response: { data: { message: "Backend error" } } })).toBe("Backend error");
    expect(getApiErrorMessage(new Error("Network error"))).toBe("Network error");
  });
});
