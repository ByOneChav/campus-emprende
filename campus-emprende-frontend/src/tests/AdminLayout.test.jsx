import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, test, expect, vi } from 'vitest'

import AdminLayout from '../components/layout/AdminLayout'

// Mock del contexto de autenticación
vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    user: {
      fullName: 'Juan Pérez',
      email: 'juan@test.com',
    },
  }),
}))

// Mock del sidebar
vi.mock('@/pages/admin/AdminSidebar', () => ({
  default: () => <div>Admin Sidebar</div>,
}))

// Mock de Outlet
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')

  return {
    ...actual,
    Outlet: () => <div>Contenido de página</div>,
  }
})

describe('AdminLayout', () => {

  test('renderiza nombre del usuario', () => {

    // Verifica que se muestre el nombre
    render(
      <MemoryRouter>
        <AdminLayout />
      </MemoryRouter>
    )

    expect(
      screen.getByText('Juan Pérez')
    ).toBeInTheDocument()
  })

  test('renderiza email del usuario', () => {

    // Verifica que se muestre el correo
    render(
      <MemoryRouter>
        <AdminLayout />
      </MemoryRouter>
    )

    expect(
      screen.getByText('juan@test.com')
    ).toBeInTheDocument()
  })

  test('renderiza el sidebar', () => {

    // Verifica que cargue el menú lateral
    render(
      <MemoryRouter>
        <AdminLayout />
      </MemoryRouter>
    )

    expect(
      screen.getByText('Admin Sidebar')
    ).toBeInTheDocument()
  })

  test('renderiza contenido mediante Outlet', () => {

    // Verifica que el layout muestre la página hija
    render(
      <MemoryRouter>
        <AdminLayout />
      </MemoryRouter>
    )

    expect(
      screen.getByText('Contenido de página')
    ).toBeInTheDocument()
  })

})