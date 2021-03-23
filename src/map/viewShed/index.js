import * as Cesium from 'cesium';
import * as MapUtil from '../utils/common';
import { ViewShed } from './viewShed';

export function ViewShedAnalysis(viewer) {
  let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  const pnts = [];
  let viewShed = null;
  const clear = () => {
    if (handler) {
      handler.destroy();
      handler = null;
    }
    if (viewShed) {
      viewShed.clear();
    }
  };
  handler.setInputAction((evt) => {
    const cartesian = MapUtil.getCatesian3FromPX(evt.position, viewer);
    pnts.push(cartesian);
    if (pnts.length >= 2) {
      handler.destroy();
      handler = null;
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  handler.setInputAction((evt) => {
    const cartesian = MapUtil.getCatesian3FromPX(evt.endPosition, viewer);
    if (pnts.length < 1 || pnts.length >= 2) {
      return;
    }
    // 将鼠标当前点坐标转化成经纬度
    const ptn1 = MapUtil.getLonLat(viewer, pnts[0]);
    const ptn2 = MapUtil.getLonLat(viewer, cartesian);
    const direction = MapUtil.getAngle(ptn1, ptn2);
    const distance = Cesium.Cartesian3.distance(pnts[0], cartesian);
    if (!viewShed) {
      viewShed = new ViewShed({
        viewer,
        viewPosition: pnts[0],
        direction,
        pitch: 30,
      });
    } else {
      viewShed.setDirectionDistancePitch(direction, distance, 30);
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  return { clear };
}
