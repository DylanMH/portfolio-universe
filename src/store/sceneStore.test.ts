import { describe, it, expect } from 'vitest'
import { useSceneStore } from './sceneStore'

describe('sceneStore', () => {
  it('starts with no selected section', () => {
    const state = useSceneStore.getState()
    expect(state.currentSection).toBeNull()
    expect(state.selectedObject).toBeNull()
    expect(state.transitionState).toBe('idle')
  })

  it('selects a section and locks interaction', () => {
    useSceneStore.getState().selectSection('projects')
    const state = useSceneStore.getState()
    expect(state.currentSection).toBe('projects')
    expect(state.selectedObject).toBe('projects')
    expect(state.transitionState).toBe('traveling')
    expect(state.interactionLocked).toBe(true)
  })

  it('returns home and resets state', () => {
    useSceneStore.getState().selectSection('projects')
    useSceneStore.getState().returnHome()
    const state = useSceneStore.getState()
    expect(state.currentSection).toBeNull()
    expect(state.selectedObject).toBeNull()
    expect(state.transitionState).toBe('idle')
    expect(state.interactionLocked).toBe(false)
  })
})
