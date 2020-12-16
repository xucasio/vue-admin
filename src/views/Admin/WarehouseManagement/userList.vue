<template>
  <div class="drawer">
    <div class="title">
      <span>{{ title }}</span>
      <i
        class="btn el-icon-close"
        @click="closeDrawer"/>
    </div>
    <div class="content">
      <div class="">
        组织成员上限: {{ 100 }}
      </div>
      <cs-row-tab
        class="mtb10"
        title="组织管理员列表"/>
      <cs-table
        :data="auths"
        :height="440"
        hasindex >
        <el-table-column
          label="账号名称"
          header-align="center"
          prop="ID"
          min-width="80"/>
        <el-table-column
          header-align="center"
          label="密码"
          show-overflow-tooltip
          prop="Name"/>
      </cs-table>
    </div>

  </div>

</template>
<script>
export default {
    name: 'RoleAuths',
    props: {
        auths: {
            type: Array,
            default: () => {
                return []
            }
        },
        rolers: {
            type: Array,
            default: () => {
                return []
            }
        },
        title: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            roleTypeOptions: [{ name: '普通', id: 1 }, { name: '版本型', id: 4 }, { name: '数值型', id: 3 }, { name: '数据范围', id: 2 }]
        }
    },
    computed: {
        roleTypeMap() {
            const obj = {}
            this.roleTypeOptions.map(i => {
                obj[i.id] = i.name
            })
            return obj
        }
    },
    created() {

    },
    methods: {
        closeDrawer() {
            this.$emit('close')
        },
        showRoleVal(row, Val) {
            if (row.AuthType === 1) {
                return Val.BooleanValue
            } else if (row.AuthType === 2) {
                return (Val.DataRangStart || '') + '-' + (Val.DataRangEnd || '')
            } else if (row.AuthType === 3) {
                return Val.IntValue
            } else if (row.AuthType === 4) {
                return '-'
            }
        }
    }
}
</script>
<style lang="scss" scoped>
  .drawer{
    .title{
      padding: 15px 15px;
      display: flex;
      justify-content: space-between;
      background-color: $--color-main;
      span{
      font-size: 18px;
      font-weight: 700;
      color: #fff;
      }
      i{
        color: #fff;
        cursor: pointer;
      }
    }
    .mtb10{
      margin: 10px 0;
    }
    .content{
      padding: 15px;
      .rolers{
        min-height: 100px;
        .notag{
          margin-top: 50px;
          text-align: center;
          color: #909399;
        }
      }
    }

  }
</style>
