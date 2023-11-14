<template>
  <div ref="canvasContainer"></div>
</template>

<script lang="ts" setup>
import { useInterfaceStore } from '@/stores/interface'
import sprites from '@/components/sprites/index'
import active from '@/components/actions/activeElements'
import Matter from 'matter-js'
const { Engine, Render, World, Runner, Body, Composite } = Matter

const engine = Engine.create()
const canvasContainer = ref<HTMLElement>()

// 构建player类
active.setPlayer(sprites.player.create(1, 1))

// 构建cube类
active.resetCubes()
active.addCube(sprites.cube.create(5, 3))

// 构建ground类
active.resetGrounds()
// 围绕着10*18的矩形构建ground
for (let i = 0; i < 18; i++) {
  for (let j = 0; j < 10; j++) {
    if (i === 0 || i === 17 || j === 0 || j === 9) {
      active.addGround(sprites.ground.create(i, j))
    } else if (Math.random() > 0.8) {
      active.addGround(sprites.ground.create(i, j))
    }
  }
}

// 记录按键状态
const keys = reactive({
  left: false,
  right: false,
  up: false,
  space: false
})

function moveLeft(box: Matter.Body) {
  // 如果当前朝向是向右，则将朝向改为向左
  if (active.player.facing === 'right') {
    active.player.facing = 'left'
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
  if (active.player.facing === 'left') {
    active.player.facing = 'right'
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

  const cube = active.cubes.find((cube) => {
    return Matter.Bounds.overlaps(cube.body.bounds, _player.bounds)
  })?.body

  if (!cube) {
    return
  }

  holdingCube.value = cube
  Body.setVelocity(cube, { x: 0, y: 0 })
  Body.setAngularVelocity(cube, 0)
  // 将cube的位置与player的位置绑定
  Body.setPosition(cube, {
    x: _player.position.x + 65,
    y: _player.position.y - 5
  })
  // 修改cube的碰撞过滤器，使其能够与player碰撞
  cube.collisionFilter.category = 1
  // 创建一个约束，将cube绑定到player上
  holdingConstraint.value = Matter.Constraint.create({
    bodyA: _player,
    bodyB: cube,
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
        hold(active.player.body)
      }
    }
  }
)

onMounted(() => {
  const render = Render.create({
    element: canvasContainer.value,
    engine,
    options: {
      width:
        useInterfaceStore().basic.widthBlockNum *
        useInterfaceStore().basic.blockWidth *
        useInterfaceStore().scale,
      height:
        useInterfaceStore().basic.heightBlockNum *
        useInterfaceStore().basic.blockHeight *
        useInterfaceStore().scale,
      wireframes: false,
      background: '#9dab88'
    }
  })

  World.add(engine.world, [
    active.player.body,
    ...active.grounds.map((ground) => ground.body),
    ...active.cubes.map((cube) => cube.body)
  ])

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
      moveLeft(active.player.body)
    } else if (keys.right) {
      moveRight(active.player.body)
    } else {
      stopMove(active.player.body)
    }
    if (keys.up) {
      jump(active.player.body)
    }
    window.requestAnimationFrame(tick)
  }

  window.requestAnimationFrame(tick)

  // window.addEventListener('resize', () => {
  //   render.bounds.max.x = window.innerWidth
  //   render.bounds.max.y = window.innerHeight
  //   render.options.width = window.innerWidth
  //   render.options.height = window.innerHeight
  //   render.canvas.width = window.innerWidth
  //   render.canvas.height = window.innerHeight
  //   Matter.Render.setPixelRatio(render, window.devicePixelRatio) // added this
  // })
})
</script>
