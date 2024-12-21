import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Lenis } from '@studio-freight/react-lenis'
import cn from 'clsx'
import AsciiRenderer from 'components/ascii/asciiRender'
import { useStore } from 'libs/store'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import { Model } from './model'
import s from './navigation.module.scss'

export function Navigation() {
  const [isNavOpened, setIsNavOpened] = useStore(
    ({ isNavOpened, setIsNavOpened }) => [isNavOpened, setIsNavOpened],
  )
  const orbitControlsRef = useRef()

  const router = useRouter()

  useEffect(() => {
    function onRouteChange() {
      setIsNavOpened(false)
    }

    router.events.on('routeChangeStart', onRouteChange)

    return () => {
      router.events.off('routeChangeStart', onRouteChange)
    }
  }, [])

  function ModelAndControls() {
    const delta = 0.01 // Adjust as needed
    const modelRef = useRef()

    useEffect(() => {
      const handleTick = () => {
        if (modelRef.current) {
          modelRef.current.rotation.x += delta
          modelRef.current.rotation.y += delta
          modelRef.current.rotation.z += delta
        }
      }

      const animationFrameId = requestAnimationFrame(handleTick)

      return () => cancelAnimationFrame(animationFrameId)
    }, [delta])

    return (
      <>
        <AsciiRenderer characters=" _.,-=+:;rad!" />
        <Model ref={modelRef}>
          <meshBasicMaterial attach="material" color="white" />
        </Model>
        <OrbitControls
          ref={orbitControlsRef}
          autoRotate
          autoRotateSpeed={15}
          enableZoom={false}
        />
      </>
    )
  }

  return (
    <Lenis className={cn(s.navigation, !isNavOpened && s.closed)}>
      <section className={s.content}>
        <Canvas camera={{ position: [0, 0, 100], fov: 15 }}>
          <ambientLight />
          <directionalLight position={[5, 8, 5]} intensity={1} />
          <pointLight position={[-3, -3, 2]} />
          <fog attach="fog" args={['#000', 2, 10]} />
          <ModelAndControls />
        </Canvas>
      </section>
    </Lenis>
  )
}
