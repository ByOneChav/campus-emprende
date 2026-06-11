import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'

import AdminUsersPage from '../pages/admin/AdminUsersPage'

const mockDispatch = vi.fn()

vi.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: vi.fn(),
}))

vi.mock('@/store/admin/adminThunk', () => ({
  getAllUsersThunk: vi.fn(() => ({ type: 'GET_USERS' })),
}))

import { useSelector } from 'react-redux'
import { getAllUsersThunk } from '@/store/admin/adminThunk'

describe('AdminUsersPage', () => {

  test('llama al thunk al montar el componente', () => {

    useSelector.mockImplementation((cb) =>
      cb({
        admin: {
          allUsers: [],
          loading: false,
        },
      })
    )

    render(
      <MemoryRouter>
        <AdminUsersPage />
      </MemoryRouter>
    )

    expect(getAllUsersThunk).toHaveBeenCalled()
  })

  test('muestra skeletons cuando loading es true', () => {

    useSelector.mockImplementation((cb) =>
      cb({
        admin: {
          allUsers: [],
          loading: true,
        },
      })
    )

    const { container } = render(
      <MemoryRouter>
        <AdminUsersPage />
      </MemoryRouter>
    )

    expect(container.querySelectorAll('.h-24').length).toBe(6)
  })

  test('muestra mensaje cuando no existen usuarios', () => {

    useSelector.mockImplementation((cb) =>
      cb({
        admin: {
          allUsers: [],
          loading: false,
        },
      })
    )

    render(
      <MemoryRouter>
        <AdminUsersPage />
      </MemoryRouter>
    )

    expect(
      screen.getByText(/no se encontraron usuarios/i)
    ).toBeInTheDocument()

    expect(
      screen.getByText(/aún no existen usuarios registrados/i)
    ).toBeInTheDocument()
  })

  test('renderiza información de usuario', () => {

    useSelector.mockImplementation((cb) =>
      cb({
        admin: {
          loading: false,
          allUsers: [
            {
              id: 1,
              fullName: 'Juan Pérez',
              email: 'juan@test.com',
              role: 'STUDENT',
            },
          ],
        },
      })
    )

    render(
      <MemoryRouter>
        <AdminUsersPage />
      </MemoryRouter>
    )

    expect(
      screen.getByText('Juan Pérez')
    ).toBeInTheDocument()

    expect(
      screen.getByText('juan@test.com')
    ).toBeInTheDocument()

    expect(
      screen.getByText('STUDENT')
    ).toBeInTheDocument()
  })

  test('muestra correctamente el total de usuarios', () => {

    useSelector.mockImplementation((cb) =>
      cb({
        admin: {
          loading: false,
          allUsers: [
            {
              id: 1,
              fullName: 'Juan',
              email: 'juan@test.com',
              role: 'STUDENT',
            },
            {
              id: 2,
              fullName: 'Pedro',
              email: 'pedro@test.com',
              role: 'ADMIN',
            },
          ],
        },
      })
    )

    render(
      <MemoryRouter>
        <AdminUsersPage />
      </MemoryRouter>
    )

    expect(
      screen.getByText('2')
    ).toBeInTheDocument()
  })

})