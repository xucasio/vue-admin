<template>
  <div
    :class="['rw-chart','chart-line',selectedId===guid?'active':'']"
    @click="clickitem">
    <div class="chart-title">
      <span class="chart-close no-drag">
        <i
          class="el-icon-close"
          @click="closeChart"/>
      </span>
      <span
        :style="'color:'+Option.base.titleColor+';text-align:'+Option.base.titleAlign"
        class="chart-name">{{ Option.base.titleName }}</span>
    </div>
    <component
      :is="cname"
      :guid="guid"/>

  </div>

</template>
<script>
/* eslint-disable no-unused-vars*/
import { mapState, mapActions } from 'vuex'
import chartline from '@/components/RWChart/chartline.vue'
import chartbar from '@/components/RWChart/chartbar.vue'
import chartpie from '@/components/RWChart/chartpie.vue'
import chartpoint from '@/components/RWChart/chartpoint.vue'
export default {
    name: 'RwChart',
    components: {
        chartline, chartbar, chartpoint, chartpie
    },
    props: {
        guid: {
            type: String,
            default: ''
        },
        cname: {
            type: String,
            default: ''
        }
    },
    data() {
        return {

        }
    },
    computed: {
        ...mapState({
            selectedId: state => state.chart.SelectId
        }),
        Option() {
            return this.$store.state.chart.List.find(e => e.i === this.guid).option
        }
    },
    mounted() {

    },
    methods: {
        closeChart() {
            this.$emit('closechart', this.guid)
        },
        clickitem() {
            console.log('111111:', this.selectedId)
            this.$store.dispatch('setCurGrid', this.guid)
        }

    }

}
</script>
