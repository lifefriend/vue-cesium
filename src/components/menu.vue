<!-- 菜单栏 -->
<template>
  <nav class="navbar navbar-expand navbar-dark bg-dark">
    <a class="navbar-brand" href="#">Navbar</a>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item" @click="addAnimationLine">
          <a class="nav-link" href="#">流向动态线</a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'
import * as Cesium from 'cesium'
import { addAnimationLine } from '../map'

export default {
  computed: {
    ...mapGetters(['mapInstance'])
  },
  methods: {
    addAnimationLine () {
      if (this.mapInstance) {
        const from = {
          name: '北京市',
          x: 116.40,
          y: 39.90
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

        this.mapInstance.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(from.x, from.y, 50000), // 设置位置
          orientation: {
            heading: Cesium.Math.toRadians(0), // 方向
            pitch: Cesium.Math.toRadians(-90), // 倾斜角度
            roll: Cesium.Math.toRadians(0)
          }
        })

        addAnimationLine(from, to, this.mapInstance)
      }
    }
  }
}

</script>
<style scoped>
</style>
