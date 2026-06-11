import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, test, expect, vi, beforeEach } from "vitest";

import ServicesPage from "../pages/services/ServicesPage";

const mockDispatch = vi.fn();




vi.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
  useSelector: vi.fn(),
}));

vi.mock("@/context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/store/service/serviceThunk", () => ({
  browseServicesThunk: vi.fn(() => ({
    type: "BROWSE_SERVICES",
  })),
}));

import { useSelector } from "react-redux";
import { useAuth } from "@/context/AuthContext";
import { browseServicesThunk } from "@/store/service/serviceThunk";

describe("ServicesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renderiza marketplace universitario", () => {
    // Verifica badge principal

    useAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
    });

    useSelector.mockImplementation((cb) =>
      cb({
        service: {
          services: [],
          loading: false,
        },
      })
    );

    render(
      <MemoryRouter>
        <ServicesPage />
      </MemoryRouter>
    );

    expect(
      screen.getByText("Marketplace universitario")
    ).toBeInTheDocument();
  });

  test("renderiza titulo explorar servicios", () => {
    // Verifica titulo principal

    useAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
    });

    useSelector.mockImplementation((cb) =>
      cb({
        service: {
          services: [],
          loading: false,
        },
      })
    );

    render(
      <MemoryRouter>
        <ServicesPage />
      </MemoryRouter>
    );

    expect(
      screen.getByText("Explorar servicios")
    ).toBeInTheDocument();
  });

  test("renderiza buscador", () => {
    // Verifica input de búsqueda

    useAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
    });

    useSelector.mockImplementation((cb) =>
      cb({
        service: {
          services: [],
          loading: false,
        },
      })
    );

    render(
      <MemoryRouter>
        <ServicesPage />
      </MemoryRouter>
    );

    expect(
      screen.getByPlaceholderText(
        "Buscar por título o descripción..."
      )
    ).toBeInTheDocument();
  });

  test("ejecuta browseServicesThunk al montar", () => {
    // Verifica carga inicial de servicios

    useAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
    });

    useSelector.mockImplementation((cb) =>
      cb({
        service: {
          services: [],
          loading: false,
        },
      })
    );

    render(
      <MemoryRouter>
        <ServicesPage />
      </MemoryRouter>
    );

    expect(browseServicesThunk).toHaveBeenCalled();
  });

  test("muestra boton ofrecer servicio cuando usuario esta autenticado", () => {
    // Verifica botón para publicar servicio

    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: {
        id: 1,
      },
    });

    useSelector.mockImplementation((cb) =>
      cb({
        service: {
          services: [],
          loading: false,
        },
      })
    );

    render(
      <MemoryRouter>
        <ServicesPage />
      </MemoryRouter>
    );

    expect(
      screen.getByText("Ofrecer un servicio")
    ).toBeInTheDocument();
  });

  test("muestra mensaje cuando no existen servicios", () => {
    // Verifica estado vacío

    useAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
    });

    useSelector.mockImplementation((cb) =>
      cb({
        service: {
          services: [],
          loading: false,
        },
      })
    );

    render(
      <MemoryRouter>
        <ServicesPage />
      </MemoryRouter>
    );

    expect(
      screen.getByText("No se encontraron servicios")
    ).toBeInTheDocument();
  });

  test("renderiza servicio recibido desde redux", () => {
    // Verifica renderizado de servicios

    useAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
    });

    useSelector.mockImplementation((cb) =>
      cb({
        service: {
          loading: false,
          services: [
            {
              id: 1,
              title: "Diseño Web",
              providerName: "Juan Pérez",
              category: "WEB_DEV",
              description: "Servicio de prueba",
            },
          ],
        },

        comment: {
          byServiceId: {},
          submitting: false,
        },
      })
    );

    render(
      <MemoryRouter>
        <ServicesPage />
      </MemoryRouter>
    );

    expect(
      screen.getByText("Diseño Web")
    ).toBeInTheDocument();
  });
});