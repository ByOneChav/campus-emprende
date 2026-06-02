import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'

import VerifyEmailPage from '../pages/auth/VerifyEmailPage'

vi.mock('@/api/auth', () => ({
  verifyEmail: vi.fn(),
}))

import { verifyEmail } from '@/api/auth'

describe('VerifyEmailPage', () => {

  test('muestra error si no existe token', async () => {

    render(
      <MemoryRouter>
        <VerifyEmailPage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(
        screen.getByText(/no se encontró ningún token/i)
      ).toBeInTheDocument()
    })
  })

  test('muestra mensaje de éxito cuando la verificación funciona', async () => {

    verifyEmail.mockResolvedValueOnce({})

    render(
      <MemoryRouter initialEntries={['/verify?token=123']}>
        <VerifyEmailPage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(
        screen.getByText(/correo electrónico ha sido verificado/i)
      ).toBeInTheDocument()
    })
  })

  test('muestra mensaje de error cuando falla la verificación', async () => {

    verifyEmail.mockRejectedValueOnce({
      response: {
        data: {
          message: 'Token inválido'
        }
      }
    })

    render(
      <MemoryRouter initialEntries={['/verify?token=123']}>
        <VerifyEmailPage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(
        screen.getByText(/token inválido/i)
      ).toBeInTheDocument()
    })
  })

  test('llama a verifyEmail con el token correcto', async () => {

    verifyEmail.mockResolvedValueOnce({})

    render(
      <MemoryRouter initialEntries={['/verify?token=abc123']}>
        <VerifyEmailPage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(verifyEmail).toHaveBeenCalledWith('abc123')
    })
  })

})