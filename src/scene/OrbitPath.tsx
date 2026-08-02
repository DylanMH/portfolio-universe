import { useMemo } from 'react'
import * as THREE from 'three'
import { Line } from '@react-three/drei'

interface OrbitPathProps {
  radius: number
  color?: string
}

export function OrbitPath({ radius, color = '#ffffff' }: OrbitPathProps) {
  const points = useMemo(() => {
    const arr: THREE.Vector3[] = []
    const segments = 128
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2
      arr.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius))
    }
    return arr
  }, [radius])

  return <Line points={points} color={color} lineWidth={1} opacity={0.25} transparent />
}
