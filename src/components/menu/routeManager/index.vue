<template>
  <div id="ship_manager" class="ship_manager" v-show="assessManagerShow">
    <div class="manager_title">
      <span>评估结果</span>
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
          label="评估类型"
          prop="role-name"
          align="center"
          min-width="100px"
        >
          <template slot-scope="scope">
            <!--<span>{{ scope.row.warshipType }}</span> -->
            <span>暂无</span>
          </template>
        </el-table-column>
        <el-table-column
          label="评估时间"
          prop="role-name"
          align="center"
          min-width="100px"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.assesstime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="配置参数"
          prop="role-name"
          align="center"
          min-width="100px"
        >
          <template slot-scope="scope">
            <img
              src="@/assets/images/menu/assessView.png"
              @click="detailAssessMentInfo(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="评估结果"
          prop="role-name"
          align="center"
          min-width="100px"
        >
          <template slot-scope="scope">
            <img
              src="@/assets/images/menu/assessView.png"
              @click="detailAssessMentInfo(scope.row)"
            />
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
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { mapState, mapMutations } from "vuex";
export default {
  components: {
    Pagination,
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
      assessManagerShow: false,
      managerValue: "",
      tableData: [],
      // 分页
      pagination: {
        size: 5,
        num: 1,
      },
      queryParams: {
        warshipName: null,
      },
    };
  },
  mounted() {
    this.fetch();
  },
  computed: {
    ...mapState({
      routeAlgorithmInfo: (state) => state.menuBar.routeAlgorithmInfo,
    }),
  },
  watch: {
    // 监听menuList，控制详细面板的显隐
    routeAlgorithmInfo: {
      handler(val) {
        if (val[0]) {
          this.assessManagerShow = true;
          this.assessMentInfo = val[1];
        } else {
          this.assessManagerShow = false;
          this.assessMentInfo = val[1];
        }
      },
      deep: true,
    },
  },
  methods: {
    ...mapMutations({
      setRouteAlgorithmInfo: "menuBar/setRouteAlgorithmInfo",
    }),
    detailAssessMentInfo(row) {
      console.log(row, `detailAssessMentInfo`);
    },
    // 搜索重置
    resetSearch() {
      this.queryParams = {
        warshipName: null,
      };
      this.search();
    },
    add() {
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

      this.$get("/api/assessment").then((res) => {
        if (res.data.data) {
          console.log(res.data.data, `assessment`);
          // this.total = res.data.data.total;
          this.tableData = res.data.data;
          // console.log(this.tableData);
        }
      });
    },
    closeManager() {
      this.assessManagerShow = false;
      this.setRouteAlgorithmInfo([0, {}]);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>