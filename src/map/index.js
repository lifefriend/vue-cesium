import * as Cesium from 'cesium'
import { LineFlowMaterialProperty } from './material/polylineLineFlowMaterial'
import { PolylineTrailLinkMaterialProperty } from './material/polylineTrailLinkMaterial'
import { getLinkedPointList } from './utils/common'
import water from './material/water.jpg'

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

export function addWaterAnimation (coordinates, viewer) {
  const primitive = new Cesium.Primitive({
    show: true,
    geometryInstances: new Cesium.GeometryInstance({
      geometry: new Cesium.PolygonGeometry({
        polygonHierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArrayHeights(coordinates)),
        vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
        extrudedHeight: 0, // 只显示水面
        height: 0
      })
    }),
    appearance: new Cesium.EllipsoidSurfaceAppearance({
      aboveGround: true,
      material: new Cesium.Material({
        fabric: {
          type: 'Water',
          uniforms: {
            normalMap: water,
            frequency: 100.0,
            animationSpeed: 0.01,
            amplitude: 10.0
          }
        }
      }),
      // 水透明化
      fragmentShaderSource: 'varying vec3 v_positionMC;\n' +
      'varying vec3 v_positionEC;\n' +
      'varying vec2 v_st;\n' +
      'void main()\n' +
      '{\n' +
      'czm_materialInput materialInput;\n' +
      'vec3 normalEC = normalize(czm_normal3D * czm_geodeticSurfaceNormal(v_positionMC, vec3(0.0), vec3(1.0)));\n' +
      '#ifdef FACE_FORWARD\n' +
      'normalEC = faceforward(normalEC, vec3(0.0, 0.0, 1.0), -normalEC);\n' +
      '#endif\n' +
      'materialInput.s = v_st.s;\n' +
      'materialInput.st = v_st;\n' +
      'materialInput.str = vec3(v_st, 0.0);\n' +
      'materialInput.normalEC = normalEC;\n' +
      'materialInput.tangentToEyeMatrix = czm_eastNorthUpToEyeCoordinates(v_positionMC, materialInput.normalEC);\n' +
      'vec3 positionToEyeEC = -v_positionEC;\n' +
      'materialInput.positionToEyeEC = positionToEyeEC;\n' +
      'czm_material material = czm_getMaterial(materialInput);\n' +
      '#ifdef FLAT\n' +
      'gl_FragColor = vec4(material.diffuse + material.emission, material.alpha);\n' +
      '#else\n' +
      'gl_FragColor = czm_phong(normalize(positionToEyeEC), material, czm_lightDirectionEC);\n' +
      'gl_FragColor.a=0.85;\n' +
      '#endif\n' +
      '}\n'
    })
  })
  viewer.scene.primitives.add(primitive)
}
