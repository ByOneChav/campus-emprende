import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'

import RegisterPage from '../pages/auth/RegisterPage'

const mockStore = configureStore({
  reducer: {
    auth: () => ({
      user: null,
      token: null,
      loading: false,
    }),
  },
})

const renderComponent = () => {
  render(
    <Provider store={mockStore}>
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    </Provider>
  )
}

describe('RegisterPage', () => {

  test('renderiza correctamente la pagina', () => {
    renderComponent()

    expect(
      screen.getAllByText(/campus emprende/i).length
    ).toBeGreaterThan(0)
  })

  test('renderiza el input nombre completo', () => {
    renderComponent()

    expect(
      screen.getByLabelText(/nombre completo/i)
    ).toBeInTheDocument()
  })

  test('renderiza el input email', () => {
    renderComponent()

    expect(
      screen.getByLabelText(/correo/i)
    ).toBeInTheDocument()
  })

  test('renderiza el input password', () => {
    renderComponent()

    expect(
      screen.getByLabelText(/contraseña/i)
    ).toBeInTheDocument()
  })

  test('permite escribir nombre completo', async () => {
    renderComponent()

    const input = screen.getByLabelText(/nombre completo/i)

    await userEvent.type(input, 'Juan Perez')

    expect(input.value).toBe('Juan Perez')
  })

  test('permite escribir email', async () => {
    renderComponent()

    const input = screen.getByLabelText(/correo/i)

    await userEvent.type(input, 'juan@gmail.com')

    expect(input.value).toBe('juan@gmail.com')
  })

  test('permite escribir password', async () => {
    renderComponent()

    const input = screen.getByLabelText(/contraseña/i)

    await userEvent.type(input, '123456')

    expect(input.value).toBe('123456')
  })

  test('renderiza boton crear cuenta', () => {
    renderComponent()

    expect(
      screen.getByRole('button')
    ).toBeInTheDocument()
  })

  test('boton contiene texto crear cuenta', () => {
  renderComponent()

  expect(
    screen.getByText(/crear una cuenta/i)
  ).toBeInTheDocument()
  })

})