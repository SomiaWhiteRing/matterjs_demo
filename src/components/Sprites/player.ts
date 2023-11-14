import { Bodies, Body } from 'matter-js'
import { useInterfaceStore } from '@/stores/interface'

interface Player {
  body: Body
  facing: 'left' | 'right'
}

function create(x: number, y: number) {
  const { basic, scale } = useInterfaceStore()
  const player: Player = {
    body: Bodies.rectangle(
      (x * basic.blockWidth + basic.blockWidth / 2) * scale,
      (y * basic.blockHeight + basic.blockHeight / 2) * scale,
      basic.blockWidth * scale,
      basic.blockHeight * scale,
      {
        label: 'player'
      }
    ),
    facing: 'right'
  }
  // player.body不可产生扭矩
  Body.setInertia(player.body, Infinity)
  // player.body不与cube碰撞，但是与ground碰撞
  player.body.collisionFilter.category = 2
  player.body.collisionFilter.mask = 1 | 3
  player.body.friction = 1
  console.log(scale)
  return player
}

const player = create(0, 0)

export default {
  player,
  create
}

export type { Player }
