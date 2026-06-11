import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, test, expect, vi } from 'vitest'

import Navbar from '../components/layout/Navbar'

const mockUseAuth = vi.fn()

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}))

describe('Navbar', () => {

  test('renderiza logo Campus Emprende', () => {

    // Verifica que el logo principal exista
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
    })

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )

    expect(
      screen.getByText('Campus Emprende')
    ).toBeInTheDocument()
  })

  test('renderiza enlace explorar servicios', () => {

    // Verifica navegación pública
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
    })

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )

    expect(
      screen.getByText('Explorar servicios')
    ).toBeInTheDocument()
  })

  test('renderiza botones acceso y registro cuando no hay sesión', () => {

    // Usuario no autenticado
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
    })

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )

    expect(
      screen.getByText('Acceso')
    ).toBeInTheDocument()

    expect(
      screen.getByText('Registro')
    ).toBeInTheDocument()
  })

  test('muestra dashboard cuando usuario está autenticado', () => {

    // Usuario autenticado
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isAdmin: false,
      user: {
        fullName: 'Juan Pérez',
        email: 'juan@test.com',
      },
    })

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )

    expect(
      screen.getByText('Dashboard')
    ).toBeInTheDocument()
  })

  test('muestra enlace admin cuando usuario es administrador', () => {

    // Usuario administrador
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isAdmin: true,
      user: {
        fullName: 'Admin Test',
        email: 'admin@test.com',
      },
    })

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )

    expect(
      screen.getByText('Admin')
    ).toBeInTheDocument()
  })

})