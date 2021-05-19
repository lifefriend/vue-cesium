import * as Cesium from 'cesium';
import markerFile from './cluster.png';

export default class ClusterLayer {
  constructor(viewer) {
    this.viewer = viewer;
  }

  addData(pois) {
    if (pois instanceof Array) {
      const clusterLayer = new Cesium.CustomDataSource();
      pois.forEach((element) => {
        const entity = this.createEntity(element);
        clusterLayer.entities.add(entity);
      });
      clusterLayer.clustering.enabled = true;
      clusterLayer.clustering.pixelRange = 15;
      clusterLayer.clustering.minimumClusterSize = 3;
      this.customStyle(clusterLayer);
      this.viewer.dataSources.add(clusterLayer);
    } else {
      console.error('参数错误');
    }
  }

  createEntity(poi) {
    const { x, y, z } = poi;
    const entity = new Cesium.Entity({
      position: Cesium.Cartesian3.fromDegrees(x, y, z),
      // point: {
      //   pixelSize: 10,
      //   color: Cesium.Color.BLUE,
      //   disableDepthTestDistance: Number.POSITIVE_INFINITY,
      // },
      billboard: {
        width: 58, // 必需，否则初始化时会全部显示图标
        height: 74, // 必需，否则初始化时会全部显示图标
        image: markerFile,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        scaleByDistance: new Cesium.NearFarScalar(0, 0, 1, 1),
        pixelOffsetScaleByDistance: new Cesium.NearFarScalar(0, 0, 1, 1),
      },
    });
    return entity;
  }

  customStyle(clusterLayer) {
    const pinBuilder = new Cesium.PinBuilder();
    const pin50 = pinBuilder.fromText('50+', Cesium.Color.RED, 48).toDataURL();
    const pin40 = pinBuilder.fromText('40+', Cesium.Color.ORANGE, 48).toDataURL();
    const pin30 = pinBuilder.fromText('30+', Cesium.Color.YELLOW, 48).toDataURL();
    const pin20 = pinBuilder.fromText('20+', Cesium.Color.GREEN, 48).toDataURL();
    const pin10 = pinBuilder.fromText('10+', Cesium.Color.BLUE, 48).toDataURL();

    const singleDigitPins = new Array(9);
    for (let i = 0; i < singleDigitPins.length; ++i) {
      singleDigitPins[i] = pinBuilder.fromText(`${i + 1}`, Cesium.Color.VIOLET, 48).toDataURL();
    }
    clusterLayer.clustering.clusterEvent.addEventListener((clusteredEntities, cluster) => {
      cluster.label.show = false;
      cluster.billboard.show = true;
      if (clusteredEntities.length >= 50) {
        cluster.billboard.image = pin50;
      } else if (clusteredEntities.length >= 40) {
        cluster.billboard.image = pin40;
      } else if (clusteredEntities.length >= 30) {
        cluster.billboard.image = pin30;
      } else if (clusteredEntities.length >= 20) {
        cluster.billboard.image = pin20;
      } else if (clusteredEntities.length >= 10) {
        cluster.billboard.image = pin10;
      } else {
        cluster.billboard.image = singleDigitPins[clusteredEntities.length - 1];
      }
    });

    // force a re-cluster with the new styling
    const { pixelRange } = clusterLayer.clustering;
    clusterLayer.clustering.pixelRange = 0;
    clusterLayer.clustering.pixelRange = pixelRange;
  }
}
