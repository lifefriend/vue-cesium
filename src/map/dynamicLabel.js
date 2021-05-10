import * as Cesium from 'cesium';
import './dynamicLabel.css';

class DynamicLabel {
  constructor(viewer, [x, y, z], label) {
    this.viewer = viewer;
    this.position = Cesium.Cartesian3.fromDegrees(x, y, z);
    this.divInstance = this.createDiv(label);
    this.show = true;
    this.addPostRender();
  }

  createDiv(label) {
    const div = document.createElement('div');
    div.className = 'dynamiclabel-container dynamiclabel-container1';
    const div2 = document.createElement('div');
    div2.className = 'dynamiclabel-marker__boder';
    const span = document.createElement('span');
    span.className = 'dynamiclabel-marker__text';
    span.innerText = label;
    div2.appendChild(span);
    div.appendChild(div2);
    this.viewer.cesiumWidget.container.appendChild(div);
    return div;
  }

  addPostRender() {
    this.viewer.scene.postRender.addEventListener(this.postRender, this);
  }

  postRender() {
    if (this.divInstance && this.show) {
      const { height } = this.viewer.scene.canvas;
      const cartesian2 = new Cesium.Cartesian2();
      Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.viewer.scene, this.position, cartesian2);
      const t = this.divInstance.firstChild.offsetHeight;
      this.divInstance.style.bottom = `${height - cartesian2.y + t}px`;
      const { offsetWidth } = this.divInstance.firstChild;
      this.divInstance.style.left = `${cartesian2.x - offsetWidth / 2}px`;
    }
  }

  setVisible(v) {
    this.show = v;
    v ? this.divInstance.style.display = 'block' : this.divInstance.style.display = 'none';
  }

  destroy() {
    this.divInstance.style.display = 'none';
    this.viewer.scene.postRender.removeEventListener(this.postRender, this);
  }
}

export default DynamicLabel;
