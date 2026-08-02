import { create } from 'zustand'
import type { TransitionState } from '../types/scene'

export interface SceneActions {
  setSelectedObject: (id: string | null) => void
  setHoveredObject: (id: string | null) => void
  setCurrentSection: (id: string | null) => void
  setTransitionState: (state: TransitionState) => void
  setIntroCompleted: (completed: boolean) => void
  setContentPanelOpen: (open: boolean) => void
  setInteractionLocked: (locked: boolean) => void
  returnHome: () => void
  selectSection: (id: string | null) => void
}

export interface SceneStore {
  currentSection: string | null
  selectedObject: string | null
  hoveredObject: string | null
  previousObject: string | null
  transitionState: TransitionState
  introCompleted: boolean
  contentPanelOpen: boolean
  interactionLocked: boolean
}

const initialScene: SceneStore = {
  currentSection: null,
  selectedObject: null,
  hoveredObject: null,
  previousObject: null,
  transitionState: 'idle',
  introCompleted: false,
  contentPanelOpen: false,
  interactionLocked: false,
}

export const useSceneStore = create<SceneStore & SceneActions>((set) => ({
  ...initialScene,
  setSelectedObject: (id) =>
    set((state) => ({ selectedObject: id, previousObject: state.selectedObject })),
  setHoveredObject: (id) => set({ hoveredObject: id }),
  setCurrentSection: (id) => set({ currentSection: id }),
  setTransitionState: (transitionState) => set({ transitionState }),
  setIntroCompleted: (introCompleted) => set({ introCompleted }),
  setContentPanelOpen: (contentPanelOpen) => set({ contentPanelOpen }),
  setInteractionLocked: (interactionLocked) => set({ interactionLocked }),
  returnHome: () =>
    set({
      currentSection: null,
      selectedObject: null,
      contentPanelOpen: false,
      interactionLocked: false,
      transitionState: 'idle',
    }),
  selectSection: (id) =>
    set({
      currentSection: id,
      selectedObject: id,
      interactionLocked: true,
      transitionState: 'traveling',
    }),
}))
