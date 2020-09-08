import * as Cesium from 'cesium'
import { getSrcElement } from './utils/common'

export default class RightMenu {
  constructor (viewer) {
    this.viewer = viewer
    this.menuText = []
    this.init()
  }

  init () {
    const viewer = this.viewer
    // 右键显示菜单
    new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas).setInputAction((e) => {
      this.loadMenu(e.position)
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
    // 左键隐藏菜单
    new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas).setInputAction(() => {
      this.removeMenu()
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
  }

  setMenu (arr) {
    if (arr instanceof Array) {
      this.menuText = arr
    } else {
      console.error('参数错误')
    }
  }

  getMenuById (id) {
    const array = this.menuText
    let menu = null
    for (let index = 0; index < array.length; index++) {
      const element = array[index]
      if (element.id === id) {
        menu = element
        break
      }
    }
    return menu
  }

  loadMenu (pos) {
    this.removeMenu()
    const textArr = this.menuText
    const cesiumContainer = document.querySelector('.cesium-viewer')
    let lis = ''
    for (let i = 0; i < textArr.length; i++) {
      const textLi = textArr[i]
      lis += `<div>
                <a href="javascript:void(0)" data-id=${textLi.id}>${textLi.text}</a>
            </div>`
    }
    const con = `<div class="contextmenu-ul">${lis}</div>`
    const div = document.createElement('div')
    div.className = 'contextmenu'
    div.style.cssText = 'background:#ffffff;padding:3px 5px;position:fixed;'
    div.style.top = `${pos.y}px`
    div.style.left = `${pos.x}px`
    div.innerHTML = con
    cesiumContainer.append(div)
    document.getElementsByClassName('contextmenu')[0].onclick = (e) => {
      this.removeMenu()
      const src = getSrcElement(e)
      const menu = this.getMenuById(src.dataset.id)
      menu && menu.cb(pos)
      return false
    }
  }

  removeMenu () {
    var cesiumContainer = document.querySelector('.cesium-viewer')
    var divs = document.querySelectorAll('.contextmenu')
    if (divs.length !== 0) {
      cesiumContainer.removeChild(divs[0])
    }
  }
}
