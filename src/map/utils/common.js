import * as Cesium from 'cesium'
export function getLinkedPointList (e, t, i, r) {
  const n = []
  const o = Cesium.Cartographic.fromCartesian(e)
  const a = Cesium.Cartographic.fromCartesian(t)
  const s = 180 * o.longitude / Math.PI
  const l = 180 * o.latitude / Math.PI
  const u = 180 * a.longitude / Math.PI
  const c = 180 * a.latitude / Math.PI
  const h = Math.sqrt((s - u) * (s - u) + (l - c) * (l - c))
  const d = h * i
  const f = Cesium.Cartesian3.clone(e)
  const p = Cesium.Cartesian3.clone(t)
  const m = Cesium.Cartesian3.distance(f, Cesium.Cartesian3.ZERO)
  const g = Cesium.Cartesian3.distance(p, Cesium.Cartesian3.ZERO)
  Cesium.Cartesian3.normalize(f, f)
  Cesium.Cartesian3.normalize(p, p)
  if (Cesium.Cartesian3.distance(f, p) === 0) return n
  var v = Cesium.Cartesian3.angleBetween(f, p)
  n.push(e)
  for (var y = 1; y < r - 1; y++) {
    const _ = 1 * y / (r - 1)
    const w = 1 - _
    const b = Math.sin(w * v) / Math.sin(v)
    const C = Math.sin(_ * v) / Math.sin(v)
    const x = Cesium.Cartesian3.multiplyByScalar(f, b, new Cesium.Cartesian3())
    const P = Cesium.Cartesian3.multiplyByScalar(p, C, new Cesium.Cartesian3())
    let E = Cesium.Cartesian3.add(x, P, new Cesium.Cartesian3())
    const M = _ * Math.PI
    const T = m * w + g * _ + Math.sin(M) * d
    const F = Cesium.Cartesian3.multiplyByScalar(E, T, E)
    n.push(F)
  }
  n.push(t)
  return n
}
