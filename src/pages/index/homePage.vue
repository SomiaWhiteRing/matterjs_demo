<template>
  <div ref="canvasContainer"></div>
</template>

<script lang="ts" setup>
import Matter, { Composite } from 'matter-js'
const { Engine, Render, World, Bodies, Runner, Body } = Matter

const engine = Engine.create()
const canvasContainer = ref<HTMLElement>()

// 构建player角色类，其中包含player的body，当前的朝向
const player = {
  body: Bodies.rectangle(400, 200, 80, 80),
  facing: 'right'
}
// player.body不可产生扭矩
Body.setInertia(player.body, Infinity)
// player.body不与cube碰撞，但是与ground碰撞
player.body.collisionFilter.category = 2
player.body.collisionFilter.mask = 1 | 3
player.body.friction = 1

// 构建cube类
const cubes: Matter.Body[] = []
function drawCube(x: number, y: number) {
  const cube = Bodies.rectangle(x, y, 50, 50)
  Body.setInertia(cube, Infinity)
  cube.collisionFilter.category = 4
  cube.collisionFilter.mask = 1 | 2
  return cube
}
cubes.push(drawCube(400, 0))

// 构建ground类
const grounds: Matter.Body[] = []
function drawGround(x: number, y: number, width: number, height: number) {
  const ground = Bodies.rectangle(x, y, width, height, { isStatic: true })
  ground.collisionFilter.category = 1
  ground.collisionFilter.mask = 2 | 4
  ground.friction = 0
  return ground
}
// 四面围墙
grounds.push(drawGround(400, 610, 810, 60))
grounds.push(drawGround(400, -10, 810, 60))
grounds.push(drawGround(-10, 300, 60, 610))
grounds.push(drawGround(810, 300, 60, 610))
// 绘制一块突起的地面
grounds.push(drawGround(400, 600, 200, 250))

// 记录按键状态
const keys = reactive({
  left: false,
  right: false,
  up: false,
  space: false
})

function moveLeft(box: Matter.Body) {
  // 如果当前朝向是向右，则将朝向改为向左
  if (player.facing === 'right') {
    player.facing = 'left'
    // 如果约束仍存在，则将cube的位置改为向左
    if (holdingCube.value && holdingConstraint.value) {
      Body.setPosition(holdingCube.value, {
        x: box.position.x - 65,
        y: box.position.y - 5
      })
      holdingConstraint.value.pointA = { x: -40, y: 0 }
      holdingConstraint.value.pointB = { x: 25, y: 0 }
    }
  }
  Body.setVelocity(box, { x: -5, y: box.velocity.y })
  Body.setAngularVelocity(box, 0)
}

function moveRight(box: Matter.Body) {
  if (player.facing === 'left') {
    player.facing = 'right'
    if (holdingCube.value && holdingConstraint.value) {
      // 如果约束仍存在，则将cube的位置改为向右
      Body.setPosition(holdingCube.value, {
        x: box.position.x + 65,
        y: box.position.y - 5
      })
      holdingConstraint.value.pointA = { x: 40, y: 0 }
      holdingConstraint.value.pointB = { x: -25, y: 0 }
    }
  }
  Body.setVelocity(box, { x: 5, y: box.velocity.y })
  Body.setAngularVelocity(box, 0)
}

function stopMove(box: Matter.Body) {
  Body.setVelocity(box, { x: 0, y: box.velocity.y })
}

function jump(box: Matter.Body) {
  const velocityY = box.velocity.y
  if (Math.abs(velocityY) < 0.01) {
    Body.applyForce(
      box,
      { x: box.position.x, y: box.position.y },
      { x: 0, y: holdingCube.value ? -0.3 : -0.2 }
    )
  }
}

const holdingConstraint = ref<Matter.Constraint | null>(null)
const holdingCube = ref<Matter.Body | null>(null)
function hold(_player: Matter.Body) {
  if (holdingCube.value) {
    return
  }

  const body = cubes.find((body) => {
    return Matter.Bounds.overlaps(body.bounds, _player.bounds)
  })

  if (!body) {
    return
  }

  holdingCube.value = body
  Body.setVelocity(body, { x: 0, y: 0 })
  Body.setAngularVelocity(body, 0)
  // 将cube的位置与player的位置绑定
  Body.setPosition(body, {
    x: _player.position.x + 65,
    y: _player.position.y - 5
  })
  // 修改cube的碰撞过滤器，使其能够与player碰撞
  body.collisionFilter.category = 1
  // 创建一个约束，将cube绑定到player上
  holdingConstraint.value = Matter.Constraint.create({
    bodyA: _player,
    bodyB: body,
    stiffness: 1,
    length: 0,
    pointA: { x: 40, y: 0 },
    pointB: { x: -25, y: 0 }
  })
  World.add(engine.world, holdingConstraint.value)
}

watch(
  () => keys.space,
  (space) => {
    if (space) {
      if (holdingCube.value && holdingConstraint.value) {
        // 如果cube与player之间的约束存在，则将cube与player之间的约束移除
        Composite.remove(engine.world, holdingConstraint.value)
        holdingCube.value.collisionFilter.category = 4
        holdingCube.value = null
        holdingConstraint.value = null
      } else {
        hold(player.body)
      }
    }
  }
)

onMounted(() => {
  const render = Render.create({
    element: canvasContainer.value,
    engine,
    options: {
      width: 800,
      height: 600,
      wireframes: false,
      background: '#fafafa'
    }
  })

  World.add(engine.world, [player.body, ...grounds, ...cubes])

  Render.run(render)

  const runner = Runner.create()
  Runner.run(runner, engine)

  window.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'ArrowLeft':
        keys.right = false
        keys.left = true
        break
      case 'ArrowRight':
        keys.left = false
        keys.right = true
        break
      case 'ArrowUp':
        keys.up = true
        break
      case ' ':
        keys.space = true
        break
    }
  })

  window.addEventListener('keyup', (event) => {
    switch (event.key) {
      case 'ArrowLeft':
        keys.left = false
        break
      case 'ArrowRight':
        keys.right = false
        break
      case 'ArrowUp':
        keys.up = false
        break
      case ' ':
        keys.space = false
        break
    }
  })

  function tick() {
    if (keys.left) {
      moveLeft(player.body)
    } else if (keys.right) {
      moveRight(player.body)
    } else {
      stopMove(player.body)
    }
    if (keys.up) {
      jump(player.body)
    }
    window.requestAnimationFrame(tick)
  }

  window.requestAnimationFrame(tick)
})
</script>
