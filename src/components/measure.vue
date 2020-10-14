<!-- 菜单栏 -->
<template>
  <div>
    <button class="btn btn-secondary dropdown-toggle" type="button" @click="dropDownShow">
      测量
    </button>
    <div class="dropdown-menu dropdown-menu-left" :class="{ show: dropdownShow }">
      <a class="dropdown-item" href="#" @click="distance">测距</a>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import MeasureMangner from '../map/measure'

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
    distance () {
      const measureMangner = new MeasureMangner(this.mapInstance)
      measureMangner.distance()
    }
  }
}
</script>
<style scoped>
.dropdown-menu-left{
  left:170px;
}
</style>
