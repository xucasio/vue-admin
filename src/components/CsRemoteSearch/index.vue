<template>
  <el-select
    v-model="state"
    :remote-method="remoteMethod"
    :loading="loading"
    :placeholder="placeholder"
    :multiple="isMultiple"
    :allow-create="allowcreate"
    filterable
    remote
    reserve-keyword
    @change="handleSelect"
  >
    <el-option
      v-for="item in options"
      :key="item[defaultProps.value]"
      :label="item[defaultProps.label]"
      :value="item[defaultProps.value]"/>
  </el-select>
</template>
<script>
export default {
    name: 'CsRemoteSearch',
    props: {
        requestfn: {
            type: Function,
            default: () => {}
        },
        placeholder: {
            type: String,
            default: '请输入关键字查询'
        },
        // 远程访问路径 如res.data.list
        resPath: {
            type: Array,
            default: () => {
                return ['Data']
            }
        },
        // 除关键词外的额外参数
        params: {
            type: Object,
            default: () => {
                return {}
            }
        },
        // 用于检索时需要的字段名称
        keyAttr: {
            type: String,
            default: 'key'
        },
        defaultProps: {
            type: Object,
            default: () => {
                return {
                    label: 'label',
                    value: 'value'
                }
            }
        },
        isMultiple: {
            type: Boolean,
            default: false
        },
        value: {
            type: String | Array,
            default: ''
        },
        allowcreate: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            options: [],
            state: '',
            list: [],
            loading: false
        }
    },
    watch: {
        state: {
            handler: function(n) {
                this.$emit('input', n)
            },
            deep: true
        },
        value: {
            handler: function(n) {
                this.state = this.value
            }
        }
    },
    mounted() {
        this.state = this.value
    },
    methods: {
        remoteMethod(query) {
            if (query.trim() !== '') {
                this.loading = true
                const obj = { ...this.params }
                obj[this.keyAttr] = query
                this.requestfn(obj).then(res => {
                    this.loading = false
                    this.options = this.getList(res)
                })
            } else {
                this.options = []
            }
        },
        getList(res) {
            let data = res
            if (res.length > 0) {
                this.resPath.map(attr => {
                    data = data[attr]
                })
            }

            return data || []
        },
        reSet() {
            this.state = []
        },
        handleSelect(v) {
            var op = this.options.find(f => f[this.defaultProps.value] === v)
            if (op) {
                this.$emit('select', op)
            }
        }

    }
}
</script>
