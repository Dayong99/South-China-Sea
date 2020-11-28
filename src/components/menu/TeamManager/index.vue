<template>
  <div id="ship_manager" class="ship_manager" v-show="teamManagerShow">
    <div class="manager_title">
      <span>编队管理</span>
      <img
        src="@/assets/images/legendbar/close.png"
        @click.stop="closeManager"
      />
    </div>
    <div class="manager_operation">
      <el-input
        placeholder="请输入关键词"
        prefix-icon="el-icon-search"
        v-model="queryParams.name"
        class="operation_input"
        clearable
      >
      </el-input>
      <el-button class="operation_search" @click="search">搜索</el-button>
      <el-button class="operation_clear" @click="resetSearch">重置</el-button>
      <el-button icon="el-icon-plus" class="operation_add" @click="add"
        >添加</el-button
      >
    </div>
    <div class="manager_table">
      <el-table :data="tableData" border style="width: 100%" max-height="400px">
        <el-table-column label="序号" width="70px" align="center">
          <template slot-scope="scope">
            {{(pagination.num - 1) * pagination.size + scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column
          label="名称"
          prop="role-name"
          align="center"
          min-width="100px"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="基本单元"
          prop="role-name"
          align="center"
          min-width="100px"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.ships }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="140px"
          header-align="center"
          align="center"
        >
          <template slot-scope="{ row }">
            <!--<el-button
              icon="el-icon-warning-outline"
              class="table_column_icon blue"
              type="text"
              @click="information(row)"
            ></el-button> -->
            <el-button
              icon="el-icon-edit-outline"
              class="table_column_icon green"
              type="text"
              @click="editItem(row)"
            ></el-button>
            <el-button
              icon="el-icon-delete"
              class="table_column_icon red"
              type="text"
              @click="deleteItem(row)"
            ></el-button>
            <!--<el-button
              icon="el-icon-s-operation"
              class="table_column_icon purple"
              type="text"
              @click="algorithm(row)"
            ></el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="manager_page">
      <!-- 分页 -->
      <pagination
        :total="total"
        :page.sync="pagination.num"
        :limit.sync="pagination.size"
        @pagination="search"
      />
    </div>

    <edit
      ref="edit"
      :dialog-visible="dialog.isVisible"
      :title="dialog.title"
      @close="closeDialogPage"
    />

    <algorithm
      ref="algorithm"
      :dialog-visible="algorithmDialog.isVisible"
      @close="closeAlgorithmDialog"
    />
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { mapState, mapMutations } from "vuex";
import edit from "./edit.vue";
import algorithm from "./algorithm.vue";
export default {
  components: {
    edit,
    Pagination,
    algorithm
  },
  data() {
    return {
      // 算法弹窗
      algorithmDialog: {
        isVisible: false,
        title: "",
      },
      total: 0,
      // 新增 修改 对话框
      dialog: {
        isVisible: false,
        title: "",
      },
      // 详细面板显示隐藏
      teamManagerShow: false,
      managerValue: "",
      tableData: [],
      // 分页
      pagination: {
        size: 5,
        num: 1,
      },
      queryParams: {
        name: null,
      },
    };
  },
  mounted() {
    this.fetch();
  },
  computed: {
    ...mapState({
      menuList: (state) => state.menuBar.menuList,
    }),
  },
  watch: {
    // 监听menuList，控制详细面板的显隐
    menuList: {
      handler(newval, oldval) {
        let i = newval.findIndex((item) => {
          return item.flag == true;
        });
        if (i != -1 && i == 1) {
          this.teamManagerShow = true;
        } else {
          this.teamManagerShow = false;
        }
      },
      deep: true,
    },
  },
  methods: {
    ...mapMutations({
      setMenuList: "menuBar/setMenuList",
    }),
    algorithm() {
      this.algorithmDialog.isVisible = true;
      this.algorithmDialog.title = "船舰信息";
    },
    closeAlgorithmDialog() {
      this.algorithmDialog.isVisible = false;
      this.fetch();
    },
    editItem(row) {
      this.$refs.edit.loadShipList(row);
      this.dialog.isVisible = true;
      this.dialog.title = "修改编队";
    },
    information(row) {
      this.dialog.isVisible = true;
      this.dialog.title = "船舰信息";
    },
    // 搜索重置
    resetSearch() {
      this.queryParams = {
        name: null,
      };
      this.search();
    },
    // 删除
    deleteItem(row) {
      this.$delete(`/api/formation`, {
        id: row.id,
      })
        .then(() => {
          this.$message({
            message: "舰船删除成功",
            type: "success",
          });
        })
        .then(() => {
          this.fetch();
        });
    },
    add() {
      this.dialog.isVisible = true;
      this.dialog.title = "添加编队";
      this.$refs.edit.loadShipList();
    },
    // 搜索
    search() {
      this.fetch({
        ...this.queryParams,
      });
    },
    // 获取表格数据
    fetch(params = {}) {
      params.pageSize = this.pagination.size;
      params.pageNum = this.pagination.num;
      this.$get("/api/formation", {
        ...params,
      }).then((res) => {
        console.log(res, "res");
        if (res.data.data) {
          this.total = res.data.data.total;
          this.tableData = res.data.data.rows;
        }
      });
    },
    // 关闭新增 修改 对话框
    closeDialogPage() {
      this.dialog.isVisible = false;
      this.fetch();
    },
    closeManager() {
      this.teamManagerShow = false;
      this.menuList[1].flag = false;
      this.setMenuList(this.menuList);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>