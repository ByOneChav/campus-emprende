import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { vi } from "vitest";

const mockUseAuth = vi.fn();

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

function renderRoute(authState) {
  mockUseAuth.mockReturnValue(authState);

  return render(
    <MemoryRouter initialEntries={["/dashboard"]}>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div>contenido privado</div>
            </ProtectedRoute>
          }
        />
        <Route path="/auth/login" element={<div>login page</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("ProtectedRoute", () => {
  it("redirects unauthenticated users", () => {
    renderRoute({ isAuthenticated: false, loading: false });

    expect(screen.getByText("login page")).toBeInTheDocument();
  });

  it("renders children for authenticated users", () => {
    renderRoute({ isAuthenticated: true, loading: false });

    expect(screen.getByText("contenido privado")).toBeInTheDocument();
  });
});
