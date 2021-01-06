<template>
  <div
    id="ship_manager"
    class="ship_manager"
    v-show="systemManagerShow"
    style="width: 900px;height:auto;"
    v-drag
    ref="typhoonBox"
  >
    <div class="manager_title">
      <span>台风数据</span>
      <img
        src="@/assets/images/legendbar/close.png"
        @click.stop="closeManager"
      />
    </div>
    <div class="manager_operation">
      <!-- <el-input
        placeholder="任务名称"
        prefix-icon="el-icon-search"
        v-model="queryParams.name"
        class="operation_input"
        clearable
        @clear="search"
        style="width: 260px"
      >
      </el-input> -->
      <el-date-picker
        v-model="queryParams.year"
        type="year"
        value-format="yyyy"
        placeholder="选择年"
        @change="changeDate"
      >
      </el-date-picker>
      <el-button class="operation_search" @click="search">搜索</el-button>
      <el-button class="operation_clear" @click="resetSearch">重置</el-button>
      <el-button icon="el-icon-download" class="operation_add" @click="openFile"
        >导入实时台风</el-button
      >
      <el-button
        icon="el-icon-download"
        class="operation_add"
        @click="openHistory"
        >导入历史台风</el-button
      >
    </div>
    <div class="manager_table">
      <el-table :data="tableData" border style="width: 100%;">
        <el-table-column label="序号" width="70px" align="center">
          <template slot-scope="scope">
            {{ (pagination.num - 1) * pagination.size + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          label="台风名称"
          align="center"
          min-width="100px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.cycloneName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="台风类型" align="center" min-width="160px">
          <template slot-scope="scope">
            <span>{{ scope.row.cycloneType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="国际编号" align="center" min-width="100px">
          <template slot-scope="scope">
            <span>{{ scope.row.international }}</span>
          </template>
        </el-table-column>
        <el-table-column label="国内编号" align="center" min-width="100px">
          <template slot-scope="scope">
            <span>{{ scope.row.domestic }}</span>
          </template>
        </el-table-column>
        <el-table-column label="生成时间" align="center" min-width="160px">
          <template slot-scope="scope">
            <span>{{ scope.row.createtime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="生成时的经度坐标"
          align="center"
          min-width="100px"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.lon }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="生成时的纬度坐标"
          align="center"
          min-width="100px"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.lat }}</span>
          </template>
        </el-table-column>
        <el-table-column label="心气压 HPA" align="center" min-width="100px">
          <template slot-scope="scope">
            <span>{{ scope.row.centerPressure }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="中心最大风速 m/s"
          align="center"
          min-width="100px"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.centerMaxSppe }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="风圈半径"
          align="center"
          min-width="100px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.windCircle }}</span>
          </template>
        </el-table-column>
        <el-table-column label="移动方向" align="center" min-width="100px">
          <template slot-scope="scope">
            <span>{{ scope.row.moveDirection }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="manager_page">
      <pagination
        :total="total"
        :page.sync="pagination.num"
        :limit.sync="pagination.size"
        @pagination="search"
        style="padding-bottom: 0"
      />
    </div>

    <file
      ref="file"
      :dialog-visible="dialog.isVisible"
      @close="closeDialogPage"
    />

    <history
      ref="history"
      :dialog-visible="historyVisible"
      @close="closeDialogPage"
    />
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { mapState, mapMutations } from "vuex";
import file from "./file.vue";
import history from "./history.vue";

export default {
  components: {
    file,
    history,
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
      historyVisible: false,
      // 详细面板显示隐藏
      systemManagerShow: false,
      managerValue: "",
      tableData: [],
      // 分页
      pagination: {
        size: 5,
        num: 1,
      },
      queryParams: {},
    };
  },
  mounted() {},
  computed: {
    ...mapState({
      menuList: (state) => state.menuBar.menuList,
      dataList: (state) => state.menuBar.dataList,
    }),
  },
  watch: {
    // 监听menuList，控制详细面板的显隐
    menuList: {
      handler(newval, oldval) {
        let i = newval.findIndex((item) => {
          return item.flag == true;
        });
        if (i !== 4) {
          this.systemManagerShow = false;
        }
      },
      deep: true,
    },
    dataList: {
      handler(newval, oldval) {
        if (newval[3].flag) {
          this.systemManagerShow = true;
        } else {
          this.systemManagerShow = false;
        }
      },
      deep: true,
    },
    systemManagerShow(val) {
      if (val) {
        this.queryParams = {};
        this.fetch();
        this.$refs.typhoonBox.style.left = "50%";
        this.$refs.typhoonBox.style.top = "42%";
        this.$refs.typhoonBox.style.transform = "translate(-50%, -50%)";
      }
    },
  },
  methods: {
    ...mapMutations({
      setMenuList: "menuBar/setMenuList",
    }),

    // 搜索重置
    resetSearch() {
      this.queryParams = {};
      this.search();
    },
    openFile() {
      this.dialog.isVisible = true;
    },
    openHistory() {
      this.historyVisible = true;
    },
    changeDate() {
      if (!this.queryParams.year) {
        this.search();
      }
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
      this.$get("/api/typhoon", {
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
      this.historyVisible = false;

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

<style lang="scss" scoped></style>
