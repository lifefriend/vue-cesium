<template>
  <div class="home">
    <div id="cesiumContainer"></div>
    <div id="credit-container"></div>
    <div id="eye-container"></div>
    <Menu/>
  </div>
</template>

<script>
// @ is an alias to /src
import 'cesium/Source/Widgets/widgets.css';
import 'bootstrap/dist/css/bootstrap.css';
import {
  nextTick,
  onMounted,
} from 'vue';
import { useStore } from 'vuex';
import * as Cesium from 'cesium';
import Menu from '../components/menu.vue';

export default {
  name: 'Home',
  components: {
    Menu,
  },
  setup() {
    const store = useStore();

    onMounted(() => {
      nextTick(() => {
        Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyYzQ0NWQ5Zi1iNjU4LTQ0NTEtYWIzNC1hYzZlNDFmYzQyYzgiLCJpZCI6NjI1MCwic2NvcGVzIjpbImFzciIsImdjIl0sImlhdCI6MTU0NTc0MTc5OH0.oZJRh-eKtiJy6LyDNZQ0TgPmCMiRq2X3HaSr6y1X_ac';
        const viewer = new Cesium.Viewer('cesiumContainer', {
          geocoder: false, // 是否显示geocoder小器件，右上角查询按钮
          homeButton: false, // 是否显示Home按钮
          infoBox: false, // 点击要素之后显示的信息,默认true
          selectionIndicator: false, // 是否显示 entity 选中标识
          sceneModePicker: false, // 是否显示3D/2D选择器
          navigationHelpButton: false, // 是否显示右上角的帮助按钮
          animation: false, // 是否创建动画小器件，左下角仪表
          timeline: false, // 是否显示时间轴
          vrButton: false, // 是否显示虚拟按钮
          shouldAnimate: true,
          fullscreenButton: false, // 是否显示全屏按钮
          baseLayerPicker: false, // 是否显示图层选择器
          creditContainer: 'credit-container',
          imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
            url: 'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer',
          }),
        });
        store.commit('setMapInstance', viewer);
      });
    });
  },
};
</script>
<style>
#cesiumContainer {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
#cesiumContainer {
  position: absolute;
}
#credit-container{
  display:none;
}
#eye-container{
  position: absolute;
  width: 20%;
  height: 20%;
  bottom: 0;
  right: 0;
  z-index: 999;
}
</style>
