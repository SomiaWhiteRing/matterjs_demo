<template>
  <div ref="canvasContainer"></div>
</template>

<script lang="ts" setup>
import Matter from 'matter-js'

const { Engine, Render, World, Bodies, Runner } = Matter

const engine = Engine.create()

const boxA = Bodies.rectangle(400, 200, 80, 80)
const boxB = Bodies.rectangle(450, 50, 80, 80)
const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true })

const canvasContainer = ref()

onMounted(() => {
  const render = Render.create({
    element: canvasContainer.value,
    engine,
    options: {
      width: 800,
      height: 600
    }
  })

  World.add(engine.world, [boxA, boxB, ground])

  Render.run(render)

  const runner = Runner.create()
  Runner.run(runner, engine)
})
</script>
