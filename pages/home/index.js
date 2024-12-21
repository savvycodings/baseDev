import {
  AsciiRenderer,
  Image,
  ScrollControls,
  useScroll,
} from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { Layout } from 'layouts/default'
import { easing } from 'maath'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Color, ShaderMaterial } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import '../../components/homepageutil/util.js'
import s from './home.module.scss'

export default function Home() {
  return (
    <Layout theme="dark" className={s.home}>
      <section className={s.content}>
        <section className={`${s.canvas} ${s.carouselContainer}`}>
          <Canvas
            camera={{
              position: [0, 0, 15],
              fov: 12,
              near: 0.1,
              far: 150,
            }}
            gl={{ preserveDrawingBuffer: true }}
            style={{ width: '100%', height: '100%' }}
          >
            <color attach="background" args={['black']} />
            <ambientLight />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <pointLight position={[-10, -10, -10]} />
            <fog attach="fog" args={['#a79', 8.5, 12]} />
            <ScrollControls horizontal={true} pages={4} infinite>
              <AsciiRenderer
                fgColor="blue"
                bgColor="transparent"
                characters="+  .,BASEDEV"
                invert={true}
                resolution={0.15}
              />
              <Rig rotation={[0, 0, 0]}>
                <Carousel />
              </Rig>
            </ScrollControls>
          </Canvas>
        </section>
      </section>
    </Layout>
  )
}

function Rig(props) {
  const ref = useRef()
  const scroll = useScroll()
  useFrame((state, delta) => {
    ref.current.rotation.y = -scroll.offset * (Math.PI * 2)
    state.events.update()

    easing.damp3(
      state.camera.position,
      [-state.pointer.x * 2, state.pointer.y + 1.5, 15],
      0.4,
      delta,
    )

    state.camera.lookAt(0, 0, 0)
  })
  return <group ref={ref} {...props} />
}

function Carousel({ radius = 2.5, count = 5 }) {
  return Array.from({ length: count }, (_, i) =>
    i === 1 ? (
      <GLBModel key={i} centerIndex={i} position={[0, 0, 0]} />
    ) : (
      <Card
        key={i}
        url={`/img${Math.floor(i % 10) + 1}_.jpg`}
        position={[
          Math.sin((i / count) * Math.PI * 2) * radius,
          0,
          Math.cos((i / count) * Math.PI * 2) * radius,
        ]}
        rotation={[0, Math.PI + (i / count) * Math.PI * 2, 0]}
      />
    ),
  )
}

function Card({ url, ...props }) {
  const ref = useRef()
  const [hovered, hover] = useState(false)
  const pointerOver = (e) => (e.stopPropagation(), hover(true))
  const pointerOut = () => hover(false)
  useFrame((state, delta) => {
    easing.damp3(ref.current.scale, hovered ? 1.15 : 1, 0.1, delta)
    easing.damp(
      ref.current.material,
      'radius',
      hovered ? 0.25 : 0.1,
      0.2,
      delta,
    )
    easing.damp(ref.current.material, 'zoom', hovered ? 1 : 1.5, 0.2, delta)
  })
  return (
    <Image
      alt={'test'}
      ref={ref}
      url={url}
      transparent
      side={THREE.DoubleSide}
      onPointerOver={pointerOver}
      onPointerOut={pointerOut}
      {...props}
    >
      <bentPlaneGeometry args={[0.1, 1, 1, 20, 20]} />
    </Image>
  )
}

function GLBModel({ position }) {
  const gltfLoader = new GLTFLoader()
  const glbRef = useRef()

  useEffect(() => {
    gltfLoader.load('/Base_Symbol_Blue.gltf', (gltf) => {
      const model = gltf.scene
      model.scale.set(0.2, 0.2, 0.2) // Adjust scale here (e.g., scale by half)
      model.position.set(position[0], position[1], position[2])
      glbRef.current.add(model)

      // Create a custom shader material for glowing effect
      const glowingMaterial = new ShaderMaterial({
        uniforms: {
          glowColor: { value: new Color(0xf9e292) }, // Yellow color
        },
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normal;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 glowColor;
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.5 - dot(vNormal, vec3(5, 5, 5)), 2.0);
            gl_FragColor = vec4(glowColor, intensity);
          }
        `,
        side: THREE.DoubleSide, // Ensure the material is visible from the front
        blending: THREE.AdditiveBlending, // Additive blending for glowing effect
        transparent: true,
        depthWrite: true,
        depthTest: true,
      })

      // Apply the custom material to the model
      model.traverse((child) => {
        if (child.isMesh) {
          child.material = glowingMaterial
          child.renderOrder = 1
        }
      })
      glbRef.current.add(model)

      const animate = () => {
        if (glbRef.current) {
          glbRef.current.rotation.y += -0.01
        }
        requestAnimationFrame(animate)
      }
      animate()
    })
  }, [gltfLoader, position])

  return <group ref={glbRef} />
}

export async function getStaticProps() {
  return {
    props: {
      id: 'home',
    },
  }
}