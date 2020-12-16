<template>
  <el-autocomplete
    :fetch-suggestions="querySearchAsync"
    v-model="state"
    :placeholder="placeholder"
    :value-key="defaultProps.label"
    @select="handleSelect"
  />
</template>
<script>
export default {
    props: {
        restaurants: {
            type: Array,
            default: () => {
                return []
            }
        },
        requestfn: {
            type: Function,
            default: () => {}
        },
        placeholder: {
            type: String,
            default: '请输入内容'
        },
        // 输入建议对象中用于显示的键名
        defaultProps: {
            type: Object,
            default: () => {
                return { label: 'name', value: 'value' }
            }
        },
        value: {
            type: String | Array,
            default: ''
        },
        // 远程访问路径 如res.data.list
        resPath: {
            type: Array,
            default: () => {
                return []
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
        }
    },
    data() {
        return {
            state: ''
        }
    },
    watch: {
        state: {
            handler: function(n) {
                this.$emit('input', n)
            },
            deep: true
        }
    },
    mounted() {
        this.state = this.value
    },
    methods: {
        querySearchAsync(queryString, cb) {
            const obj = { ...this.params }
            obj[this.keyAttr] = queryString
            this.requestfn(obj).then(res => {
                const results = queryString ? this.getList(res).filter(this.createStateFilter(queryString)) : this.getList(res)
                cb(results)
            })
        },
        createStateFilter(queryString) {
            return (state) => {
                return (state[this.defaultProps.label].toLowerCase().indexOf(queryString.toLowerCase()) === 0)
            }
        },
        getList(res) {
            let data = res
            this.resPath.map(attr => {
                data = data[attr]
            })
            return data || []
        },
        handleSelect(item) {
            // this.$emit('update:state', item[this.defaultProps.label])
            this.$emit('selectData', item)
        }
    }
}
</script>
