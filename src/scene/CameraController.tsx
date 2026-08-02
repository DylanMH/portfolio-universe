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

const homeTargetMobile = new THREE.Vector3(0, 85, 100)
// Steep "system map" elevation: shallow angles let near-side planets dive
// under the camera and off the bottom of the frame, no matter the distance.
const HOME_ELEVATION = THREE.MathUtils.degToRad(50)
// Farthest planet orbit plus clearance for the planet body itself.
const OUTER_ORBIT_CLEARANCE = 125
const ORBIT_FIT_MARGIN = THREE.MathUtils.degToRad(4)

function computeHomeTargetDesktop(camera: THREE.Camera, out: THREE.Vector3) {
  const perspective = camera as THREE.PerspectiveCamera
  const halfVerticalFov = THREE.MathUtils.degToRad((perspective.fov || 60) / 2)
  const halfHorizontalFov = Math.atan(Math.tan(halfVerticalFov) * (perspective.aspect || 1))

  // Distance so the near edge of the outer orbit stays inside the bottom of
  // the frame when looking down at the system from HOME_ELEVATION.
  const tanDown = Math.tan(HOME_ELEVATION + halfVerticalFov - ORBIT_FIT_MARGIN)
  const dVertical =
    (OUTER_ORBIT_CLEARANCE * tanDown) / (tanDown * Math.cos(HOME_ELEVATION) - Math.sin(HOME_ELEVATION))
  // Distance so the sides of the outer orbit stay inside the horizontal FOV.
  const dHorizontal = OUTER_ORBIT_CLEARANCE / Math.tan(halfHorizontalFov - ORBIT_FIT_MARGIN)

  const d = Math.max(dVertical, dHorizontal, 100)
  return out.set(0, d * Math.sin(HOME_ELEVATION), d * Math.cos(HOME_ELEVATION))
}
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

  const targetPos = useRef(new THREE.Vector3(0, 60, 100))
  const targetLook = useRef(new THREE.Vector3().copy(homeLookAt))
  const travelStart = useRef<number | null>(null)

  useEffect(() => {
    if (currentSection === null) {
      if (isMobile) targetPos.current.copy(homeTargetMobile)
      else computeHomeTargetDesktop(camera, targetPos.current)
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
    if (!currentSection && !isMobile) {
      // Recompute every frame so window resizes keep the outer orbit in view.
      computeHomeTargetDesktop(camera, targetPos.current)
    }

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

    // Once arrived, follow the (still orbiting) planet with a fast lerp so
    // the view stays locked on. The slow travel lerp can never fully catch
    // the outer planets — their tangential speed exceeds its closing speed
    // near the target — so arrival also has a time-based failsafe.
    const following =
      !!currentSection && currentSection !== BLACK_HOLE_ID && transitionState !== 'traveling'
    const lerpSpeed = following ? 0.5 : isMobile ? 0.08 : 0.04
    camera.position.lerp(targetPos.current, lerpSpeed)
    camera.lookAt(targetLook.current)

    if (transitionState === 'traveling') {
      if (travelStart.current === null) travelStart.current = performance.now()
      const distance = camera.position.distanceTo(targetPos.current)
      const elapsed = performance.now() - travelStart.current
      if (distance < 1.5 || elapsed > 3500) {
        setTransitionState('arriving')
        setInteractionLocked(false)
        travelStart.current = null
      }
    } else {
      travelStart.current = null
    }
  })

  return null
}
