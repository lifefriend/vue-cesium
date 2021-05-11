import * as Cesium from 'cesium';

export function getLinkedPointList(e, t, i, r) {
  const n = [];
  const o = Cesium.Cartographic.fromCartesian(e);
  const a = Cesium.Cartographic.fromCartesian(t);
  const s = (180 * o.longitude) / Math.PI;
  const l = (180 * o.latitude) / Math.PI;
  const u = (180 * a.longitude) / Math.PI;
  const c = (180 * a.latitude) / Math.PI;
  const h = Math.sqrt((s - u) * (s - u) + (l - c) * (l - c));
  const d = h * i;
  const f = Cesium.Cartesian3.clone(e);
  const p = Cesium.Cartesian3.clone(t);
  const m = Cesium.Cartesian3.distance(f, Cesium.Cartesian3.ZERO);
  const g = Cesium.Cartesian3.distance(p, Cesium.Cartesian3.ZERO);
  Cesium.Cartesian3.normalize(f, f);
  Cesium.Cartesian3.normalize(p, p);
  if (Cesium.Cartesian3.distance(f, p) === 0) return n;
  const v = Cesium.Cartesian3.angleBetween(f, p);
  n.push(e);
  for (let y = 1; y < r - 1; y++) {
    const _ = (1 * y) / (r - 1);
    const w = 1 - _;
    const b = Math.sin(w * v) / Math.sin(v);
    const C = Math.sin(_ * v) / Math.sin(v);
    const x = Cesium.Cartesian3.multiplyByScalar(f, b, new Cesium.Cartesian3());
    const P = Cesium.Cartesian3.multiplyByScalar(p, C, new Cesium.Cartesian3());
    const E = Cesium.Cartesian3.add(x, P, new Cesium.Cartesian3());
    const M = _ * Math.PI;
    const T = m * w + g * _ + Math.sin(M) * d;
    const F = Cesium.Cartesian3.multiplyByScalar(E, T, E);
    n.push(F);
  }
  n.push(t);
  return n;
}
export function getCatesian3FromPX(px, viewer) {
  if (!px) return;
  const ray = viewer.camera.getPickRay(px);
  if (!ray) return;
  const cartesian = viewer.scene.globe.pick(ray, viewer.scene);
  return cartesian;
}
export function getLonLat(viewer, cartesian) {
  const cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
  cartographic.height = viewer.scene.globe.getHeight(cartographic);
  const pos = {
    lon: cartographic.longitude,
    lat: cartographic.latitude,
    alt: cartographic.height,
  };
  pos.lon = Cesium.Math.toDegrees(pos.lon);
  pos.lat = Cesium.Math.toDegrees(pos.lat);
  return pos;
}
export function getAngle(pntFirst, pntNext) {
  let dRotateAngle = Math.atan2(
    Math.abs(pntFirst.lon - pntNext.lon),
    Math.abs(pntFirst.lat - pntNext.lat),
  );
  if (pntNext.lon >= pntFirst.lon) {
    if (pntNext.lat >= pntFirst.lat) {
      //
    } else {
      dRotateAngle = Math.PI - dRotateAngle;
    }
  } else if (pntNext.lat >= pntFirst.lat) {
    dRotateAngle = 2 * Math.PI - dRotateAngle;
  } else {
    dRotateAngle = Math.PI + dRotateAngle;
  }
  dRotateAngle = (dRotateAngle * 180) / Math.PI;
  return dRotateAngle;
}
export function getSrcElement(e) {
  const ev = e || window.event;
  const srcElm = ev.target || ev.srcElement;
  return srcElm;
}
export function getLength(firstPoint, secondPoint) {
  return Cesium.Cartesian3.distance(firstPoint, secondPoint);
}
export function setExtent(rectangle, opt = {}, viewer) {
  viewer.camera.flyTo({
    destination: rectangle,
    orientation: {
      heading: Cesium.Math.toRadians(opt.heading || 0), // 方向
      pitch: Cesium.Math.toRadians(opt.pitch || -90), // 倾斜角度
      roll: Cesium.Math.toRadians(opt.roll || 0),
    },
  });
}
export function getCenter(viewer) {
  // 中心点位置
  const rectangle = viewer.camera.computeViewRectangle();
  const west = rectangle.west / Math.PI * 180;
  const north = rectangle.north / Math.PI * 180;
  const east = rectangle.east / Math.PI * 180;
  const south = rectangle.south / Math.PI * 180;
  const centerx = (west + east) / 2;
  const centery = (north + south) / 2;
  return [centerx, centery];
}
