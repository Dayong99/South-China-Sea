<template>
  <div>
    <div
      id="ship_manager"
      class="ship_manager"
      ref="markerBox"
      v-drag
      v-show="systemManagerShow"
      style="width: auto; height: auto"
    >
      <div class="manager_title">
        <span>常用警戒线和任务区</span>
        <img
          src="@/assets/images/legendbar/close.png"
          @click.stop="closeManager"
        />
      </div>
      <div class="manager_operation">
        <el-button icon="el-icon-plus" class="operation_add" @click="draw"
          >添加</el-button
        >
      </div>
      <div class="manager_table">
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          max-height="400px"
        >
          <!-- <el-table-column label="序号" width="70px" align="center">
          <template slot-scope="scope">
            {{ (pagination.num - 1) * pagination.size + scope.$index + 1 }}
          </template>
        </el-table-column> -->
          <el-table-column
            label="名称"
            align="center"
            min-width="100px"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.placeName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="是否显示" align="center" min-width="100px">
            <template slot-scope="scope">
              <span>{{
                Number(scope.row.isShow) == 0 ? "不显示" : "显示"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="类型" align="center" min-width="100px">
            <template slot-scope="scope">
              <span>{{ scope.row.drawType | drawType }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="坐标"
            align="center"
            min-width="100px"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.coordinates }}</span>
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
      <!-- <div class="manager_page">
      <pagination
        :total="total"
        :page.sync="pagination.num"
        :limit.sync="pagination.size"
        @pagination="search"
        style="padding-bottom: 0"
      />
    </div> -->

      <edit
        ref="edit"
        :dialog-visible="dialog.isVisible"
        :title="dialog.title"
        @close="closeDialogPage"
      />
    </div>

    <!-- 绘图工具 -->
    <mark-box
      :markShow="markShow"
      @closeDraw="closeDraw"
      @updateTab="updateTab"
    ></mark-box>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { mapState, mapMutations } from "vuex";
import edit from "./edit.vue";
import MarkBox from "./markBox";
export default {
  components: {
    edit,
    Pagination,
    MarkBox: MarkBox,
  },
  data() {
    return {
      markShow: false,

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
        placeName: null,
      },
      geojsonGroup: [],
    };
  },
  filters: {
    drawType(type) {
      switch (Number(type)) {
        case 0:
          return "点";
        case 1:
          return "线";
        case 2:
          return "面";
      }
    },
  },
  mounted() {
    this.fetch();
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
        if (newval[4].flag) {
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
          placeName: null,
        };
        this.fetch();
        this.$refs.markerBox.style.left = "50%";
        this.$refs.markerBox.style.top = "42%";
        this.$refs.markerBox.style.transform = "translate(-50%, -50%)";
      } else {
        this.markShow = false;
      }
    },
    tableData: {
      handler(val) {
        this.getShapes(val);
      },
      deep: true,
    },
  },
  methods: {
    ...mapMutations({
      setMenuList: "menuBar/setMenuList",
    }),
    getShapes(val) {
      this.clearGeojson();
      this.geojsonGroup = [];
      val.forEach((item, index) => {
        if (Number(item.isShow) == 1) {
          let geojson = JSON.parse(item.coordinates);
          let style = JSON.parse(item.other1);
          let layer;
          if (geojson.type == "Point") {
            layer = new L.Circle([geojson.coordinates[1],geojson.coordinates[0]], Number(item.other2), style).addTo(map);
            console.log(layer);
          } else {
            layer = L.geoJSON(geojson, {
              style: style,
            }).addTo(map);
          }

          layer
            .bindPopup(item.placeName, {
              autoPan: false,
              autoClose: false,
              className: "leaflet-marker-markerTip",
              keepInView: false,
            })
            .openPopup();
          this.geojsonGroup.push(layer);
        }
      });
    },
    clearGeojson() {
      this.geojsonGroup.forEach((item) => {
        if (map.hasLayer(item)) {
          item.removeFrom(map);
        }
      });
    },
    editItem(row) {
      this.$refs.edit.setData(row);
      this.dialog.isVisible = true;
      this.dialog.title = "修改标志区";
      this.markShow = false;
    },

    // 搜索重置
    resetSearch() {
      this.queryParams = {
        placeName: null,
      };
      this.search();
    },
    // 删除
    deleteItem(row) {
      this.$delete(`/api/common-place`, {
        id: row.id,
      })
        .then(() => {
          this.$message({
            message: "标志区删除成功",
            type: "success",
          });
        })
        .then(() => {
          this.fetch();
        });
    },
    add() {
      this.dialog.isVisible = true;
      this.dialog.title = "添加标志区";
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
      this.$get("/api/common-place/list").then((res) => {
        console.log(res, "res");
        this.tableData = [];
        if (res.data.data) {
          // this.total = res.data.data.total;
          res.data.data.forEach((item) => {
            if (item.drawType !== 0) {
              this.tableData.push(item);
            }
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

    // 绘图
    draw() {
      this.markShow = true;
    },
    closeDraw() {
      this.markShow = false;
    },
    updateTab() {
      this.fetch();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>