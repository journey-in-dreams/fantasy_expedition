'use client'

import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import {
  AdditiveBlending,
  TextureLoader,
  BufferGeometry,
  BufferAttribute,
  Points,
  Vector3,
  Raycaster,
  Camera,
} from 'three'

const particleVertexShader = [
  'attribute vec3  customColor;',
  'attribute float customOpacity;',
  'attribute float customSize;',
  'attribute float customAngle;',
  'attribute float customVisible;',
  'varying vec4  vColor;',
  'varying float vAngle;',
  'void main()',
  '{',
  'if ( customVisible > 0.5 )',
  'vColor = vec4( customColor, customOpacity );',
  'else',
  'vColor = vec4(0,0,0,0);',
  'vAngle = customAngle;',
  'vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );',
  'gl_PointSize = customSize * ( 300.0 / length( mvPosition.xyz ) );',
  'gl_Position = projectionMatrix * mvPosition;',
  '}',
].join('\n')
const particleFragmentShader = [
  'uniform sampler2D myTexture;',
  'varying vec4 vColor;',
  'varying float vAngle;',
  'void main()',
  '{',
  'gl_FragColor = vColor;',
  'float c = cos(vAngle);',
  'float s = sin(vAngle);',
  'vec2 rotatedUV = vec2(c * (gl_PointCoord.x - 0.5) + s * (gl_PointCoord.y - 0.5) + 0.5,',
  'c * (gl_PointCoord.y - 0.5) - s * (gl_PointCoord.x - 0.5) + 0.5);',
  'vec4 rotatedTexture = texture2D( myTexture,  rotatedUV );',
  'gl_FragColor = gl_FragColor * rotatedTexture;',
  '}',
].join('\n')

function getRandom(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// 世界坐标转屏幕坐标
function worldToStandardHandle(
  camera: Camera,
  { x, y, z }: { x: number; y: number; z: number }
) {
  const worldVector = new Vector3(x, y, z)
  const standardVector = worldVector.project(camera)
  var a = window.innerWidth / 2
  var b = window.innerHeight / 2
  var x1 = Math.round(standardVector.x * a + a)
  var y1 = Math.round(-standardVector.y * b + b)
  return [x1, y1]
}

// 屏幕坐标转世界坐标
function standardToWorldHandle(
  camera: Camera,
  { x, y }: { x: number; y: number },
  z?: number
) {
  const x1 = (x / window.innerWidth) * 2 - 1
  const y1 = -(y / window.innerHeight) * 2 + 1
  //标准设备坐标(z=0.5这个值并没有一个具体的说法)
  const stdVector = new Vector3(x1, y1, 0.5)
  stdVector.unproject(camera)
  var direction = stdVector.sub(camera.position).normalize()
  var distance = -camera.position.z / direction.z
  var worldCoord = camera.position
    .clone()
    .add(direction.multiplyScalar(distance - (z || 0)))
  return worldCoord
}

function Star(props: JSX.IntrinsicElements['points']) {
  const ref = useRef<BufferGeometry>(null!)
  const pointsRef = useRef<Points>(null!)

  const obj = useThree()

  const CircleImg = useLoader(TextureLoader, '/star.png')
  const count = 108

  const particlesPosition = useMemo(() => {
    const win = window.innerWidth
    const hei = window.innerHeight
    const newWorldVector = standardToWorldHandle(
      obj.camera,
      {
        x: win - 16,
        y: hei - 16,
      },
      1
    )
    const positions = new Float32Array(count * 3)
    for (let i = 1; i <= count * 3; i++) {
      if (i % 3 === 0) {
        positions[i] = getRandom(-newWorldVector.x, newWorldVector.x)
      } else if (i % 3 === 1) {
        positions[i] = getRandom(-newWorldVector.y, newWorldVector.y)
      } else {
        positions[i] = 1
      }
    }
    return positions
  }, [count, obj.camera])

  const particlesColors = useMemo(() => {
    const colors = new Float32Array(count * 3)
    for (let i = 1; i <= count * 3; i++) {
      colors[i] = 1
    }
    return colors
  }, [count])

  const particlesOpacities = useMemo(() => {
    const opacities = new Float32Array(count)
    for (let i = 1; i <= count; i++) {
      opacities[i] = Math.random()
    }
    return opacities
  }, [count])

  const particlesCustomVisible = useMemo(() => {
    const visible = new Float32Array(count)
    for (let i = 1; i <= count; i++) {
      visible[i] = Math.random()
    }
    return visible
  }, [count])

  const particlesCustomSize = useMemo(() => {
    const arr: [number, number][] = [
      [20, 20],
      [20, 20],
      [20, 20],
      [30, 30],
      [30, 30],
      [80, 80],
      [30, 30],
      [40, 40],
      [40, 40],
      [20, 20],
      [20, 20],
      [50, 50],
    ]
    const sizes = new Float32Array(count)
    for (let i = 1; i <= count; i++) {
      const k = Math.floor(Math.random() * arr.length)
      sizes[i] = getRandom(arr[k][0], arr[k][1])
    }
    return sizes
  }, [count])

  const particlesCustomAngle = useMemo(() => {
    const angles = new Float32Array(count)
    for (let i = 1; i <= count; i++) {
      angles[i] = 0
    }
    return angles
  }, [count])

  useFrame((state, delta) => {
    // 一般一帧都会小于0.02，大于0.02的时候是页面切换出去停留了比较久，就不处理这次数据
    if (delta > 0.02) return
    const newParticlesOpacities =
      ref.current.getAttribute('customOpacity').array
    const opacities = newParticlesOpacities
    for (let i = 1; i <= count; i++) {
      const count = opacities[i] + delta / 2
      opacities[i] = count > 1 ? 0 : count
    }
    const opacitiesAttribute = new BufferAttribute(opacities, 1)
    ref.current.setAttribute('customOpacity', opacitiesAttribute)
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry ref={ref}>
        <bufferAttribute
          attach="attributes-position"
          array={particlesPosition}
          count={count}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-customColor"
          array={particlesColors}
          count={count}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-customOpacity"
          array={particlesOpacities}
          count={count}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-customVisible"
          array={particlesCustomVisible}
          count={count}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-customSize"
          array={particlesCustomSize}
          count={count}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-customAngle"
          array={particlesCustomAngle}
          count={count}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        uniforms={{
          myTexture: { value: CircleImg },
        }}
        transparent={true}
        // depthWrite={false}
        depthTest={false}
        vertexShader={particleVertexShader}
        fragmentShader={particleFragmentShader}
        vertexColors={true}
        blending={AdditiveBlending}
      />
    </points>
  )
}

export default function App() {
  return (
    <div className="fixed top-0 left-0 bottom-0 right-0 bg-[#000]">
      <Canvas
        camera={{
          position: [0, 0, 100],
          isOrthographicCamera: true,
          aspect: window.innerWidth / window.innerHeight,
        }}
        dpr={window.devicePixelRatio}
      >
        <ambientLight intensity={Math.PI / 2} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          decay={0}
          intensity={Math.PI}
        />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <Suspense fallback={false}>
          <Star />
        </Suspense>
        {/* <axesHelper>
          <gridHelper args={[100, 10]} rotation={[Math.PI / 2, 0, 0]} />
        </axesHelper> */}
        <OrbitControls enabled={false} />
      </Canvas>
      {/* <div className="absolute top-0 w-200 bg-[#fff]">看一下在哪里</div> */}
    </div>
  )
}
