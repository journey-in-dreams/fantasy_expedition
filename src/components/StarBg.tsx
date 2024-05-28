'use client'

import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import {
  AdditiveBlending,
  TextureLoader,
  BufferGeometry,
  BufferAttribute,
  Points,
} from 'three'
import NoSSR from '@/components/NoSSR'
import { standardToWorldHandle } from '@/lib/three'
import { getRandom } from '@/lib/utils'

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

function Star(
  props: JSX.IntrinsicElements['points'] & {
    ignoreWeight: number
    ignoreHeight: number
    count: number
  }
) {
  const { ignoreWeight, ignoreHeight, count } = props

  const ref = useRef<BufferGeometry>(null!)
  const pointsRef = useRef<Points>(null!)

  const obj = useThree()

  const CircleImg = useLoader(TextureLoader, '/star.png')

  const particlesPosition = useMemo(() => {
    const win = window.innerWidth
    const hei = window.innerHeight
    const worldVector = standardToWorldHandle(
      obj.camera,
      {
        x: win - 16,
        y: hei - 16,
      },
      1
    )
    const ignorePo = standardToWorldHandle(
      obj.camera,
      { x: win / 2 + ignoreWeight / 2, y: hei / 2 + ignoreHeight / 2 },
      1
    )
    let permitArea: {
      x: [number, number]
      y: [number, number]
    }[] = [
      { x: [-worldVector.x, -ignorePo.x], y: [ignorePo.y, worldVector.y] },

      { x: [ignorePo.x, worldVector.x], y: [ignorePo.y, worldVector.y] },

      { x: [-worldVector.x, -ignorePo.x], y: [-worldVector.y, -ignorePo.y] },

      { x: [ignorePo.x, worldVector.x], y: [-worldVector.y, -ignorePo.y] },
    ]

    if (ignoreWeight !== 0) {
      permitArea.push({
        x: [-worldVector.x, -ignorePo.x],
        y: [-ignorePo.y, ignorePo.y],
      })
      permitArea.push({
        x: [ignorePo.x, worldVector.x],
        y: [-ignorePo.y, ignorePo.y],
      })
    }

    if (ignoreHeight !== 0) {
      permitArea.push({
        x: [-ignorePo.x, ignorePo.x],
        y: [ignorePo.y, worldVector.y],
      })
      permitArea.push({
        x: [-ignorePo.x, ignorePo.x],
        y: [-worldVector.y, -ignorePo.y],
      })
    }

    let arr: [number, number, number][] = []
    for (let i = 1; i <= count; i++) {
      const k = Math.floor(Math.random() * permitArea.length)
      arr.push([
        getRandom(permitArea[k].x[0], permitArea[k].x[1]),
        getRandom(permitArea[k].y[0], permitArea[k].y[1]),
        1,
      ])
    }
    const positions: Float32Array = arr.reduce(
      (prev: Float32Array, cur, i) => {
        const [x, y, z] = cur
        prev[i * 3] = x
        prev[i * 3 + 1] = y
        prev[i * 3 + 2] = z
        return prev
      },
      new Float32Array(count * 3)
    )
    return positions
  }, [count, ignoreHeight, ignoreWeight, obj.camera])

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

function App(props: {
  children?: React.ReactNode
  ignoreWeight: number
  ignoreHeight: number
  count: number
}) {
  const { ignoreWeight, ignoreHeight, count, children } = props

  return (
    <div className="absolute top-0 left-0 w-[100%] h-[100%] bg-[#000]">
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
          <Star
            ignoreWeight={ignoreWeight}
            ignoreHeight={ignoreHeight}
            count={count}
          ></Star>
        </Suspense>
        {/* <axesHelper>
          <gridHelper args={[100, 10]} rotation={[Math.PI / 2, 0, 0]} />
        </axesHelper> */}
        <OrbitControls enabled={false} />
      </Canvas>
      {children}
    </div>
  )
}

export default function StarBg(
  props: JSX.IntrinsicElements['div'] & {
    children?: React.ReactNode
    ignoreWeight?: number
    ignoreHeight?: number
    count?: number
  }
) {
  const { ignoreWeight = 0, ignoreHeight = 0, count = 108, children } = props
  return (
    <NoSSR>
      <App
        ignoreWeight={ignoreWeight}
        ignoreHeight={ignoreHeight}
        count={count}
      >
        {children}
      </App>
    </NoSSR>
  )
}
