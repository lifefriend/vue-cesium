import * as Cesium from 'cesium';
import pic from './overlay.gif';

export default class OverlayLayer {
  constructor(viewer) {
    this.viewer = viewer;
  }

  addData({ x, y, z }) {
    const div = document.createElement('div');
    const img = document.createElement('img');
    img.src = pic;
    div.appendChild(img);
    document.body.appendChild(div);
    this.update(x, y, z, div);
  }

  update(x, y, z, div) {
    const { viewer } = this;
    const scratch = new Cesium.Cartesian2();
    viewer.scene.postRender.addEventListener(() => {
      const position = Cesium.Cartesian3.fromDegrees(x, y, z || 0.0);
      const canvasPosition = viewer.scene.cartesianToCanvasCoordinates(position, scratch);
      if (Cesium.defined(canvasPosition)) {
        div.style.position = 'absolute';
        div.style.top = `${canvasPosition.y}px`;
        div.style.left = `${canvasPosition.x}px`;
      }
    });
  }
}
