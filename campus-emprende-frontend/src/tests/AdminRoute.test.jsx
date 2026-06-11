import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, test, expect, vi } from 'vitest'
import AdminRoute from '../components/layout/AdminRoute'

const mockUseAuth = vi.fn()

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}))

describe('AdminRoute', () => {

  test('no renderiza nada cuando loading es true', () => {
    // Simula carga inicial
    mockUseAuth.mockReturnValue({
      loading: true,
      isAuthenticated: false,
      isAdmin: false,
    })

    const { container } = render(
      <MemoryRouter>
        <AdminRoute>
          <div>Contenido</div>
        </AdminRoute>
      </MemoryRouter>
    )

    expect(container.firstChild).toBeNull()
  })

  test('renderiza children si es admin', () => {
    // Usuario administrador
    mockUseAuth.mockReturnValue({
      loading: false,
      isAuthenticated: true,
      isAdmin: true,
    })

    render(
      <MemoryRouter>
        <AdminRoute>
          <div>Panel Admin</div>
        </AdminRoute>
      </MemoryRouter>
    )

    expect(screen.getByText('Panel Admin')).toBeInTheDocument()
  })

  test('redirige si no está autenticado', () => {
    // Usuario sin login
    mockUseAuth.mockReturnValue({
      loading: false,
      isAuthenticated: false,
      isAdmin: false,
    })

    render(
      <MemoryRouter>
        <AdminRoute>
          <div>Panel Admin</div>
        </AdminRoute>
      </MemoryRouter>
    )
  })

  test('redirige si no es administrador', () => {
    // Usuario normal
    mockUseAuth.mockReturnValue({
      loading: false,
      isAuthenticated: true,
      isAdmin: false,
    })

    render(
      <MemoryRouter>
        <AdminRoute>
          <div>Panel Admin</div>
        </AdminRoute>
      </MemoryRouter>
    )
  })

  test('permite acceso cuando cumple condiciones', () => {
    // Admin autenticado
    mockUseAuth.mockReturnValue({
      loading: false,
      isAuthenticated: true,
      isAdmin: true,
    })

    render(
      <MemoryRouter>
        <AdminRoute>
          <h1>Dashboard Admin</h1>
        </AdminRoute>
      </MemoryRouter>
    )

    expect(screen.getByText('Dashboard Admin')).toBeInTheDocument()
  })

})