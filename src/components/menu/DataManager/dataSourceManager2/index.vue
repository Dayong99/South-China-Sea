<template>
  <div
    id="ship_manager"
    class="ship_manager"
    v-show="systemManagerShow"
    style="width: 960px;height:auto;"
    v-drag
    ref="source2Box"
  >
    <div class="manager_title">
      <span>数据源配置—数值预报数据</span>
      <img
        src="@/assets/images/legendbar/close.png"
        @click.stop="closeManager"
      />
    </div>
    <div class="manager_operation">
      <el-input
        placeholder="数据源名称"
        prefix-icon="el-icon-search"
        v-model="queryParams.numericalName"
        class="operation_input"
        clearable
        @clear="search"
        style="width: 260px"
      >
      </el-input>
      <el-date-picker
        v-model="time"
        format="yyyy-MM-dd HH:mm:ss"
        value-format="yyyy-MM-dd HH:mm:ss"
        type="datetimerange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="search"
      >
      </el-date-picker>

      <el-button class="operation_search" @click="search">搜索</el-button>
      <el-button class="operation_clear" @click="resetSearch">重置</el-button>
     
    </div>
    <div class="manager_operation" style="margin-top:0;">
      
      <el-button
        icon="el-icon-download"
        class="operation_add"
        @click="exportFile"
        >导入海浪</el-button
      >
      <el-button
        icon="el-icon-download"
        class="operation_add"
        @click="exportSeawater"
        >导入海流</el-button
      >
      <el-button
        icon="el-icon-download"
        class="operation_add"
        @click="exportTemp"
        >导入水温</el-button
      >
      <el-button
        icon="el-icon-download"
        class="operation_add"
        @click="exportNecp"
        >导入gfs</el-button
      >
      <el-button
        icon="el-icon-download"
        class="operation_add"
        @click="exportZC"
        >导入总参</el-button
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
          label="数据源名称"
          align="center"
          min-width="260px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.numericalName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="起报时间" align="center" min-width="160px">
          <template slot-scope="scope">
            <span>{{ scope.row.startTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="预报日期" align="center" min-width="100px">
          <template slot-scope="scope">
            <span>{{ scope.row.startDay }}</span>
          </template>
        </el-table-column>
        <el-table-column label="预报时间" align="center" min-width="100px">
          <template slot-scope="scope">
            <span>{{ scope.row.startHours }}</span>
          </template>
        </el-table-column>
        <el-table-column label="时效" align="center" min-width="100px">
          <template slot-scope="scope">
            <span>{{ scope.row.fcst }}</span>
          </template>
        </el-table-column>
        <el-table-column label="修改时间" align="center" min-width="160px">
          <template slot-scope="scope">
            <span>{{ scope.row.modifyTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="修改次数" align="center" min-width="100px">
          <template slot-scope="scope">
            <span>{{ scope.row.modifyTimes }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否可用" align="center" min-width="100px">
          <template slot-scope="scope">
            <span>{{ scope.row.isAvailable == 1 ? "是" : "否" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="补充" align="center" min-width="100px">
          <template slot-scope="scope">
            <span>{{ scope.row.isSupplement }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="数据来源"
          align="center"
          min-width="100px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.dataSource }}</span>
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

    <file
      ref="file"
      :dialog-visible="dialog.isVisible"
      @close="closeDialogPage"
    />

    <sea ref="sea" :dialog-visible="seaVisible" @close="closeDialogPage" />
    <temp ref="temp" :dialog-visible="tempVisible" @close="closeDialogPage" />
    <necp ref="necp" :dialog-visible="necpVisible" @close="closeDialogPage" />
        <zc ref="zc" :dialog-visible="zcVisible" @close="closeDialogPage" />

  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { mapState, mapMutations } from "vuex";
import file from "./file.vue";
import sea from "./seawater.vue";
import temp from "./temperature.vue";
import necp from "./necp.vue";
import zc from "./zc.vue";

export default {
  components: {
    file,
    sea,
    temp,
    necp,
    zc,
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
      seaVisible: false,
      tempVisible: false,
      necpVisible: false,
      zcVisible:false,
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
      time: [],
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
        this.queryParams = {};
        this.time = [];
        this.fetch();
        this.$refs.source2Box.style.left = "50%";
        this.$refs.source2Box.style.top = "42%";
        this.$refs.source2Box.style.transform = "translate(-50%, -50%)";
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
      this.time = [];
      this.search();
    },
    exportFile() {
      this.dialog.isVisible = true;
      this.dialog.title = "添加数据源";
    },
    exportSeawater() {
      this.seaVisible = true;
    },
    exportTemp() {
      this.tempVisible = true;
    },
    exportNecp() {
      this.necpVisible = true;
    },
     exportZC() {
      this.zcVisible = true;
    },
    // 搜索
    search() {
      if (this.time) {
        this.queryParams.STime = this.time[0];
        this.queryParams.ETime = this.time[1];
      } else {
        this.queryParams.STime = "";
        this.queryParams.ETime = "";
      }
      if (this.queryParams.STime) {
         this.fetch({
        ...this.queryParams,
      });
      } else {
        if (this.queryParams.numericalName) {
          this.fetch({
            numericalName: this.queryParams.numericalName,
          });
        } else {
          this.fetch();
        }
      }
    },
    // 获取表格数据
    fetch(params = {}) {
      params.pageSize = this.pagination.size;
      params.pageNum = this.pagination.num;
      this.$get("/api/numerical-forecast", {
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
      this.seaVisible = false;
      this.tempVisible = false;
      this.necpVisible = false;
            this.zcVisible = false;

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