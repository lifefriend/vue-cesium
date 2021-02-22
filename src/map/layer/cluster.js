import * as Cesium from 'cesium'

export default class ClusterLayer {
  constructor (viewer) {
    this.viewer = viewer
  }

  addData (pois) {
    if (pois instanceof Array) {
      const clusterLayer = new Cesium.CustomDataSource()
      pois.forEach((element) => {
        const entity = this.createEntity(element)
        clusterLayer.entities.add(entity)
      })
      clusterLayer.clustering.enabled = true
      clusterLayer.clustering.pixelRange = 15
      clusterLayer.clustering.minimumClusterSize = 3
      this.customStyle(clusterLayer)
      this.viewer.dataSources.add(clusterLayer)
    } else {
      console.error('参数错误')
    }
  }

  createEntity (poi) {
    const { x, y, z } = poi
    const entity = new Cesium.Entity({
      position: Cesium.Cartesian3.fromDegrees(x, y, z),
      point: {
        pixelSize: 10,
        color: Cesium.Color.BLUE,
        disableDepthTestDistance: Number.POSITIVE_INFINITY
      }
    })
    return entity
  }

  customStyle (clusterLayer) {
    var pinBuilder = new Cesium.PinBuilder()
    var pin50 = pinBuilder.fromText('50+', Cesium.Color.RED, 48).toDataURL()
    var pin40 = pinBuilder.fromText('40+', Cesium.Color.ORANGE, 48).toDataURL()
    var pin30 = pinBuilder.fromText('30+', Cesium.Color.YELLOW, 48).toDataURL()
    var pin20 = pinBuilder.fromText('20+', Cesium.Color.GREEN, 48).toDataURL()
    var pin10 = pinBuilder.fromText('10+', Cesium.Color.BLUE, 48).toDataURL()

    var singleDigitPins = new Array(9)
    for (var i = 0; i < singleDigitPins.length; ++i) {
      singleDigitPins[i] = pinBuilder.fromText(`${i + 1}`, Cesium.Color.VIOLET, 48).toDataURL()
    }
    clusterLayer.clustering.clusterEvent.addEventListener((clusteredEntities, cluster) => {
      cluster.label.show = false
      cluster.billboard.show = true
      if (clusteredEntities.length >= 50) {
        cluster.billboard.image = pin50
      } else if (clusteredEntities.length >= 40) {
        cluster.billboard.image = pin40
      } else if (clusteredEntities.length >= 30) {
        cluster.billboard.image = pin30
      } else if (clusteredEntities.length >= 20) {
        cluster.billboard.image = pin20
      } else if (clusteredEntities.length >= 10) {
        cluster.billboard.image = pin10
      } else {
        cluster.billboard.image = singleDigitPins[clusteredEntities.length - 1]
      }
    })

    // force a re-cluster with the new styling
    var pixelRange = clusterLayer.clustering.pixelRange
    clusterLayer.clustering.pixelRange = 0
    clusterLayer.clustering.pixelRange = pixelRange
  }
}
