import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'

import MyProfilePage from '../pages/profile/MyProfilePage'

const mockStore = configureStore({
  reducer: {
    auth: () => ({
      user: {
        fullName: 'Juan Pérez',
        linkedinUrl: '',
      },
      token: 'fake-token',
      loading: false,
    }),
  },
})

const renderComponent = () => {
  render(
    <Provider store={mockStore}>
      <BrowserRouter>
        <MyProfilePage />
      </BrowserRouter>
    </Provider>
  )
}

describe('Pagina de perfil', () => {

  test('renderiza formulario perfil', async () => {
    renderComponent()

    const input = await screen.findByPlaceholderText(
      /linkedin\.com/i
    )

    expect(input).toBeInTheDocument()
  })

  test('renderiza input linkedin', async () => {
    renderComponent()

    const input = await screen.findByPlaceholderText(
      /linkedin\.com/i
    )

    expect(input).toBeInTheDocument()
  })

  test('permite escribir linkedin', async () => {
    renderComponent()

    const input = await screen.findByPlaceholderText(
      /linkedin\.com/i
    )

    await userEvent.type(
      input,
      'https://linkedin.com/in/test'
    )

    expect(input).toHaveValue(
      'https://linkedin.com/in/test'
    )
  })

})