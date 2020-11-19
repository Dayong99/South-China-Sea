<template>
  <div id="ship_manager" class="ship_manager" v-show="teamManagerShow">
    <div class="manager_title">
      <span>编队管理</span>
      <img src="@/assets/images/legendbar/close.png" @click.stop="closeManager">
    </div>
    <div class="manager_operation">
      <el-input
        placeholder="请输入关键词"
        prefix-icon="el-icon-search"
        v-model="managerValue"
        class="operation_input"
        clearable>
      </el-input>
      <el-button class="operation_search">搜索</el-button>
      <el-button class="operation_clear">重置</el-button>
      <el-button icon="el-icon-plus" class="operation_add">添加</el-button>
    </div>
    <div class="manager_table">
      <el-table
        :data="tableData"
        border
        style="width: 100%;"
        max-height="390px">
        <el-table-column
          prop="id"
          label="序号"
          header-align="center"
          align="center">
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称"
          width="120"
          header-align="center"
          align="center">
        </el-table-column>
        <el-table-column
          prop="unit"
          label="基本单元"
          header-align="center"
          align="center">
        </el-table-column>
        <el-table-column
          label="操作"
          width="140px"
          header-align="center"
          align="center">
          <template slot-scope="scope">
            <el-button icon="el-icon-warning-outline" class="table_column_icon blue" type="text"></el-button>
            <el-button icon="el-icon-edit-outline" class="table_column_icon green" type="text"></el-button>
            <el-button icon="el-icon-delete" class="table_column_icon red" type="text"></el-button>
            <el-button icon="el-icon-s-operation" class="table_column_icon purple" type="text"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="manager_page">
      <el-pagination
        :page-sizes="[5, 10, 15]"
        :page-size="10"
        :pager-count="5"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="400">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  data() {
    return {
      // 详细面板显示隐藏
      teamManagerShow: false,
      managerValue: '',
      tableData: [{
        id: '1',
        name: '王小虎',
        unit: '上海',
      }, {
        id: '2',
        name: '王小虎',
        unit: '上海',
      }, {
        id: '2',
        name: '王小虎',
        unit: '上海',
      }, {
        id: '2',
        name: '王小虎',
        unit: '上海',
      }]
    }
  },
  computed: {
    ...mapState({
      menuList: state => state.menuBar.menuList
    })
  },
  watch: {
    // 监听menuList，控制详细面板的显隐
    menuList: {
      handler(newval, oldval) {
        let i = newval.findIndex(item => {
          return item.flag == true
        })
        if(i != -1 && i == 1) {
          this.teamManagerShow = true
        } else {
          this.teamManagerShow = false
        }
      },
      deep: true
    }
  },
  methods: {
    ...mapMutations({
      setMenuList: 'menuBar/setMenuList'
    }),
    closeManager() {
      this.teamManagerShow = false
      this.menuList[1].flag = false
      this.setMenuList(this.menuList)
    },
  }
}
</script>

<style lang="scss" scoped>

</style>