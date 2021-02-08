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
        <li class="nav-item" @click="addAnimationLine">
          <a class="nav-link" href="#">动态抛物线</a>
        </li>
        <li class="nav-item" @click="addAnimationStraightLine">
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
        <li class="nav-item" @click="addWaterAnimation">
          <a class="nav-link" href="#">动态水面</a>
        </li>
        <li class="nav-item" @click="add3DTiles">
          <a class="nav-link" href="#">白模渲染</a>
        </li>
        <li class="nav-item" @click="addFire">
          <a class="nav-link" href="#">火焰粒子</a>
        </li>
        <li class="nav-item" @click="addPostStage">
          <a class="nav-link" href="#">下雨</a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'
import * as Cesium from 'cesium'
import BaseMap from './baseMap'
import Measure from './measure'
import {
  addAnimationLine,
  addAnimationStraightLine,
  addWaterAnimation,
  add3DTiles
} from '../map'
import ClusterLayer from '../map/layer/cluster.js'
import OverLayer from '../map/layer/overlay.js'
import { ViewShedAnalysis } from '../map/viewShed'
import KeyBoardControl from '../map/control.js'
import showEyeMap from '../map/eyeMap.js'
import { MVTProvider } from '../map/provider/mvtProvider'
import RightMenu from '../map/rightMenu'
import Fire from '../map/particleSystem/fire'
import PostStageMangner from '../map/postStage'

export default {
  components: {
    'base-map': BaseMap,
    measure: Measure
  },
  computed: {
    ...mapGetters(['mapInstance'])
  },
  data () {
    return {
      keyBoard: null,
      isEyeMapShow: false
    }
  },
  methods: {
    setCenter (xyz) {
      this.mapInstance.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(
          xyz.x,
          xyz.y,
          xyz.z || 50000
        ), // 设置位置
        orientation: {
          heading: Cesium.Math.toRadians(0), // 方向
          pitch: Cesium.Math.toRadians(-90), // 倾斜角度
          roll: Cesium.Math.toRadians(0)
        }
      })
    },
    addAnimationLine () {
      if (this.mapInstance) {
        const from = {
          name: '北京市',
          x: 116.4,
          y: 39.9
        }
        const to = [
          {
            name: '上海市',
            x: 116.33,
            y: 39.88
          },
          {
            name: '郑州市',
            x: 116.41,
            y: 39.91
          },
          {
            name: '武汉市',
            x: 116.31,
            y: 39.98
          }
        ]
        addAnimationLine(from, to, this.mapInstance)
        this.setCenter(from)
      }
    },
    addAnimationStraightLine () {
      const coordinates = [
        [110, 30],
        [120, 30.4]
      ]
      addAnimationStraightLine(coordinates, this.mapInstance)
      const from = {
        name: '武汉市',
        x: 114.318312,
        y: 30.47259,
        z: 5000000
      }
      this.setCenter(from)
    },
    addClusterLayer () {
      const arr = []
      for (let i = 0; i < 50; i++) {
        arr.push({
          x: 114 + Math.random(),
          y: 30 + Math.random()
        })
      }
      new ClusterLayer(this.mapInstance).addData(arr)
      this.setCenter({
        x: 114.318312,
        y: 30.47259,
        z: 5000000
      })
    },
    addGifLayer () {
      new OverLayer(this.mapInstance).addData({
        x: 114.318312,
        y: 30.47259
      })
      this.setCenter({
        x: 114.318312,
        y: 30.47259,
        z: 5000000
      })
    },
    addViewShed () {
      ViewShedAnalysis(this.mapInstance)
    },
    addKeyBoard () {
      this.keyBoardControl = new KeyBoardControl(this.mapInstance)
      this.keyBoardControl.start()
    },
    removeKeyBoard () {
      this.keyBoardControl && this.keyBoardControl.stop()
    },
    addEyeMap () {
      if (!this.isEyeMapShow) {
        this.isEyeMapShow = true
        showEyeMap('eye-container', this.mapInstance)
      }
    },
    addMvt () {
      this.mapInstance.imageryLayers.removeAll()
      this.mapInstance.scene.globe.baseColor = new Cesium.Color(
        1.0,
        1.0,
        1.0,
        1.0
      )
      this.mapInstance.scene.imageryLayers.addImageryProvider(
        new MVTProvider({
          url:
            'https://a.tiles.mapbox.com/v4/mapbox.mapbox-streets-v6/{z}/{x}/{y}.vector.pbf?access_token={k}',
          key:
            'pk.eyJ1IjoibWFyc2dpcyIsImEiOiJja2Fod2xlanIwNjJzMnhvMXBkMnNqcjVpIn0.WnxikCaN2KV_zn9tLZO77A'
        })
      )
    },
    addRightMenu () {
      new RightMenu(this.mapInstance).setMenu([
        {
          id: 'menu-1',
          text: '菜单1',
          cb: (e) => {
            alert(e)
          }
        }
      ])
    },
    addWaterAnimation () {
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
          0
        ],
        this.mapInstance
      )
      this.setCenter({
        x: 114.5985634205044,
        y: 32.43079913513041,
        z: 1000000
      })
    },
    add3DTiles () {
      add3DTiles(
        'http://resource.dvgis.cn/data/3dtiles/ljz/tileset.json',
        this.mapInstance
      )
    },
    addFire () {
      this.setCenter({
        x: 114.389,
        y: 30.67,
        z: 800
      })
      const fire = new Fire(this.mapInstance)
      fire.start({
        x: 114.389,
        y: 30.67,
        z: 0
      })
    },
    addPostStage () {
      const postStageMangner = new PostStageMangner(this.mapInstance)
      postStageMangner.show()
    }
  }
}
</script>
<style scoped></style>
