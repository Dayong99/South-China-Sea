<template>
  <div id="ship_manager" class="ship_manager" v-show="systemManagerShow" v-drag>
    <div class="manager_title">
      <span>评估条件因子</span>
      <img
        src="@/assets/images/legendbar/close.png"
        @click.stop="closeManager"
      />
    </div>
    <div class="manager_operation">
      <el-input
        placeholder="请输入关键词"
        prefix-icon="el-icon-search"
        v-model="queryParams.remark"
        class="operation_input"
        clearable
        @clear="search"
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
            {{ (pagination.num - 1) * pagination.size + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="名称" align="center" min-width="100px">
          <template slot-scope="scope">
            <span>{{ scope.row.remark }}</span>
          </template>
        </el-table-column>
        <el-table-column label="气象要素" align="center" min-width="100px">
          <template slot-scope="scope">
            <span>{{ scope.row.parameterName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="气象要素单位" align="center" min-width="100px">
          <template slot-scope="scope">
            <span>{{ scope.row.units }}</span>
          </template>
        </el-table-column>
        <el-table-column label="分级表达式" align="center" min-width="100px">
          <template slot-scope="scope">
            <span>{{ scope.row.expression }}</span>
          </template>
        </el-table-column>
        <el-table-column label="分级参数" align="center" min-width="100px">
          <template slot-scope="scope">
            <span>{{ scope.row.parameter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="分级系数" align="center" min-width="100px">
          <template slot-scope="scope">
            <span>{{ scope.row.coefficient }}</span>
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
        style="padding-bottom: 0"
      />
    </div>
    <edit
      ref="edit"
      :dialog-visible="dialog.isVisible"
      :title="dialog.title"
      @close="closeDialogPage"
    />
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import { mapState, mapMutations } from "vuex";
import edit from "./edit.vue";

export default {
  components: {
    edit,
    Pagination,
  },
  data() {
    return {
      weatherOptionsList: [],
      total: 0,
      // 新增 修改 对话框
      dialog: {
        isVisible: false,
        title: "",
      },
      // 详细面板显示隐藏
      systemManagerShow: false,
      managerValue: "",
      tableData: [],
      // 分页
      pagination: {
        size: 5,
        num: 1,
      },
      queryParams: {
        remark: null,
      },

      infoVisible: false,
      geoStyle: {
        color: "#ff7800",
        weight: 3,
        opacity: 0.65,
      },
    };
  },
  mounted() {},
  computed: {
    ...mapState({
      menuList: (state) => state.menuBar.menuList,
      systemList: (state) => state.menuBar.systemList,
    }),
  },
  watch: {
    // 监听menuList，控制详细面板的显隐
    menuList: {
      handler(newval, oldval) {
        let i = newval.findIndex((item) => {
          return item.flag == true;
        });
        if (i !== 3) {
          this.systemManagerShow = false;
        }
      },
      deep: true,
    },
    systemList: {
      handler(newval, oldval) {
        if (newval[8].flag) {
          this.systemManagerShow = true;
          this.loadWeatherFactor();
        } else {
          this.systemManagerShow = false;
        }
      },
      deep: true,
    },
    systemManagerShow(val) {
      if (val) {
        this.loadWeatherFactor();
      }
    },
  },
  methods: {
    ...mapMutations({
      setMenuList: "menuBar/setMenuList",
    }),
    loadWeatherFactor() {
      this.$get(`api/parameters`, {
        isEvaluate: 1,
      })
        .then((res) => {
          if (res.status === 200) {
            this.weatherOptionsList = res.data.data;
            this.fetch();
          }
        })
        .catch(() => {
          this.$message({
            message: "气象要素列表载入失败",
            type: "error",
          });
        });
    },
    editItem(row) {
      this.$refs.edit.setData(row);
      this.dialog.isVisible = true;
      this.dialog.title = "修改评估条件因子";
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
      console.log(row, `delete`);
      this.$delete(`/api/condition`, {
        id: row.id,
      })
        .then(() => {
          this.$message({
            message: "删除成功",
            type: "success",
          });
        })
        .then(() => {
          this.fetch();
        });
    },
    add() {
      this.dialog.isVisible = true;
      this.dialog.title = "添加评估条件因子";
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
      this.$get("/api/condition", {
        ...params,
      }).then((res) => {
        console.log(res, "/api/condition");
        if (res.data.data) {
          this.total = res.data.data.total;
          this.tableData = res.data.data.rows.map((e, i) => {
            let obj = {};
            this.weatherOptionsList.forEach((a, b) => {
              if (a.id === e.parametersId) {
                obj = {
                  ...e,
                  ...a,
                };
                obj.id = e.id
              }
            });
            return obj;
          });
        }
      });
    },
    // 关闭新增 修改 对话框
    closeDialogPage() {
      this.dialog.isVisible = false;
      this.fetch();
    },

    closeManager() {
      this.systemManagerShow = false;
      this.menuList[1].flag = false;
      this.setMenuList(this.menuList);
    },
    // 海区详情
    closeInfo() {
      this.infoVisible = false;
    },
    information(row) {
      this.infoVisible = true;
      this.$refs.info.setData(row);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>