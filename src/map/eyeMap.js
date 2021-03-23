import * as Cesium from 'cesium';

class EyeMap {
  constructor(domId) {
    // 1、创建球
    this.viewer = new Cesium.Viewer(domId, {
      animation: false,
      baseLayerPicker: false,
      fullscreenButton: false,
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      selectionIndicator: false,
      timeline: false,
      navigationHelpButton: false,
      infoBox: false,
      navigationInstructionsInitiallyVisible: false,
    });
    this.viewer._cesiumWidget._creditContainer.style.display = 'none';
    // 2、设置鹰眼图中球属性
    const control = this.viewer.scene.screenSpaceCameraController;
    control.enableRotate = false;
    control.enableTranslate = false;
    control.enableZoom = false;
    control.enableTilt = false;
    control.enableLook = false;
  }

  syncViewer(viewer) {
    this.viewer.camera.flyTo({
      destination: viewer.camera.position,
      orientation: {
        heading: viewer.camera.heading,
        pitch: viewer.camera.pitch,
        roll: viewer.camera.roll,
      },
      duration: 0.0,
    });
  }
}

export default function showEyeMap(domId, viewer) {
  if (!domId) return;
  const dom = document.getElementById(domId);
  if (!dom) {
    throw new Error(`${domId}is not exist`);
  }
  const eyeMap = new EyeMap(domId);

  // 同步
  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(0, 0),
    label: {
      text: new Cesium.CallbackProperty(() => {
        eyeMap.syncViewer(viewer);
        return '';
      }, true),
    },
  });
}
