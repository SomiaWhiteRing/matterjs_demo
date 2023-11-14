<script setup lang="ts">
import { useInterfaceStore } from '@/stores/interface'
onLaunch(() => {
  console.log('App Launch')
})
onShow(() => {
  console.log('App Show')
  // 获取基础画幅
  const width =
    useInterfaceStore().basic.blockWidth *
    useInterfaceStore().basic.widthBlockNum
  const height =
    useInterfaceStore().basic.blockHeight *
    useInterfaceStore().basic.heightBlockNum
  // 获取页面画幅
  const widthBlockNum = window.innerWidth
  const heightBlockNum = window.innerHeight
  // 计算最大整数缩放比例
  const scale = Math.floor(
    Math.min(widthBlockNum / width, heightBlockNum / height)
  )
  console.log(scale)
  // 将缩放比例存入store
  useInterfaceStore().setScale(scale)
})
onHide(() => {
  console.log('App Hide')
})
</script>
<style lang="scss">
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
</style>
