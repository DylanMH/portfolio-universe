import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Navigation } from './Navigation'
import { useSceneStore } from '@/store/sceneStore'

describe('Navigation', () => {
  beforeEach(() => {
    useSceneStore.getState().returnHome()
  })

  it('renders navigation buttons', () => {
    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    )
    expect(screen.getByText('Featured Projects')).toBeInTheDocument()
    expect(screen.getByText('GitHub Universe')).toBeInTheDocument()
  })

  it('navigates to a section when a nav button is clicked', () => {
    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    )
    fireEvent.click(screen.getByText('Skills'))
    expect(useSceneStore.getState().currentSection).toBe('skills')
  })
})
