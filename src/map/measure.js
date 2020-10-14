import * as Cesium from 'cesium'
import * as MapUtil from './utils/common'

export default class MeasureMangner {
  constructor (viewer) {
    this.viewer = viewer
  }

  distance () {
    const viewer = this.viewer
    // 存储点
    const positions = []
    // 存储标签
    let label = null
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    // 注册鼠标左击事件
    handler.setInputAction(evt => {
      var cartesian = MapUtil.getCatesian3FromPX(evt.position, viewer)
      if (!cartesian) return
      positions.push(cartesian.clone())
      if (positions.length >= 2) {
        handler.destroy()
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    handler.setInputAction(evt => {
      var cartesian = MapUtil.getCatesian3FromPX(evt.endPosition, viewer)
      if (!cartesian) return
      if (positions.length >= 2) {
        positions.pop()
        positions.push(cartesian.clone())
      } else if (positions.length === 1) {
        positions.push(cartesian.clone())
        this.addLine(positions)
        label = this.addLabel(positions[0], this.getLength(positions))
      }
      if (label) {
        label.label.text.setValue(this.getLength(positions))
        label.position.setValue(positions[1])
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    handler.setInputAction(evt => {
      handler.destroy()
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
  }
  addLine (positions) {
    const viewer = this.viewer
    viewer.entities.add(
      new Cesium.Entity({
        polyline: {
          positions: new Cesium.CallbackProperty(() => positions, false),
          width: 1,
          material: Cesium.Color.YELLOW,
          clampToGround: true
        }
      })
    )
  }
  addLabel (point, text) {
    const viewer = this.viewer
    return viewer.entities.add(
      new Cesium.Entity({
        position: point,
        label: {
          text,
          font: '12pt sans-serif',
          style: Cesium.LabelStyle.FILL,
          fillColor: Cesium.Color.YELLOW,
          pixelOffset: new Cesium.Cartesian2(0, -10),
          disableDepthTestDistance: Number.POSITIVE_INFINITY
        }
      })
    )
  }
  getLength (points) {
    let length = MapUtil.getLength(points[0], points[1])
    if (length > 1000) {
      length = `${(length / 1000).toFixed(2)}km`
    } else {
      length = `${length.toFixed(2)}m`
    }
    return length
  }
}
