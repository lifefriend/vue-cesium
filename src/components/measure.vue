<!-- 菜单栏 -->
<template>
  <div>
    <button class="btn btn-secondary dropdown-toggle" type="button" @click="doDownShow">
      测量
    </button>
    <div class="dropdown-menu dropdown-menu-left" :class="{ show: dropdownShow }">
      <a class="dropdown-item" href="#" @click="distance">测距</a>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import MeasureMangner from '../map/measure';

export default {
  setup() {
    const dropdownShow = ref(false);
    const store = useStore();
    const mapInstance = computed(() => store.getters.mapInstance);
    const doDownShow = () => {
      dropdownShow.value = !dropdownShow.value;
    };
    const distance = () => {
      const measureMangner = new MeasureMangner(mapInstance.value);
      measureMangner.distance();
    };
    return {
      dropdownShow,
      doDownShow,
      distance,
    };
  },
};
</script>
<style scoped>
.dropdown-menu-left{
  left:170px;
}
</style>
