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

function getBlackHoleShaders(nsteps: number, step: number, diskIntensity: number) {
  const vertexShader = `
    varying vec3 vRayDir;

    void main() {
      vec4 world = modelMatrix * vec4(position, 1.0);
      vRayDir = normalize(world.xyz - cameraPosition);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `

  const fragmentShader = `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif

    #define PI 3.14159265359
    #define STEP ${step.toFixed(4)}
    #define NSTEPS ${nsteps}
    #define DISK_IN ${DISK_IN.toFixed(4)}
    #define DISK_OUT ${DISK_OUT.toFixed(4)}
    #define DISK_HALF 0.15
    #define DISK_INTENSITY ${diskIntensity.toFixed(2)}

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

      // Cheap rejection: the straight-line impact parameter is an upper bound
      // on how close this ray can ever get (bending only pulls it inward, and
      // at this distance bending is negligible). Pixels that cannot reach the
      // disk or horizon skip the march entirely.
      if (h2 > 45.5) {
        discard;
      }

      vec4 color = vec4(0.0);
      bool hitHorizon = false;
      float dist = length(point);

      for (int i = 0; i < NSTEPS; i++) {
        vec3 oldpoint = point;
        // Larger steps far away (curvature negligible), finer near the hole.
        float ds = STEP * clamp(dist * 0.3, 0.4, 1.2);
        point += velocity * ds;
        float r2 = dot(point, point);
        vec3 accel = -1.5 * h2 * point / (r2 * r2 * sqrt(r2));
        velocity += accel * ds;
        dist = length(point);

        if (dist < 1.0 && length(oldpoint) > 1.0) {
          hitHorizon = true;
          break;
        }

        // Early escape: past periapsis, beyond the disk, heading outward —
        // the ray can never return to the disk or horizon.
        if (dist > 6.0 && dot(point, velocity) > 0.0) {
          break;
        }

        // Volumetric thin-disk: every step near the disk plane contributes a
        // density-weighted sample. No binary plane-crossing test, so there is
        // no per-pixel aliasing for GPU float differences to amplify.
        // The tight |y| gate keeps far-field rays from accumulating a faint
        // haze across the whole bounding sphere (visible as a circular aura).
        float radial = length(point.xz);
        if (radial >= DISK_IN && radial <= DISK_OUT && abs(point.y) < 0.3) {
          float phi = atan(point.x, point.z);
          phi -= uTime;
          phi = mod(phi, 2.0 * PI);

          vec2 tex_coord = vec2(phi / (2.0 * PI), 1.0 - (radial - DISK_IN) / (DISK_OUT - DISK_IN));
          vec3 disk_color = texture2D(uDiskTexture, tex_coord, 0.5).rgb;
          float density = exp(-(point.y * point.y) / (2.0 * DISK_HALF * DISK_HALF));
          float disk_alpha = clamp(dot(disk_color, disk_color) / 6.0, 0.0, 1.0);
          disk_alpha *= smoothstep(DISK_OUT, DISK_OUT * 0.75, radial) * smoothstep(DISK_IN * 0.95, DISK_IN * 1.2, radial);
          disk_alpha *= density;

          color += vec4(disk_color, 1.0) * disk_alpha * ds * DISK_INTENSITY;
        }
      }

      if (hitHorizon) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
      }

      // Premultiplied compositing (OneFactor / OneMinusSrcAlpha): faint
      // accumulation blends with the sky instead of occluding it as a dark
      // halo. Near-zero fragments are discarded to save blending work.
      float alpha = clamp(color.a, 0.0, 1.0);
      if (alpha < 0.015) {
        discard;
      }
      gl_FragColor = vec4(color.rgb, alpha);
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
  texture.wrapS = THREE.MirroredRepeatWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.generateMipmaps = true
  texture.anisotropy = 16
}

function BlackHoleDisk({ quality }: { quality: QualityLevel }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const diskTexture = useTextureAsync('/assets/black-hole/accretion_disk.png', THREE.SRGBColorSpace, configureDiskTexture)
  const isHigh = quality === 'high'
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const step = isHigh ? 0.1 : isMobile ? 0.11 : 0.12
  const nsteps = isHigh ? 450 : 400
  const diskIntensity = isHigh ? 2.1 : 2.75
  const segments: [number, number] = isHigh ? [64, 48] : [48, 36]
  const { vertexShader, fragmentShader } = useMemo(
    () => getBlackHoleShaders(nsteps, step, diskIntensity),
    [nsteps, step, diskIntensity]
  )

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
        transparent
        depthWrite={false}
        blending={THREE.CustomBlending}
        blendSrc={THREE.OneFactor}
        blendDst={THREE.OneMinusSrcAlphaFactor}
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
