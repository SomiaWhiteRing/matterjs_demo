import { Bodies, Body } from 'matter-js'
import { useInterfaceStore } from '@/stores/interface'

interface Player {
  body: Body // 玩家的物理对象
  facing: 'left' | 'right' // 玩家的朝向
  moveing: boolean // 玩家是否在移动
  holding: boolean // 玩家是否在抓取方块
  holdingCube: Body | null // 玩家抓取的方块
}

/**
 * 使用 Matter.js 创建一个玩家对象。
 * @param x - 玩家起始位置的 x 坐标。
 * @param y - 玩家起始位置的 y 坐标。
 * @returns 创建的玩家对象。
 */
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
    facing: 'right',
    moveing: false,
    holding: false,
    holdingCube: null
  }
  // player.body不可产生扭矩
  Body.setInertia(player.body, Infinity)
  // player.body不与cube碰撞，但是与ground碰撞
  player.body.collisionFilter.category = 2
  player.body.collisionFilter.mask = 1 | 3
  player.body.friction = 1
  return player
}

export default {
  create
}

export type { Player }
