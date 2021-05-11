import * as Cesium from 'cesium';
import mark from './bounceMarker.png';

class BounceMarker {
  constructor(viewer, [lng, lat, height], opts) {
    this.viewer = viewer;
    this.lng = lng;
    this.lat = lat;
    this.height = height;
    this.opts = opts || {
      image: mark,
      bounceHeight: 100,
      increment: 0.05,
    };
    this.add();
  }

  add() {
    const e = this;
    const i = this.height + this.opts.bounceHeight;
    let t = 0;
    let s = 0;
    this.bounceMarker = this.viewer.entities.add({
      position: new Cesium.CallbackProperty(() => {
        s += e.opts.increment;
        t += s;
        if (t > e.opts.bounceHeight) {
          t = e.opts.bounceHeight;
          s *= -1;
          s *= 0.55;
        }
        return Cesium.Cartesian3.fromDegrees(e.lng, e.lat, i - t);
      }, false),
      billboard: {
        image: this.opts.image,
      },
    });
    this.bounceMarker.bounce = function () {
      e.bounce();
    };
  }

  bounce() {
    this.remove();
    this.add();
  }

  remove() {
    this.viewer.entities.remove(this.bounceMarker);
  }
}
function initEvent(viewer) {
  new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas).setInputAction((i) => {
    const t = viewer.scene.pick(i.position);
    t && t.id && t.id.bounce && t.id.bounce();
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}
export default BounceMarker;
export { initEvent };
