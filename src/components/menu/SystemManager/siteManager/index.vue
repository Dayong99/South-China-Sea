<template>
  <div
    id="ship_manager"
    class="ship_manager"
    ref="siteBox"
    v-drag
    v-show="systemManagerShow"
    
  >
    <div class="manager_title">
      <span>常用地点</span>
      <img
        src="@/assets/images/legendbar/close.png"
        @click.stop="closeManager"
      />
    </div>
    <div class="manager_operation">
      <el-button icon="el-icon-plus" class="operation_add" @click="add"
        >添加</el-button
      >
    </div>
    <div class="manager_table">
      <el-table :data="tableData" border style="width: 100%" max-height="400px">
        <!-- <el-table-column label="序号" width="70px" align="center">
          <template slot-scope="scope">
            {{ (pagination.num - 1) * pagination.size + scope.$index + 1 }}
          </template>
        </el-table-column> -->
        <el-table-column
          label="地点名称"
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
            <span>{{ Number(scope.row.isShow) == 0 ? "不显示" : "显示" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="经度" align="center" min-width="100px">
          <template slot-scope="scope">
            <span>{{ scope.row.longitude }}</span>
          </template>
        </el-table-column>
        <el-table-column label="纬度" align="center" min-width="100px">
          <template slot-scope="scope">
            <span>{{ scope.row.latitude }}</span>
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
        placeName: null,
      },

      markerGroup: [],
      placeImg: require("../../../../assets/images/place.svg"),
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
        this.queryParams = {
          placeName: null,
        };
        this.fetch();
        this.$refs.siteBox.style.left = "50%";
        this.$refs.siteBox.style.top = "42%";
        this.$refs.siteBox.style.transform = "translate(-50%, -50%)";
      }
    },
    tableData: {
      handler(val) {
        this.getAllPlace(val);
      },
      deep: true,
    },
  },
  methods: {
    ...mapMutations({
      setMenuList: "menuBar/setMenuList",
    }),
    getAllPlace(val) {
      this.clearAllPlace()
      let markerArr = [];
      val.forEach((item, index) => {
        if (Number(item.isShow) == 1) {
          let icon = new L.Icon({
            iconUrl: this.placeImg,
            iconSize: [26, 26],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
          });
          let marker = L.marker([item.latitude, item.longitude], {
            icon: icon,
          });
          markerArr.push(marker);
          marker
            .bindPopup(item.placeName)
            .openPopup();
        }
      });
      this.markerGroup = L.layerGroup(markerArr);
      map.addLayer(this.markerGroup);
    },
    clearAllPlace() {
      map.removeLayer(this.markerGroup);
    },
    editItem(row) {
      this.$refs.edit.setData(row);
      this.dialog.isVisible = true;
      this.dialog.title = "修改地点";
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
      this.$confirm("确认删除该地点吗")
        .then(() => {
          this.$delete(`/api/common-place`, {
            id: row.id,
          })
            .then(() => {
              this.$message({
                message: "地点删除成功",
                type: "success",
              });
            })
            .then(() => {
              this.fetch();
            });
        })
        .catch(() => {
          this.$message({
            message: "取消删除",
            type: "information",
          });
        })
    },
    add() {
      this.dialog.isVisible = true;
      this.dialog.title = "添加地点";
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
            if (item.drawType === 0) {
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
  },
};
</script>

<style lang="scss" scoped>
</style>