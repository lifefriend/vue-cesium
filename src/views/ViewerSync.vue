<template>
  <div id="map-container">
    <div class="custom-control custom-switch">
      <input type="checkbox" class="custom-control-input" id="customSwitch1" @change="onChange">
      <label class="custom-control-label" for="customSwitch1">开启同步</label>
    </div>
    <div id="cesium-container1" />
    <div id="cesium-container2" />
  </div>
</template>

<script>
import 'cesium/Source/Widgets/widgets.css';
import 'bootstrap/dist/css/bootstrap.css';
import { nextTick, onMounted } from 'vue';
import { syncHandler, SyncViewer } from '../map/viewerSync';

export default {
  name: 'ViewerSync',
  setup() {
    onMounted(() => {
      nextTick(() => {
        syncHandler.initViewer1('cesium-container1');
        syncHandler.initViewer2('cesium-container2');
        syncHandler.viewerSyncUtils = new SyncViewer(syncHandler.viewer1, syncHandler.viewer2);
        syncHandler.setView();
      });
    });
    const onChange = (e) => {
      syncHandler.viewerSyncUtils.sync(e.target.checked);
    };
    return {
      onChange,
    };
  },
};
</script>
<style>
#map-container {
  height: 100%;
  display: flex;
  flex-direction: row;
}
#cesium-container1,#cesium-container2{
  flex: 1;
}
.custom-control{
  position: absolute;
  background: #fff;
}
</style>
