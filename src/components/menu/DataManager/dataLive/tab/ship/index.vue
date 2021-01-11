<template>
  <div v-show="tabShow" style="width:900px;">
    
    <div class="manager_operation">
      <el-input
        placeholder="呼号"
        prefix-icon="el-icon-search"
        v-model="queryParams.callSign"
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
        class="operation_input"
        @change="search"
      >
      </el-date-picker>
      <el-button class="operation_search" @click="search">搜索</el-button>
      <el-button class="operation_clear" @click="resetSearch">重置</el-button>
      <el-button icon="el-icon-download" class="operation_add" @click="add"
        >导入资料</el-button
      >
    </div>
    <div class="manager_table">
      <el-table :data="tableData" border style="width: 100%"  max-height="400px">
        <el-table-column label="序号" width="70px" align="center">
          <template slot-scope="scope">
            {{ (pagination.num - 1) * pagination.size + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          label="呼号"
          align="center"
          min-width="100px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.callSign }}</span>
          </template>
        </el-table-column>
        <el-table-column label="风速单位" align="center" min-width="160px">
          <template slot-scope="scope">
            <span>{{ scope.row.dataUnit }}</span>
          </template>
        </el-table-column>
        <el-table-column label="经度" align="center" min-width="100px">
          <template slot-scope="scope">
            <span>{{ scope.row.lon }}</span>
          </template>
        </el-table-column>
        <el-table-column label="纬度" align="center" min-width="100px">
          <template slot-scope="scope">
            <span>{{ scope.row.lat }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="风向(°)"
          align="center"
          min-width="100px"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.windDirection }}</span>
          </template>
        </el-table-column>
       
        <el-table-column
          label="风速(m/s)"
          align="center"
          min-width="100px"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.windSpeed }}</span>
          </template>
        </el-table-column>
        
        <el-table-column
          label="温度(℃)"
          align="center"
          min-width="100px"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.temperature }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="日期"
          align="center"
          min-width="160px"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.dayTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="航向" align="center" min-width="100px">
          <template slot-scope="scope">
            <span>{{ scope.row.course }}</span>
          </template>
        </el-table-column>
        <el-table-column label="航速" align="center" min-width="160px">
          <template slot-scope="scope">
            <span>{{ scope.row.speed }}</span>
          </template>
        </el-table-column>
        <el-table-column label="航洋资料类型" align="center" min-width="100px">
          <template slot-scope="scope">
            <span>{{ scope.row.typeFlag }}</span>
          </template>
        </el-table-column>
        <el-table-column label="值一" align="center" min-width="100px">
          <template slot-scope="scope">
            <span>{{ scope.row.value1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="值二" align="center" min-width="100px">
          <template slot-scope="scope">
            <span>{{ scope.row.value2 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="浮标类型"
          align="center"
          min-width="100px"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.buoyName }}</span>
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
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { mapState, mapMutations } from "vuex";
import file from "./file.vue";
export default {
  props: ["tabShow"],
  components: {
    file,
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
        if (newval[0].flag) {
          this.systemManagerShow = true;
        } else {
          this.systemManagerShow = false;
        }
      },
      deep: true,
    },
    tabShow(val) {
      if (val) {
        this.queryParams = {};
        this.time = [];
        this.fetch();
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
    add() {
      this.dialog.isVisible = true;
      this.dialog.title = "添加数据源";
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
        if (this.queryParams.callSign) {
          this.fetch({
            callSign: this.queryParams.callSign,
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
      this.$get("/api/ship-live/page", {
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
  },
};
</script>

<style lang="scss" scoped>
</style>