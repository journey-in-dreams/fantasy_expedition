'use client'
import React, { useMemo, useState } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { useSpring, animated, config } from '@react-spring/three'
import {
  AdditiveBlending,
  Mesh,
  Points,
  PointsMaterial,
  TextureLoader,
  BufferGeometry,
} from 'three'

{
  /* <script type="x-shader/x-vertex" id="vertexshader">

attribute float size;
attribute vec3 customColor;

varying vec3 vColor;

void main() {

  vColor = customColor;

  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

  gl_PointSize = size * ( 300.0 / -mvPosition.z );

  gl_Position = projectionMatrix * mvPosition;

}

</script> */
}

{
  /* <script type="x-shader/x-fragment" id="fragmentshader">

uniform vec3 color;
uniform sampler2D pointTexture;

varying vec3 vColor;

void main() {

  gl_FragColor = vec4( color * vColor, 1.0 );
  gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );

}

</script> */
}

function MyRotatingBox() {
  const myMesh = React.useRef<Points>(null!)
  const [active, setActive] = useState(false)

  const { scale, opacity } = useSpring({
    scale: active ? 1.5 : 1,
    config: config.molasses,
    opacity: active ? 0.2 : 0.8,
  })

  // useFrame(({ clock }) => {
  //   const a = clock.getElapsedTime()
  //   myMesh.current.rotation.x = a
  // })

  const CircleImg = useLoader(TextureLoader, '/star.png')
  const count = 180

  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 1; i <= count * 3; i++) {
      if (i % 3 === 0) {
        positions[i] = Math.random() * 16 - 8
      } else if (i % 3 === 1) {
        positions[i] = Math.random() * 10 - 5
      } else {
        positions[i] = Math.random() * 20 - 10
      }
    }
    return positions
  }, [count])

  const particlesSize = useMemo(() => {
    const sizes = new Float32Array(count)
    for (let i = 1; i <= count * 3; i++) {
      sizes[i] = 0
    }
    return sizes
  }, [count])

  return (
    <animated.points ref={myMesh}>
      <animated.bufferGeometry>
        <animated.bufferAttribute
          attach="attributes-position"
          array={particlesPosition}
          count={count}
          itemSize={3}
        />
        <animated.bufferAttribute
          attach="attributes-size"
          array={particlesSize}
          count={count}
          itemSize={3}
        />
      </animated.bufferGeometry>
      <animated.pointsMaterial
        attach="material"
        map={CircleImg}
        size={0.8}
        sizeAttenuation
        transparent={true}
        depthWrite={false}
        // vertexColors={true}
        // opacity={0.34}
      />
    </animated.points>
    // <animated.mesh
    //   scale={scale}
    //   onClick={() => setActive(!active)}
    //   ref={myMesh}
    // >
    //   <boxGeometry attach="geometry" />
    //   <animated.meshPhongMaterial
    //     color="royalblue"
    //     transparent={true}
    //     opacity={opacity}
    //   />
    // </animated.mesh>
  )
}

export default function App() {
  return (
    <div className="w-[100vw] h-[100vh] bg-[#000]">
      <Canvas>
        <MyRotatingBox />
        <ambientLight intensity={Math.PI / 2} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          decay={0}
          intensity={Math.PI}
        />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      </Canvas>
    </div>
  )
}
