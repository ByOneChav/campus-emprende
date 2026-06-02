import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'

import CreateServicePage from '../pages/services/CreateServicePage'

const renderComponent = () => {
  render(
    <BrowserRouter>
      <CreateServicePage />
    </BrowserRouter>
  )
}

describe('Página crear servicio', () => {

  test('renderiza correctamente la página', async () => {
    renderComponent()

    expect(
      await screen.findByText(/ofrecer un servicio/i)
    ).toBeInTheDocument()
  })

  test('renderiza input título', async () => {
    renderComponent()

    const inputs = await screen.findAllByRole('textbox')

    expect(inputs.length).toBeGreaterThan(0)
  })

  test('renderiza input descripción', async () => {
    renderComponent()

    const textareas = await screen.findAllByRole('textbox')

    expect(textareas.length).toBeGreaterThan(0)
  })

  test('permite escribir título', async () => {
    renderComponent()

    const inputs = await screen.findAllByRole('textbox')

    const inputTitulo = inputs[0]

    await userEvent.type(inputTitulo, 'Servicio de diseño')

    expect(inputTitulo).toHaveValue('Servicio de diseño')
  })

  test('renderiza botón publicar servicio', async () => {
    renderComponent()

    const botones = await screen.findAllByRole('button')

    expect(botones.length).toBeGreaterThan(0)
  })

})