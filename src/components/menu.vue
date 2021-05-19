<!-- 菜单栏 -->
<template>
  <nav class="navbar navbar-expand navbar-dark bg-dark">
    <div class="collapse navbar-collapse">
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
  <nav class="navbar navbar-expand navbar-dark bg-dark">
    <div class="collapse navbar-collapse">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item" @click="showDynamicLabel">
          <a class="nav-link" href="#">动态标记</a>
        </li>
        <li class="nav-item" @click="showBounceMarker">
          <a class="nav-link" href="#">弹跳点动画</a>
        </li>
        <!-- <li class="nav-item" @click="reShowBounceMarker">
          <a class="nav-link" href="#">repaly</a>
        </li>
        <li class="nav-item" @click="showExtent">
          <a class="nav-link" href="#">获取范围</a>
        </li>-->
        <li class="nav-item" @click="addAnimationWall">
          <a class="nav-link" href="#">动态墙</a>
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
import DynamicLabel from '../map/dynamicLabel';
import BounceMarker, { initEvent } from '../map/bounceMarker';
import { getCenter } from '../map/utils/common';
import AnimationWall from '../map/animationWall';

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
    const setCenter = (xyz, opt = {
      heading: 0,
      pitch: -90,
      roll: 0,
    }) => {
      mapInstance.value.camera.lookAt(Cesium.Cartesian3.fromDegrees(xyz.x, xyz.y), new Cesium.HeadingPitchRange(Cesium.Math.toRadians(opt.heading), Cesium.Math.toRadians(opt.pitch), xyz.z || 50000));
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
    const showDynamicLabel = () => {
      const arr = [
        {
          position: [121.47176626434644, 31.226931885308268, 10],
          name: '国雅大厦',
        },
        {
          position: [121.48231424363982, 31.23191186890701, 9],
          name: '尚都国际中心',
        },
        {
          position: [121.47280527917779, 31.234259150465007, 11],
          name: '和乔大厦Ａ座',
        },
        {
          position: [121.48405222060568, 31.237829365433115, 12],
          name: '中国农业博物馆',
        },
      ];
      arr.forEach((e) => {
        new DynamicLabel(mapInstance.value, e.position, e.name);
      });
      setCenter({
        x: 121.47176626434644,
        y: 31.226931885308268,
        z: 5000,
      });
    };
    const bMarkers = [];
    const showBounceMarker = () => {
      setCenter({
        x: 121.47861530566308,
        y: 31.243450391594713,
        z: 5000,
      }, {
        heading: 0,
        pitch: -30,
        roll: 0,
      });
      const arr = [
        {
          position: [121.47176626434644, 31.226931885308268, -1],
        },
        {
          position: [121.47280527917779, 31.234259150465007, -2],
        },
        {
          position: [121.48231424363982, 31.23191186890701, -3],
        },
        {
          position: [121.48405222060568, 31.237829365433115, -4],
        },
      ];
      arr.forEach((e) => {
        const f = new BounceMarker(mapInstance.value, e.position);
        bMarkers.push(f);
      });
      initEvent(mapInstance.value);
    };
    const reShowBounceMarker = () => {
      bMarkers.forEach((e) => {
        e.remove();
      });
      showBounceMarker();
    };
    const showExtent = () => {
      const center = getCenter(mapInstance.value);
      console.log('extent', center);
    };
    const addAnimationWall = () => {
      new AnimationWall(mapInstance.value).add([
        120.79579364922108, 31.41897182222492,
        120.79514640830746, 31.413416233367496,
        120.80014457845661, 31.409758233570173,
        120.80209040697119, 31.4057337132493,
        120.80029764615955, 31.40018476234912,
        120.79461591180647, 31.393602298131494,
        120.80156004258437, 31.373752923140046,
        120.81530979532509, 31.376170803746234,
        120.81799402128613, 31.369903794337265,
        120.82176135960087, 31.36679674875513,
        120.82593532700473, 31.366541207705012,
        120.83103046449061, 31.3692834055125,
        120.83358860960048, 31.372351098711572,
        120.83719814240608, 31.376592616157275,
        120.84249512848864, 31.378757567597003,
        120.84384209946673, 31.38311264607813,
        120.83986623598962, 31.386877926326456,
        120.84389196467293, 31.395675136605373,
        120.84824026431292, 31.401305169421832,
        120.84736455536907, 31.40786016415259,
        120.845392713477, 31.41314556194053,
        120.84634518993951, 31.417009174294737,
        120.84473492552534, 31.420086883959744,
        120.84294781929464, 31.422998359692404,
        120.79579364922108, 31.41897182222492,
      ]);
      setCenter({
        x: 120.82824026431292,
        y: 31.401305169421832,
        z: 10000,
      }, {
        heading: 0,
        pitch: -30,
        roll: 0,
      });
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
      showDynamicLabel,
      showBounceMarker,
      reShowBounceMarker,
      showExtent,
      addAnimationWall,
    };
  },
};
</script>
<style scoped></style>
