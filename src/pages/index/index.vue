<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
/* eslint-disable no-unused-vars*/
import { mapState, mapActions } from 'vuex'
export default {
    name: 'App',
    data: function() {
        return {

        }
    },
    mounted() {
        // 获取窗口高度
        const that = this
        window.onresize = () => {
            return (() => {
                that.$store.dispatch('setScreenHeight', window.innerHeight)
                // console.log('ScreenHeight:', window.innerHeight)
            })()
        }
    }
}
</script>
<style >
#app{
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
}
body {
    padding:0;
    height: 100%;
}
</style>

