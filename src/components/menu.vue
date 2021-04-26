<!-- 菜单栏 -->
<template>
  <nav class="navbar navbar-expand navbar-dark bg-dark">
    <a class="navbar-brand" href="#">Navbar</a>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item">
          <base-map />
        </li>
        <li class="nav-item">
          <measure />
        </li>
        <li class="nav-item" @click="doAnimationLine">
          <a class="nav-link" href="#">动态抛物线</a>
        </li>
        <li class="nav-item" @click="doAnimationStraightLine">
          <a class="nav-link" href="#">动态直线</a>
        </li>
        <li class="nav-item" @click="addClusterLayer">
          <a class="nav-link" href="#">聚类图层</a>
        </li>
        <li class="nav-item" @click="addGifLayer">
          <a class="nav-link" href="#">GIF图标</a>
        </li>
        <li class="nav-item" @click="addViewShed">
          <a class="nav-link" href="#">视域分析</a>
        </li>
        <li class="nav-item" @click="addKeyBoard">
          <a class="nav-link" href="#">第一人称</a>
        </li>
        <li class="nav-item" @click="removeKeyBoard">
          <a class="nav-link" href="#">取消第一人称</a>
        </li>
        <li class="nav-item" @click="addEyeMap">
          <a class="nav-link" href="#">鹰眼</a>
        </li>
        <li class="nav-item" @click="addMvt">
          <a class="nav-link" href="#">矢量切片</a>
        </li>
        <li class="nav-item" @click="addRightMenu">
          <a class="nav-link" href="#">右键菜单</a>
        </li>
        <li class="nav-item" @click="doWaterAnimation">
          <a class="nav-link" href="#">动态水面</a>
        </li>
        <li class="nav-item" @click="do3DTiles">
          <a class="nav-link" href="#">白模渲染</a>
        </li>
        <li class="nav-item" @click="addFire">
          <a class="nav-link" href="#">火焰粒子</a>
        </li>
        <li class="nav-item" @click="addPostStage">
          <a class="nav-link" href="#">下雨</a>
        </li>
        <li class="nav-item" @click="showViewerSync">
          <a class="nav-link" href="#">双屏</a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { useStore } from 'vuex';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

import * as Cesium from 'cesium';
import BaseMap from './baseMap.vue';
import Measure from './measure.vue';
import {
  addAnimationLine,
  addAnimationStraightLine,
  addWaterAnimation,
  add3DTiles,
} from '../map';
import ClusterLayer from '../map/layer/cluster';
import OverLayer from '../map/layer/overlay';
import { ViewShedAnalysis } from '../map/viewShed';
import KeyBoardControl from '../map/control';
import showEyeMap from '../map/eyeMap';
import MVTProvider from '../map/provider/mvtProvider';
import RightMenu from '../map/rightMenu';
import Fire from '../map/particleSystem/fire';
import PostStageMangner from '../map/postStage';

export default {
  components: {
    'base-map': BaseMap,
    measure: Measure,
  },
  setup() {
    const router = useRouter();
    const keyBoard = ref(false);
    const keyBoardControl = ref(null);
    const isEyeMapShow = ref(false);
    const store = useStore();
    const mapInstance = computed(() => store.getters.mapInstance);
    const setCenter = (xyz) => {
      mapInstance.value.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(
          xyz.x,
          xyz.y,
          xyz.z || 50000,
        ), // 设置位置
        orientation: {
          heading: Cesium.Math.toRadians(0), // 方向
          pitch: Cesium.Math.toRadians(-90), // 倾斜角度
          roll: Cesium.Math.toRadians(0),
        },
      });
    };
    const doAnimationLine = () => {
      if (mapInstance.value) {
        const from = {
          name: '北京市',
          x: 116.4,
          y: 39.9,
        };
        const to = [
          {
            name: '上海市',
            x: 116.33,
            y: 39.88,
          },
          {
            name: '郑州市',
            x: 116.41,
            y: 39.91,
          },
          {
            name: '武汉市',
            x: 116.31,
            y: 39.98,
          },
        ];
        addAnimationLine(from, to, mapInstance.value);
        setCenter(from);
      }
    };
    const doAnimationStraightLine = () => {
      const coordinates = [
        [110, 30],
        [120, 30.4],
      ];
      addAnimationStraightLine(coordinates, mapInstance.value);
      const from = {
        name: '武汉市',
        x: 114.318312,
        y: 30.47259,
        z: 5000000,
      };
      setCenter(from);
    };
    const addClusterLayer = () => {
      const arr = [];
      for (let i = 0; i < 50; i++) {
        arr.push({
          x: 114 + Math.random(),
          y: 30 + Math.random(),
        });
      }
      new ClusterLayer(mapInstance.value).addData(arr);
      setCenter({
        x: 114.318312,
        y: 30.47259,
        z: 5000000,
      });
    };
    const addGifLayer = () => {
      new OverLayer(mapInstance.value).addData({
        x: 114.318312,
        y: 30.47259,
      });
      setCenter({
        x: 114.318312,
        y: 30.47259,
        z: 5000000,
      });
    };
    const addViewShed = () => {
      ViewShedAnalysis(mapInstance.value);
    };
    const addKeyBoard = () => {
      keyBoardControl.value = new KeyBoardControl(mapInstance.value);
      keyBoardControl.value.start();
    };
    const removeKeyBoard = () => {
      keyBoardControl.value && keyBoardControl.value.stop();
    };
    const addEyeMap = () => {
      if (!isEyeMapShow.value) {
        isEyeMapShow.value = true;
        showEyeMap('eye-container', mapInstance.value);
      }
    };
    const addMvt = () => {
      mapInstance.value.imageryLayers.removeAll();
      mapInstance.value.scene.globe.baseColor = new Cesium.Color(
        1.0,
        1.0,
        1.0,
        1.0,
      );
      mapInstance.value.scene.imageryLayers.addImageryProvider(
        new MVTProvider({
          url:
            'https://a.tiles.mapbox.com/v4/mapbox.mapbox-streets-v6/{z}/{x}/{y}.vector.pbf?access_token={k}',
          key:
            'pk.eyJ1IjoibWFyc2dpcyIsImEiOiJja2Fod2xlanIwNjJzMnhvMXBkMnNqcjVpIn0.WnxikCaN2KV_zn9tLZO77A',
        }),
      );
    };
    const addRightMenu = () => {
      new RightMenu(mapInstance.value).setMenu([
        {
          id: 'menu-1',
          text: '菜单1',
          cb: (e) => {
            alert(e);
          },
        },
      ]);
    };
    const doWaterAnimation = () => {
      addWaterAnimation(
        [
          114.49,
          30.43,
          0,
          115.49,
          30.43,
          0,
          115.49,
          31.43,
          0,
          114.49,
          31.43,
          0,
        ],
        mapInstance.value,
      );
      setCenter({
        x: 114.5985634205044,
        y: 32.43079913513041,
        z: 1000000,
      });
    };
    const do3DTiles = () => {
      add3DTiles(
        'http://resource.dvgis.cn/data/3dtiles/ljz/tileset.json',
        mapInstance.value,
      );
    };
    const addFire = () => {
      setCenter({
        x: 114.389,
        y: 30.67,
        z: 800,
      });
      const fire = new Fire(mapInstance.value);
      fire.start({
        x: 114.389,
        y: 30.67,
        z: 0,
      });
    };
    const addPostStage = () => {
      const postStageMangner = new PostStageMangner(mapInstance.value);
      postStageMangner.show();
    };
    const showViewerSync = () => {
      router.push('/viewersync');
    };

    return {
      keyBoard,
      isEyeMapShow,
      addPostStage,
      addFire,
      do3DTiles,
      doWaterAnimation,
      addRightMenu,
      addMvt,
      addEyeMap,
      removeKeyBoard,
      addKeyBoard,
      addViewShed,
      addGifLayer,
      addClusterLayer,
      doAnimationStraightLine,
      doAnimationLine,
      showViewerSync,
    };
  },
};
</script>
<style scoped></style>
