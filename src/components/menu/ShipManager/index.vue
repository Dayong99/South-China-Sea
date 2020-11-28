<template>
  <div id="ship_manager" class="ship_manager" v-show="shipManagerShow">
    <div class="manager_title">
      <span>船舰管理</span>
      <img
        src="@/assets/images/legendbar/close.png"
        @click.stop="closeManager"
      />
    </div>
    <div class="manager_operation">
      <el-input
        placeholder="请输入关键词"
        prefix-icon="el-icon-search"
        v-model="queryParams.warshipName"
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
        <el-table-column
          label="名称"
          prop="role-name"
          align="center"
          min-width="100px"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.warshipName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="类型"
          prop="role-name"
          align="center"
          min-width="100px"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.warshipType }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="编号"
          prop="role-name"
          align="center"
          min-width="100px"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.number }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="吨位"
          prop="role-name"
          align="center"
          min-width="100px"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.tonnage }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="抗风能力"
          prop="role-name"
          align="center"
          min-width="100px"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.windResistant }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="图片"
          prop="role-name"
          align="center"
          min-width="100px"
        >
          <template slot-scope="scope">
            <span>
              <el-image
                style="width: 20px; height: 20px"
                :src="scope.row.shipPhoto"
                :preview-src-list="[scope.row.shipPhoto]"
              >
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="140px"
          header-align="center"
          align="center"
        >
          <template slot-scope="{ row }">
            <el-button
              icon="el-icon-warning-outline"
              class="table_column_icon blue"
              type="text"
              @click="information(row)"
            ></el-button>
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
      shipManagerShow: false,
      managerValue: "",
      tableData: [],
      // 分页
      pagination: {
        size: 5,
        num: 1,
      },
      queryParams: {
        warshipName: null
      }
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
        if (i != -1 && i == 0) {
          this.shipManagerShow = true;
        } else {
          this.shipManagerShow = false;
        }
      },
      deep: true,
    },
  },
  methods: {
    ...mapMutations({
      setMenuList: "menuBar/setMenuList",
    }),
    editItem(row) {
      this.$refs.edit.setData(row);
      this.dialog.isVisible = true;
      this.dialog.title = "修改船舰";
    },
    algorithm() {
      this.algorithmDialog.isVisible = true;
      this.algorithmDialog.title = "船舰信息";
    },
    closeAlgorithmDialog() {
      this.algorithmDialog.isVisible = false;
      this.fetch();
    },
    information(row) {
      console.log(row)
      this.$refs.edit.setData(row);
      this.dialog.isVisible = true;
      this.dialog.title = "船舰信息";
    },
    // 搜索重置
    resetSearch() {
      this.queryParams = {
        warshipName: null
      }
      this.search()
    },
    // 删除
    deleteItem(row) {
      console.log(row, `row`);
      this.$delete(`/api/warship`, {
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
      console.log("添加");
      this.dialog.isVisible = true;
      this.dialog.title = "添加船舰";
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
      console.log("获取表格数据");
      this.$get("/api/warship", {
        ...params,
      }).then((res) => {
        if (res.data.data) {
          console.log(res.data.data,`res.data.data`)
          this.total = res.data.data.total;
          this.tableData = res.data.data.rows;
          console.log(this.tableData)
        }
      });
    },
    // 关闭新增 修改 对话框
    closeDialogPage() {
      this.dialog.isVisible = false;
      this.fetch();
    },
    closeManager() {
      this.shipManagerShow = false;
      this.menuList[0].flag = false;
      this.setMenuList(this.menuList);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>