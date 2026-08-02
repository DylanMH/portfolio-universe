import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { MutableRefObject } from 'react'
import { celestialSections, BLACK_HOLE_ID } from '@/content/scene'
import { useSceneStore } from '@/store/sceneStore'
import { useSettingsStore } from '@/store/settingsStore'
import { useResponsiveScene } from '@/hooks/useResponsiveScene'

interface CameraControllerProps {
  planetPositionsRef: MutableRefObject<Record<string, THREE.Vector3>>
}

const homeTargetDesktop = new THREE.Vector3(0, 60, 100)
const homeTargetMobile = new THREE.Vector3(0, 85, 100)
const homeLookAt = new THREE.Vector3(0, 0, 0)
const aboutTargetDesktop = new THREE.Vector3(0, 15, 95)
const aboutTargetMobile = new THREE.Vector3(0, 30, 125)
const selectedLookOffset = new THREE.Vector3(3.5, 0, 0)
const aboutLookOffset = new THREE.Vector3(30, 0, 0)
const selectedLookOffsetMobile = new THREE.Vector3(0, -4, 0)
const aboutLookOffsetMobile = new THREE.Vector3(0, -23, 0)

export function CameraController({ planetPositionsRef }: CameraControllerProps) {
  const { camera } = useThree()
  const currentSection = useSceneStore((state) => state.currentSection)
  const transitionState = useSceneStore((state) => state.transitionState)
  const setTransitionState = useSceneStore((state) => state.setTransitionState)
  const setInteractionLocked = useSceneStore((state) => state.setInteractionLocked)
  const reducedMotion = useSettingsStore((state) => state.reducedMotion)
  const { isMobile } = useResponsiveScene('high')

  const targetPos = useRef(new THREE.Vector3().copy(homeTargetDesktop))
  const targetLook = useRef(new THREE.Vector3().copy(homeLookAt))

  useEffect(() => {
    if (currentSection === null) {
      targetPos.current.copy(isMobile ? homeTargetMobile : homeTargetDesktop)
      targetLook.current.copy(homeLookAt)
    } else if (currentSection === BLACK_HOLE_ID) {
      targetPos.current.copy(isMobile ? aboutTargetMobile : aboutTargetDesktop)
      targetLook.current.copy(homeLookAt).add(isMobile ? aboutLookOffsetMobile : aboutLookOffset)
    } else {
      const section = celestialSections.find((s) => s.id === currentSection)
      const position = planetPositionsRef.current?.[currentSection]
      if (section && position) {
        const offset = isMobile ? section.mobileCameraOffset : section.cameraOffset
        targetPos.current.set(position.x + offset[0], position.y + offset[1], position.z + offset[2])
        targetLook.current.copy(position).add(isMobile ? selectedLookOffsetMobile : selectedLookOffset)
      }
    }

    if (reducedMotion) {
      camera.position.copy(targetPos.current)
      camera.lookAt(targetLook.current)
      if (transitionState === 'traveling') {
        setTransitionState('arriving')
        setInteractionLocked(false)
      }
    }
  }, [currentSection, isMobile, planetPositionsRef, reducedMotion, camera, transitionState, setTransitionState, setInteractionLocked])

  useFrame(() => {
    if (currentSection && currentSection !== BLACK_HOLE_ID) {
      const section = celestialSections.find((item) => item.id === currentSection)
      const position = planetPositionsRef.current[currentSection]
      if (section && position) {
        const offset = isMobile ? section.mobileCameraOffset : section.cameraOffset
        targetPos.current.set(position.x + offset[0], position.y + offset[1], position.z + offset[2])
        targetLook.current.copy(position).add(isMobile ? selectedLookOffsetMobile : selectedLookOffset)
      }
    }

    if (reducedMotion) return

    const lerpSpeed = isMobile ? 0.08 : 0.04
    camera.position.lerp(targetPos.current, lerpSpeed)
    camera.lookAt(targetLook.current)

    if (transitionState === 'traveling') {
      const distance = camera.position.distanceTo(targetPos.current)
      if (distance < 1.5) {
        setTransitionState('arriving')
        setInteractionLocked(false)
      }
    }
  })

  return null
}
