<template>
  <div
    id="ship_manager"
    class="ship_manager"
    v-show="systemManagerShow"
    v-drag
    ref="seaBox"
  >
    <div class="manager_title">
      <span>海区划分</span>
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
        <el-table-column label="海区名称" align="center" min-width="100px">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否显示" align="center" min-width="100px">
          <template slot-scope="scope">
            <span>{{ Number(scope.row.isShow) == 0 ? "不显示" : "显示" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="geojson" align="center" min-width="100px">
          <template slot-scope="scope">
            <span
              style="
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              "
              >{{ scope.row.dataGeo }}</span
            >
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

    <info
      ref="info"
      :dialog-visible="infoVisible"
      title="海区详情"
      @close="closeInfo"
    />
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { mapState, mapMutations } from "vuex";
import edit from "./edit.vue";
import info from "./info.vue";

export default {
  components: {
    edit,
    info,
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

      infoVisible: false,
      geojsonGroup: [],
      geoStyle: {
        color: "#685ac6",
        weight: 1,
        opacity: 0.9,
      },
    };
  },
  mounted() {
    this.fetch()
  },
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
        if (newval[5].flag) {
          this.systemManagerShow = true;
        } else {
          this.systemManagerShow = false;
        }
      },
      deep: true,
    },
    systemManagerShow(val) {
      if (val) {
        this.fetch();
        this.$refs.seaBox.style.left = "50%";
        this.$refs.seaBox.style.top = "42%";
        this.$refs.seaBox.style.transform = "translate(-50%, -50%)";
      }
    },
    tableData: {
      handler(val){
        this.getSeaArea(val)
      },
      deep:true
    },
  },
  methods: {
    ...mapMutations({
      setMenuList: "menuBar/setMenuList",
    }),
    clearGeojson() {
      this.geojsonGroup.forEach((item) => {
        if (map.hasLayer(item)) {
          item.removeFrom(map);
        }
      });
    },
    getSeaArea(val){
      this.clearGeojson();
      this.geojsonGroup = [];
      val.forEach((item, index) => {
        if (item.isShow) {
          let geojson = JSON.parse(item.dataGeo);
          // let data = [];
          // geojson.forEach((item) => {
          //   let obj = {};
          //   for (let i in item) {
          //     obj[i] = item[i];
          //   }
          //   data.push(obj);
          // });

          let layer = L.geoJSON(geojson, {
            style: this.geoStyle,
          }).addTo(map);

          this.geojsonGroup.push(layer);
        }
      });
    },
    editItem(row) {
      this.$refs.edit.setData(row);
      this.dialog.isVisible = true;
      this.dialog.title = "修改海区";
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
      this.$delete(`/api/sea-division`, {
        id: row.id,
      })
        .then(() => {
          this.$message({
            message: "海区删除成功",
            type: "success",
          });
        })
        .then(() => {
          this.fetch();
        });
    },
    add() {
      this.dialog.isVisible = true;
      this.dialog.title = "添加海区";
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
      this.$get("/api/sea-division", {
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