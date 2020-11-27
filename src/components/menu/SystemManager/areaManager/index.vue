<template>
  <div id="ship_manager" class="ship_manager" v-show="systemManagerShow">
    <div class="manager_title">
      <span>常用区域</span>
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
        <el-table-column
          label="区域名称"
          align="center"
          min-width="100px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="最小经度" align="center" min-width="100px">
          <template slot-scope="scope">
            <span>{{ scope.row.minLon }}</span>
          </template>
        </el-table-column>
        <el-table-column label="最小纬度" align="center" min-width="100px">
          <template slot-scope="scope">
            <span>{{ scope.row.minLat }}</span>
          </template>
        </el-table-column>
        <el-table-column label="最大经度" align="center" min-width="100px">
          <template slot-scope="scope">
            <span>{{ scope.row.maxLon }}</span>
          </template>
        </el-table-column>
        <el-table-column label="最大纬度" align="center" min-width="100px">
          <template slot-scope="scope">
            <span>{{ scope.row.maxLat }}</span>
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
        name: null,
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
        if (newval[2].flag) {
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
          name: null,
        };
        this.fetch();
      }
    },
  },
  methods: {
    ...mapMutations({
      setMenuList: "menuBar/setMenuList",
    }),
    editItem(row) {
      this.$refs.edit.setData(row);
      this.dialog.isVisible = true;
      this.dialog.title = "修改区域";
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
      this.$delete(`/api/region-division`, {
        id: row.id,
      })
        .then(() => {
          this.$message({
            message: "区域删除成功",
            type: "success",
          });
        })
        .then(() => {
          this.fetch();
        });
    },
    add() {
      this.dialog.isVisible = true;
      this.dialog.title = "添加区域";
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
      this.$get("/api/region-division", {
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
  },
};
</script>

<style lang="scss" scoped>
</style>