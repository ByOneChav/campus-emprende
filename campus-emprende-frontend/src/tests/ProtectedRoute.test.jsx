import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, test, expect, vi } from 'vitest'
import ProtectedRoute from '../components/layout/ProtectedRoute'

const mockUseAuth = vi.fn()

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}))

describe('ProtectedRoute', () => {

  test('no renderiza nada durante loading', () => {
    // Estado de carga
    mockUseAuth.mockReturnValue({
      loading: true,
      isAuthenticated: false,
    })

    const { container } = render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Privado</div>
        </ProtectedRoute>
      </MemoryRouter>
    )

    expect(container.firstChild).toBeNull()
  })

  test('muestra children si está autenticado', () => {
    // Usuario logueado
    mockUseAuth.mockReturnValue({
      loading: false,
      isAuthenticated: true,
    })

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Zona privada</div>
        </ProtectedRoute>
      </MemoryRouter>
    )

    expect(screen.getByText('Zona privada')).toBeInTheDocument()
  })

  test('permite renderizar contenido protegido', () => {
    mockUseAuth.mockReturnValue({
      loading: false,
      isAuthenticated: true,
    })

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <h1>Dashboard</h1>
        </ProtectedRoute>
      </MemoryRouter>
    )

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  test('mantiene acceso cuando usuario existe', () => {
    mockUseAuth.mockReturnValue({
      loading: false,
      isAuthenticated: true,
    })

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <span>Acceso válido</span>
        </ProtectedRoute>
      </MemoryRouter>
    )

    expect(screen.getByText('Acceso válido')).toBeInTheDocument()
  })

  test('renderiza correctamente contenido protegido', () => {
    mockUseAuth.mockReturnValue({
      loading: false,
      isAuthenticated: true,
    })

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <p>Contenido privado</p>
        </ProtectedRoute>
      </MemoryRouter>
    )

    expect(screen.getByText('Contenido privado')).toBeInTheDocument()
  })

})