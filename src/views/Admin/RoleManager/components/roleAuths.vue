<template>
  <div class="drawer">
    <div class="title">
      <span>{{ title }}</span>
      <i
        class="btn el-icon-close"
        @click="closeDrawer"/>
    </div>
    <div class="content">
      <cs-row-tab
        class="mtb10"
        title="角色归属"/>
      <div class="rolers">
        <el-tag
          v-for="(item, index) in rolers"
          :key="index">{{ item.ADMIN_TYPE_INFO_NAME }}</el-tag>
        <p
          v-if="!rolers.length"
          class="notag">暂无数据</p>
      </div>
      <cs-row-tab
        class="mtb10"
        title="权限范围"/>
      <cs-table
        :data="auths"
        :height="440"
        hasindex>
        <el-table-column
          label="权限ID"
          header-align="center"
          prop="ID"
          min-width="80"/>
        <el-table-column
          header-align="center"
          label="权限名称"
          show-overflow-tooltip
          prop="Name"/>
        <el-table-column
          header-align="center"
          label="权限标识"
          prop="Mark"/>
        <el-table-column
          label="权限类型"
          header-align="center">
          <template slot-scope="{row}">
            {{ roleTypeMap[row.Value.AuthType] }}
          </template>
        </el-table-column>
        <el-table-column
          label="权限值"
          align="center">
          <template slot-scope="{row}">
            {{ showRoleVal(row,row.Value) }}
          </template>
        </el-table-column>
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
