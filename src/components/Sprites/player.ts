import { Bodies, Body } from 'matter-js'

function createPlayer(x: number, y: number) {
  const player = {
    body: Bodies.rectangle(x, y, 80, 80),
    facing: 'right'
  }
  // player.body不可产生扭矩
  Body.setInertia(player.body, Infinity)
  // player.body不与cube碰撞，但是与ground碰撞
  player.body.collisionFilter.category = 2
  player.body.collisionFilter.mask = 1 | 3
  player.body.friction = 1
  return player
}

const player = createPlayer(0, 0)

export default {
  player
}
