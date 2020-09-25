<!-- 菜单栏 -->
<template>
  <div>
    <button class="btn btn-secondary dropdown-toggle" type="button" @click="dropDownShow">
      底图
    </button>
    <div class="dropdown-menu" :class="{ show: dropdownShow }">
      <a class="dropdown-item" href="#" @click="addGoogleMap">google影像</a>
      <a class="dropdown-item" href="#" @click="addGDMap">高德影像</a>
      <a class="dropdown-item" href="#" @click="addTXMap">腾讯影像</a>
      <a class="dropdown-item" href="#" @click="addArcGISMap">ArcGIS影像</a>
      <a class="dropdown-item" href="#" @click="addTDTMap">天地图影像</a>
      <a class="dropdown-item" href="#" @click="addOSMMap">OSM矢量</a>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as Cesium from 'cesium'

export default {
  computed: {
    ...mapGetters(['mapInstance'])
  },
  data () {
    return {
      dropdownShow: false
    }
  },
  methods: {
    dropDownShow () {
      this.dropdownShow = !this.dropdownShow
    },
    addGoogleMap () {
      this.mapInstance.imageryLayers.removeAll()
      this.mapInstance.scene.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
        url: '//mt1.google.cn/maps/vt?lyrs=y@189&gl=cn&x={x}&y={y}&z={z}'
      }))
    },
    addGDMap () {
      this.mapInstance.imageryLayers.removeAll()
      this.mapInstance.scene.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
        url: 'https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}'
      }))
    },
    addArcGISMap () {
      this.mapInstance.imageryLayers.removeAll()
      this.mapInstance.scene.imageryLayers.addImageryProvider(new Cesium.ArcGisMapServerImageryProvider({
        url: 'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer'
      }))
    },
    addTDTMap () {
      this.mapInstance.imageryLayers.removeAll()
      this.mapInstance.scene.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
        url: 'http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=ebf64362215c081f8317203220f133eb',
        layer: 'tdtBasicLayer',
        style: 'default',
        format: 'image/jpeg',
        tileMatrixSetID: 'GoogleMapsCompatible',
        show: false
      }))
    },
    addOSMMap () {
      this.mapInstance.imageryLayers.removeAll()
      this.mapInstance.scene.imageryLayers.addImageryProvider(new Cesium.OpenStreetMapImageryProvider({
        url: 'https://a.tile.openstreetmap.org/'
      }))
    },
    addTXMap () {
      this.mapInstance.imageryLayers.removeAll()
      this.mapInstance.scene.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
        url: 'https://p2.map.gtimg.com/sateTiles/{z}/{sx}/{sy}/{x}_{reverseY}.jpg?version=229',
        customTags: {
          sx (imageryProvider, x) {
            return x >> 4
          },
          sy (imageryProvider, x, y, level) {
            return ((1 << level) - y) >> 4
          }
        }
      }))
    }
  }
}
</script>
<style scoped>
</style>
