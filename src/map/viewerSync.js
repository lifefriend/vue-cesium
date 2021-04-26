import * as Cesium from 'cesium';

const syncHandler = {
  initViewer1(e) {
    this.viewer1 = new Cesium.Viewer(e, {
      infoBox: false,
      selectionIndicator: false,
      navigation: false,
      animation: false,
      shouldAnimate: false,
      timeline: false,
      baseLayerPicker: false,
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      imageryProvider: new Cesium.UrlTemplateImageryProvider({
        url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      }),
    });
    this.viewer1._cesiumWidget._creditContainer.style.display = 'none';
  },
  initViewer2(e) {
    this.viewer2 = new Cesium.Viewer(e, {
      infoBox: false,
      selectionIndicator: false,
      navigation: false,
      animation: false,
      shouldAnimate: false,
      timeline: false,
      baseLayerPicker: false,
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      imageryProvider: new Cesium.UrlTemplateImageryProvider({
        url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      }),
    });
    this.viewer2._cesiumWidget._creditContainer.style.display = 'none';
  },
  setView() {
    const e = {
      destination: {
        x: -2265803.0128967767, y: 5013924.166733887, z: 3254489.2128794417,
      },
      orientation: {
        heading: 0,
        pitch: -90,
        roll: 0,
      },
      duration: 1,
    };
    this.viewer1.scene.camera.flyTo(e);
    this.viewer2.scene.camera.flyTo(e);
  },
  destroy() {
    this.viewer1.entities.removeAll();
    this.viewer1.imageryLayers.removeAll(true);
    this.viewer1.destroy();
    this.viewer2.entities.removeAll();
    this.viewer2.imageryLayers.removeAll(true);
    this.viewer2.destroy();
  },
};
class SyncViewer {
  constructor(i, t) {
    this.viewer1 = i;
    this.viewer2 = t;
    this.focusIndex = 0;
  }

  sync(e) {
    this.isSync = e;
    e ? this.startSync() : this.cancelSync();
  }

  startSync() {
    this.viewer1.scene.postRender.addEventListener(this.syncEventHandler, this);
    const e = this;
    this.viewer1.container.onmouseenter = function () {
      e.focusIndex = 0;
    };
    e.viewer2.container.onmouseenter = function () {
      e.focusIndex = 1;
    };
  }

  cancelSync() {
    this.viewer1.container.onmouseenter = undefined;
    this.viewer2.container.onmouseenter = undefined;
    this.viewer1.scene.postRender.removeEventListener(this.syncEventHandler, this);
  }

  syncEventHandler() {
    this.isSync && (this.focusIndex === 0 ? this.syncV2ToV1() : this.syncV1ToV2());
  }

  syncV2ToV1() {
    this.viewer2.camera.setView({
      destination: this.viewer1.camera.position,
      orientation: {
        direction: this.viewer1.camera._direction,
        up: this.viewer1.camera.up,
        heading: this.viewer1.camera.heading,
        pitch: this.viewer1.camera.pitch,
        roll: this.viewer1.camera.roll,
      },
    });
  }

  syncV1ToV2() {
    this.viewer1.camera.setView({
      destination: this.viewer2.camera.position,
      orientation: {
        direction: this.viewer2.camera._direction,
        up: this.viewer2.camera.up,
        heading: this.viewer2.camera.heading,
        pitch: this.viewer2.camera.pitch,
        roll: this.viewer2.camera.roll,
      },
    });
  }
}
export { syncHandler, SyncViewer };
