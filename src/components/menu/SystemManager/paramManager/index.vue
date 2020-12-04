<template>
  <div
    id="ship_manager"
    class="ship_manager"
    v-show="systemManagerShow"
    style="width: auto; height: auto"
    v-drag
    ref="paramBox"
  >
    <div class="manager_title">
      <span>参数配置</span>
      <img
        src="@/assets/images/legendbar/close.png"
        @click.stop="closeManager"
      />
    </div>
    <div class="manager_operation">
      <el-input
        placeholder="请输入关键词"
        prefix-icon="el-icon-search"
        v-model="queryParams.baseName"
        class="operation_input"
        clearable
        @clear="search"
      >
      </el-input>
      <el-button class="operation_search" @click="search">搜索</el-button>
      <el-button class="operation_clear" @click="resetSearch">重置</el-button>
      <el-button icon="operation_search" class="operation_add" @click="addType"
        >类型管理</el-button
      >
      <el-button icon="el-icon-plus" class="operation_add" @click="add"
        >添加参数</el-button
      >
    </div>
    <div class="manager_table">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column label="序号" width="70px" align="center">
          <template slot-scope="scope">
            {{ (pagination.num - 1) * pagination.size + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          label="参数名称"
          align="center"
          min-width="240px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.baseKey }}</span>
          </template>
        </el-table-column>

        <el-table-column label="类型" align="center" min-width="100px">
          <template slot-scope="scope">
            <span v-html="showType(scope.row.baseType)"></span>
          </template>
        </el-table-column>
        <el-table-column label="值" align="center" min-width="250px">
          <template slot-scope="scope">
            <span>{{ scope.row.baseValue }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" min-width="200px">
          <template slot-scope="scope">
            <span>{{ scope.row.ramark }}</span>
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

    <type ref="type" :title="typeTitle" />
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { mapState, mapMutations } from "vuex";
import edit from "./edit.vue";
import type from "./type/index.vue";

export default {
  components: {
    edit,
    type,
    Pagination,
  },
  data() {
    return {
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
        baseName: null,
      },
      typeTitle: "",
      typeList: [],
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
        if (newval[6].flag) {
          this.systemManagerShow = true;
        } else {
          this.systemManagerShow = false;
        }
      },
      deep: true,
    },
    systemManagerShow(val) {
      if (val) {
        this.queryParams = {
          baseName: null,
        };
        this.fetch();
        this.getAllType();
        this.$refs.paramBox.style.left = "50%";
        this.$refs.paramBox.style.top = "42%";
        this.$refs.paramBox.style.transform = "translate(-50%, -50%)";
      }
    },
  },
  methods: {
    getAllType() {
      this.$get("/api/baseinfo-type").then((res) => {
        console.log(res, "res");
        if (res.data.data) {
          this.typeList = res.data.data;
        }
      });
    },
    showType(val) {
      for (let i = 0; i < this.typeList.length; i++) {
        if (Number(val) == this.typeList[i].id) {
          return this.typeList[i].typeName;
        }
      }
    },
    ...mapMutations({
      setMenuList: "menuBar/setMenuList",
    }),
    editItem(row) {
      this.$refs.edit.setData(row);
      this.dialog.isVisible = true;
      this.dialog.title = "修改参数";
    },

    // 搜索重置
    resetSearch() {
      this.queryParams = {
        baseName: null,
      };
      this.search();
    },
    // 删除
    deleteItem(row) {
      this.$delete(`/api/base-info`, {
        id: row.id,
      })
        .then(() => {
          this.$message({
            message: "参数删除成功",
            type: "success",
          });
        })
        .then(() => {
          this.fetch();
        });
    },
    add() {
      this.dialog.isVisible = true;
      this.dialog.title = "添加参数";
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
      this.$get("/api/base-info", {
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
      this.systemManagerShow = false;
      this.menuList[1].flag = false;
      this.setMenuList(this.menuList);
    },

    // 参数类型
    addType() {
      this.$refs.type.openType();
      this.typeTitle = "添加参数";
    },
  },
};
</script>

<style lang="scss" scoped>
</style>