<template>
  <div id="app">
    <div id="cesiumContainer"></div>
  </div>
</template>

<script>
import 'cesium/Source/Widgets/widgets.css'
import * as Cesium from 'cesium'
export default {
  name: 'App',
  mounted () {
    this.$nextTick(() => {
      Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyYzQ0NWQ5Zi1iNjU4LTQ0NTEtYWIzNC1hYzZlNDFmYzQyYzgiLCJpZCI6NjI1MCwic2NvcGVzIjpbImFzciIsImdjIl0sImlhdCI6MTU0NTc0MTc5OH0.oZJRh-eKtiJy6LyDNZQ0TgPmCMiRq2X3HaSr6y1X_ac'
      var viewer = new Cesium.Viewer('cesiumContainer')
      console.log('viewer: ', viewer)
    })
  }
}
</script>
<style>
html,
body {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}
#app,#cesiumContainer {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
