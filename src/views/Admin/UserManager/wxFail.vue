<template>
  <div>绑定微信成功</div>
</template>
<script>
import common from '@/utils/common'
export default {
    mounted() {
        // 获取失败信息
        var msg = common.getUrlKey('msg')
        top.showError(msg)
    }
}
</script>
