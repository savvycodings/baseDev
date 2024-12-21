import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo } from 'react'
import { AsciiEffect } from 'three/examples/jsm/effects/AsciiEffect'

function AsciiRenderer({
  renderIndex = 1,
  characters = ' _.,-=+:;rad!?0123456789#@!',
  ...options
}) {
  const { size, gl, scene, camera } = useThree()

  const effect = useMemo(() => {
    const effect = new AsciiEffect(gl, characters, options)
    effect.domElement.style.position = 'absolute'
    effect.domElement.style.top = '0px'
    effect.domElement.style.left = '0px'
    effect.domElement.style.color = 'black'
    effect.domElement.style.backgroundColor = '#f9e292'
    effect.domElement.style.pointerEvents = 'none'
    return effect
  }, [characters, options.invert])

  useEffect(() => {
    gl.domElement.parentNode.appendChild(effect.domElement)
    return () => gl.domElement.parentNode.removeChild(effect.domElement)
  }, [effect, gl])

  useEffect(() => {
    effect.setSize(size.width, size.height)
  }, [effect, size])

  useFrame(() => {
    effect.render(scene, camera)
  }, renderIndex)

  return null
}

export default AsciiRenderer
