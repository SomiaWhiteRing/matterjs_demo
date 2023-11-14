// 汇总此文件夹下的所有组件
import player, { Player } from './player'
import cube, { Cube } from './cube'
import ground, { Ground } from './ground'

export default {
  player,
  cube,
  ground
}

export type { Player, Cube, Ground }
