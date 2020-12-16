<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item
      v-for="rou in routes"
      :key="rou.name">
      {{ rou.name }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>
<script>
export default {
    name: 'CsBreadcrumb',
    data() {
        return {
            routes: []
        }
    },
    watch: {
        $route(to, from) {
            var matched = to.matched
            if (matched) {
                this.routes = matched.map(m => {
                    return {
                        name: m.meta.title
                    }
                })
            }
        }
    },
    mounted() {
        var matched = this.$route.matched
        if (matched) {
            this.routes = matched.map(m => {
                return {
                    name: m.meta.title
                }
            })
        }
    }
}
</script>
