import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, test, expect } from 'vitest'
import Footer from '../components/layout/Footer'

describe('Footer', () => {

  test('renderiza nombre de la plataforma', () => {
    // Verifica branding
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    )

    expect(
      screen.getByText('Campus Emprende')
    ).toBeInTheDocument()
  })

  test('renderiza marketplace universitario', () => {
    // Verifica texto principal
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    )

    expect(
      screen.getByText(/Marketplace universitario/i)
    ).toBeInTheDocument()
  })

  test('renderiza enlace explorar servicios', () => {
    // Verifica navegación
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    )

    expect(
      screen.getByText(/Explorar servicios/i)
    ).toBeInTheDocument()
  })

  test('renderiza sección plataforma activa', () => {
    // Verifica estado visual
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    )

    expect(
      screen.getByText(/Plataforma activa/i)
    ).toBeInTheDocument()
  })

  test('renderiza comunidad universitaria', () => {
    // Verifica contenido informativo
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    )

    expect(
      screen.getByText(/Comunidad universitaria/i)
    ).toBeInTheDocument()
  })

})