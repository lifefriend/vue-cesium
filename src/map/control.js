import * as Cesium from 'cesium'
export default class KeyBoardControl {
  constructor (viewer) {
    this.viewer = viewer
    this.isKeyboardControl = false
    this.screenSpaceCameraController = {
      enableRotate: true,
      enableTranslate: true,
      enableZoom: true,
      enableTilt: true,
      enableLook: true
    }
    this.flags = {
      looking: false,
      moveForward: false,
      moveBackward: false,
      moveUp: false,
      moveDown: false,
      moveLeft: false,
      moveRight: false
    }
    this.canvasOnclick = null
    this.canvasTabindex = null
    this.handler = null
    this.mousePosition = null
    this.startMousePosition = null
    this.keyDownFuc = null
    this.keyUpFuc = null
    this.onTickFuc = null
  }
  start () {
    if (this.isKeyboardControl) {
      return
    }
    this.isKeyboardControl = true
    const viewer = this.viewer
    const scene = viewer.scene
    const canvas = viewer.canvas
    // 保存默认配置
    this.canvasOnclick = canvas.onclick
    this.canvasTabindex = canvas.getAttribute('tabindex')
    this.screenSpaceCameraController.enableRotate = scene.screenSpaceCameraController.enableRotate
    this.screenSpaceCameraController.enableTranslate = scene.screenSpaceCameraController.enableTranslate
    this.screenSpaceCameraController.enableZoom = scene.screenSpaceCameraController.enableZoom
    this.screenSpaceCameraController.enableTilt = scene.screenSpaceCameraController.enableTilt
    this.screenSpaceCameraController.enableLook = scene.screenSpaceCameraController.enableLook
    // 禁止默认的事件
    scene.screenSpaceCameraController.enableRotate = false
    scene.screenSpaceCameraController.enableTranslate = false
    scene.screenSpaceCameraController.enableZoom = false
    scene.screenSpaceCameraController.enableTilt = false
    scene.screenSpaceCameraController.enableLook = false
    // 焦点设置
    canvas.setAttribute('tabindex', '0')
    canvas.onclick = function () {
      canvas.focus()
    }
    // 监听输入
    this.handler = new Cesium.ScreenSpaceEventHandler(canvas)
    // 鼠标左键
    this.handler.setInputAction((movement) => {
      this.flags.looking = true
      this.mousePosition = Cesium.Cartesian3.clone(
        movement.position
      )
      this.startMousePosition = Cesium.Cartesian3.clone(
        movement.position
      )
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN)
    // 鼠标移动
    this.handler.setInputAction((movement) => {
      this.mousePosition = movement.endPosition
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    // 鼠标左键抬起
    this.handler.setInputAction(() => {
      this.flags.looking = false
    }, Cesium.ScreenSpaceEventType.LEFT_UP)
    this.keyDownFuc = (e) => { this.keyDown(e) }
    this.keyUpFuc = (e) => { this.keyUp(e) }
    this.onTickFuc = () => { this.onTick() }
    // 获得键盘keydown事件
    document.addEventListener('keydown', this.keyDownFuc, false)
    // 获得键盘keyup事件
    document.addEventListener('keyup', (e) => { this.keyUp(e) }, false)
    // 更新相机
    viewer.clock.onTick.addEventListener(this.onTickFuc)
  }
  stop () {
    const viewer = this.viewer
    const scene = viewer.scene
    const canvas = viewer.canvas
    canvas.onclick = this.canvasOnclick
    canvas.setAttribute('tabindex', this.canvasTabindex)
    scene.screenSpaceCameraController.enableRotate = this.screenSpaceCameraController.enableRotate
    scene.screenSpaceCameraController.enableTranslate = this.screenSpaceCameraController.enableTranslate
    scene.screenSpaceCameraController.enableZoom = this.screenSpaceCameraController.enableZoom
    scene.screenSpaceCameraController.enableTilt = this.screenSpaceCameraController.enableTilt
    scene.screenSpaceCameraController.enableLook = this.screenSpaceCameraController.enableLook
    if (this.handler) {
      this.handler.destroy()
    }
    document.removeEventListener('keydown', this.keyDownFuc)
    document.removeEventListener('keyup', this.keyUpFuc)
    viewer.clock.onTick.removeEventListener(this.onTickFuc)
    this.isKeyboardControl = false
  }
  getFlagForKeyCode (keyCode) {
    switch (keyCode) {
      case 'W'.charCodeAt(0):
        return 'moveUp'
      case 'S'.charCodeAt(0):
        return 'moveDown'
      case 'Q'.charCodeAt(0):
        return 'moveForward'
      case 'E'.charCodeAt(0):
        return 'moveBackward'
      case 'D'.charCodeAt(0):
        return 'moveRight'
      case 'A'.charCodeAt(0):
        return 'moveLeft'
      default:
        return undefined
    }
  }
  keyUp (e) {
    const flagName = this.getFlagForKeyCode(e.keyCode)
    if (typeof flagName !== 'undefined') {
      this.flags[flagName] = false
    }
  }
  keyDown (e) {
    const flagName = this.getFlagForKeyCode(e.keyCode)
    if (typeof flagName !== 'undefined') {
      this.flags[flagName] = true
    }
  }
  onTick () {
    const viewer = this.viewer
    const canvas = viewer.canvas
    const camera = viewer.camera
    const ellipsoid = viewer.scene.globe.ellipsoid
    // 按下鼠标左键
    if (this.flags.looking) {
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      // 鼠标滑动的距离的x或y/网页可见区域的宽或者高
      const x = (this.mousePosition.x - this.startMousePosition.x) / width
      const y = -(this.mousePosition.y - this.startMousePosition.y) / height
      // 相机移动速度参数
      const lookFactor = 0.05
      // 相机移动
      camera.lookRight(x * lookFactor)
      camera.lookUp(y * lookFactor)
    }
    // 镜头移动的速度基于镜头离地球的高度
    const cameraHeight = ellipsoid.cartesianToCartographic(camera.position).height
    const moveRate = cameraHeight / 100.0
    // console.log('this.flags', this.flags)
    if (this.flags.moveForward) {
      camera.moveForward(moveRate)
    }
    if (this.flags.moveBackward) {
      camera.moveBackward(moveRate)
    }
    if (this.flags.moveUp) {
      camera.moveUp(moveRate)
    }
    if (this.flags.moveDown) {
      camera.moveDown(moveRate)
    }
    if (this.flags.moveLeft) {
      camera.moveLeft(moveRate)
    }
    if (this.flags.moveRight) {
      camera.moveRight(moveRate)
    }
  }
}
