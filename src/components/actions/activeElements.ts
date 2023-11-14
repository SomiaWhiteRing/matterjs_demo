// 存储游戏框体内的所有元素
import { Player, Cube, Ground } from '@/components/sprites/index'

let _player: Player | null = null
function setPlayer(player: Player) {
  _player = player
}

let _cubes: Cube[] = []
function setCubes(cubes: Cube[]) {
  _cubes = cubes
}
function resetCubes() {
  _cubes = []
}
function addCube(cube: Cube) {
  _cubes.push(cube)
}

let _grounds: Ground[] = []
function setGrounds(ground: Ground[]) {
  _grounds = ground
}
function resetGrounds() {
  _grounds = []
}
function addGround(ground: Ground) {
  _grounds.push(ground)
}

export default {
  get player() {
    return _player as Player
  },
  setPlayer,
  get cubes() {
    return _cubes as Cube[]
  },
  setCubes,
  resetCubes,
  addCube,
  get grounds() {
    return _grounds as Ground[]
  },
  setGrounds,
  resetGrounds,
  addGround
}

export type { Player }
