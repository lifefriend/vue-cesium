import * as Cesium from 'cesium'
import { LineFlowMaterialProperty } from './material/polylineLineFlowMaterial'
import { PolylineTrailLinkMaterialProperty } from './material/polylineTrailLinkMaterial'
import { getLinkedPointList } from './utils/common'

// 流向动态线
export function addAnimationLine (from, to, viewer) {
  const e = Cesium.Cartesian3.fromDegrees(from.x, from.y, 1)
  // 绘制起点
  viewer.entities.add({
    name: from.name,
    position: e,
    point: {
      pixelSize: 10,
      color: new Cesium.Color(0.3, 0.79, 1, 0.9)
    }
  })
  for (let index = 0; index < to.length; index++) {
    const o = to[index]
    const t = Cesium.Cartesian3.fromDegrees(o.x, o.y, 1)
    // 绘制(流动)曲线
    viewer.entities.add({
      name: o.name,
      polyline: {
        positions: getLinkedPointList(e, t, 4e4, 100),
        width: 2,
        material: new LineFlowMaterialProperty(new Cesium.Color(1, 0.79, 0.15, 1), 2e3)
      }
    })
    // 绘制终点
    viewer.entities.add({
      name: o.name,
      position: t,
      point: {
        pixelSize: 8,
        color: new Cesium.Color(1, 201 / 255, 38 / 255, 1)
      }
    })
  }
}

// 流向动态直线
export function addAnimationStraightLine (coordinates, viewer) {
  if (coordinates instanceof Array) {
    const positions = [].concat.apply([], coordinates)
    const material = new PolylineTrailLinkMaterialProperty()
    viewer.entities.add(
      new Cesium.Entity({
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArray(positions),
          width: 5,
          clampToGround: true,
          material
        }
      })
    )
  } else {
    console.warn('参数错误')
  }
}
