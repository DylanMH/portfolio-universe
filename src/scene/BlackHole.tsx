import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useSceneStore } from '@/store/sceneStore'
import type { QualityLevel } from '@/types/scene'
import { useTextureAsync } from '@/hooks/useTextureAsync'

const DISK_IN = 1.5
const DISK_OUT = 5.0
// World-space radius (in scene units) that the shader's unit-radius event
// horizon represents. This makes the black hole a fixed real size in the
// scene (like any other object), so it scales naturally with perspective
// instead of ballooning on narrow/mobile viewports.
const WORLD_SCALE = 6
const BH_SCALE = 1 / WORLD_SCALE

function getBlackHoleShaders(nsteps: number, step: number) {
  const vertexShader = `
    varying vec3 vRayDir;

    void main() {
      vec4 world = modelMatrix * vec4(position, 1.0);
      vRayDir = normalize(world.xyz - cameraPosition);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `

  const fragmentShader = `
    #define PI 3.14159265359
    #define STEP ${step.toFixed(4)}
    #define NSTEPS ${nsteps}
    #define DISK_IN ${DISK_IN.toFixed(4)}
    #define DISK_OUT ${DISK_OUT.toFixed(4)}

    uniform float uTime;
    uniform float uScale;
    uniform sampler2D uDiskTexture;

    varying vec3 vRayDir;

    void main() {
      vec3 cam_pos = cameraPosition * uScale;
      vec3 ray_dir = normalize(vRayDir);
      vec3 point = cam_pos;
      vec3 velocity = ray_dir;
      vec3 c = cross(point, velocity);
      float h2 = dot(c, c);

      vec4 color = vec4(0.0);
      bool hasHit = false;

      for (int i = 0; i < NSTEPS; i++) {
        vec3 oldpoint = point;
        point += velocity * STEP;
        vec3 accel = -1.5 * h2 * point / pow(dot(point, point), 2.5);
        velocity += accel * STEP;
        float dist = length(point);

        bool horizon_mask = dist < 1.0 && length(oldpoint) > 1.0;
        if (horizon_mask) {
          hasHit = true;
          color = vec4(0.0, 0.0, 0.0, 1.0);
          break;
        }

        if (oldpoint.y * point.y < 0.0) {
          float lambda = -oldpoint.y / velocity.y;
          vec3 intersection = oldpoint + lambda * velocity;
          float r = length(intersection);
          if (r >= DISK_IN && r <= DISK_OUT) {
            float phi = atan(intersection.x, intersection.z);
            phi -= uTime;
            phi = mod(phi, 2.0 * PI);

            vec2 tex_coord = vec2(phi / (2.0 * PI), 1.0 - (r - DISK_IN) / (DISK_OUT - DISK_IN));
            vec4 tex_color = texture2D(uDiskTexture, tex_coord);
            vec3 disk_color = tex_color.rgb;
            float disk_alpha = clamp(dot(disk_color, disk_color) / 4.5, 0.0, 1.0);
            float fade = smoothstep(DISK_OUT, DISK_OUT * 0.82, r);
            disk_alpha *= fade;

            if (disk_alpha > 0.0) {
              hasHit = true;
            }

            color += vec4(disk_color, 1.0) * disk_alpha;
          }
        }
      }

      if (!hasHit) {
        discard;
      }

      gl_FragColor = color;
    }
  `

  return { vertexShader, fragmentShader }
}

function BlackHoleSimple() {
  const horizonRadius = WORLD_SCALE * 1.5
  const innerGlowIn = WORLD_SCALE * 1.55
  const innerGlowOut = WORLD_SCALE * 2.2
  const outerGlowIn = WORLD_SCALE * 2.2
  const outerGlowOut = WORLD_SCALE * 3.5

  return (
    <group>
      <mesh>
        <sphereGeometry args={[horizonRadius, 32, 24]} />
        <meshBasicMaterial color="black" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[innerGlowIn, innerGlowOut, 96]} />
        <meshBasicMaterial
          color="#f59e0b"
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[outerGlowIn, outerGlowOut, 96]} />
        <meshBasicMaterial
          color="#d97706"
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

const configureDiskTexture = (texture: THREE.Texture) => {
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.generateMipmaps = true
  texture.anisotropy = 8
}

function BlackHoleDisk({ quality }: { quality: QualityLevel }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const diskTexture = useTextureAsync('/assets/black-hole/accretion_disk.png', THREE.SRGBColorSpace, configureDiskTexture)
  const isHigh = quality === 'high'
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const step = isHigh ? 0.1 : isMobile ? 0.12 : 0.13
  const nsteps = isHigh ? 500 : isMobile ? 400 : 400
  const segments: [number, number] = isHigh ? [64, 48] : [48, 36]
  const { vertexShader, fragmentShader } = useMemo(() => getBlackHoleShaders(nsteps, step), [nsteps, step])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScale: { value: BH_SCALE },
      uDiskTexture: { value: diskTexture },
    }),
    [diskTexture]
  )

  useFrame((_, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta * 0.5
    }
  })

  if (!diskTexture) {
    return <BlackHoleSimple />
  }

  const sphereRadius = WORLD_SCALE * DISK_OUT * (isMobile ? 1.5 : 2)

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[sphereRadius, ...segments]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  )
}

export function BlackHole({ quality }: { quality: QualityLevel }) {
  const selectSection = useSceneStore((state) => state.selectSection)

  const handleClick = () => {
    selectSection('about')
    window.history.pushState({}, '', '/about')
    window.dispatchEvent(new PopStateEvent('popstate'))
  }
  const handlePointerOver = () => {
    document.body.style.cursor = 'pointer'
  }
  const handlePointerOut = () => {
    document.body.style.cursor = 'auto'
  }

  return (
    <group>
      {quality === 'low' ? <BlackHoleSimple key="simple" /> : <BlackHoleDisk key="disk" quality={quality} />}
      <mesh
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[WORLD_SCALE * 6, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  )
}
