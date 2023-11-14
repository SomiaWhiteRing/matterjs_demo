import { Bodies, Body } from 'matter-js'
import { useInterfaceStore } from '@/stores/interface'

interface Cube {
  body: Body
  catch: boolean
}

function create(x: number, y: number) {
  const { basic, scale } = useInterfaceStore()
  const cube: Cube = {
    body: Bodies.rectangle(
      (x * basic.blockWidth + basic.blockWidth / 2) * scale,
      (y * basic.blockHeight + basic.blockHeight / 2) * scale,
      basic.blockWidth * scale * 0.6,
      basic.blockHeight * scale * 0.6
    ),
    catch: false
  }
  // cube.body不可产生扭矩
  Body.setInertia(cube.body, Infinity)
  // cube.body不与body碰撞，但是与ground碰撞
  cube.body.collisionFilter.category = 4
  cube.body.collisionFilter.mask = 1 | 3
  return cube
}

export default {
  create
}

export type { Cube }
