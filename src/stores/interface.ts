import { defineStore } from 'pinia'

export const useInterfaceStore = defineStore('interface', () => {
  // 页面的基础数据
  const basic = {
    // 游戏中每个基本元素的宽高
    blockHeight: 5,
    blockWidth: 5,
    // 游戏主界面画幅的宽高
    heightBlockNum: 10,
    widthBlockNum: 18
  }

  // 页面的缩放比例
  let scale = 15
  const setScale = (value: number) => {
    scale = value
  }

  return {
    basic,
    scale,
    setScale
  }
})
