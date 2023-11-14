import { Bodies, Body } from 'matter-js'
import { useInterfaceStore } from '@/stores/interface'

interface Ground {
  body: Body
}

function create(x: number, y: number) {
  const { basic, scale } = useInterfaceStore()
  const ground: Ground = {
    body: Bodies.rectangle(
      x * basic.blockWidth * scale + (basic.blockWidth * scale) / 2,
      y * basic.blockHeight * scale + (basic.blockHeight * scale) / 2,
      basic.blockWidth * scale,
      basic.blockHeight * scale,
      {
        isStatic: true,
        label: 'ground'
      }
    )
  }
  // ground.body和所有元素都会产生碰撞
  ground.body.collisionFilter.category = 1
  ground.body.collisionFilter.mask = 2 | 4
  // ground.body本身不会产生摩擦力
  ground.body.friction = 0
  return ground
}

export default {
  create
}

export type { Ground }
