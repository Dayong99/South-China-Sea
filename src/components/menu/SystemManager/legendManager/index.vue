<template>
  <div
    id="ship_manager"
    class="ship_manager"
    v-show="systemManagerShow"
    style="width: 960px; height: auto"
    v-drag
    ref="legendBox"
  >
    <div class="manager_title">
      <span>色斑图配置</span>
      <img
        src="@/assets/images/legendbar/close.png"
        @click.stop="closeManager"
      />
    </div>
    <div class="manager_operation">
      <el-input
        placeholder="请输入关键词"
        prefix-icon="el-icon-search"
        v-model="queryParams.legendName"
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
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column label="序号" width="70px" align="center">
          <template slot-scope="scope">
            {{ (pagination.num - 1) * pagination.size + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          label="类型名称"
          align="center"
          width="200px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.legendName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="起始值" align="center" width="100px">
          <template slot-scope="scope">
            <span>{{ scope.row.svalue }}</span>
          </template>
        </el-table-column>
        <el-table-column label="终止值" align="center" width="100px">
          <template slot-scope="scope">
            <span>{{ scope.row.evalue }}</span>
          </template>
        </el-table-column>
        <el-table-column label="步长" align="center" width="100px">
          <template slot-scope="scope">
            <span>{{ scope.row.step }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="起始颜色"
          prop="role-name"
          align="center"
          width="210px"
        >
          <template slot-scope="scope">
            <el-row :gutter="10" class="colorRange">
              <el-col :span="4">
                <div
                  class="colorItem"
                  :style="{ background: scope.row.scolor }"
                ></div>
              </el-col>
              <el-col :span="20">
                <div>{{ scope.row.scolor }}</div>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column
          label="终止颜色"
          prop="role-name"
          align="center"
          width="210px"
        >
          <template slot-scope="scope">
            <el-row :gutter="10" class="colorRange">
              <el-col :span="4">
                <div
                  class="colorItem"
                  :style="{ background: scope.row.ecolor }"
                ></div>
              </el-col>
              <el-col :span="20">
                <div>{{ scope.row.ecolor }}</div>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column
          label="图例预览"
          align="center"
          class-name="small-padding fixed-width"
          width="300px"
        >
          <template slot-scope="scope">
            <div class="color_main">
              <ul class="colorBox">
                <el-tooltip
                  effect="dark"
                  placement="top-start"
                  v-for="(item, index) in getColorList(
                    scope.row.colorValues.split(',')
                  )"
                  :key="index"
                  style="outline-width: 0"
                >
                  <div slot="content">
                    {{ scope.row.legendValues.split(",")[index] }}
                  </div>
                  <li>
                    <div class="color_item" :style="{ background: item }"></div>
                    <div class="color_text">
                      {{ scope.row.legendValues.split(",")[index] }}
                    </div>
                  </li>
                </el-tooltip>
              </ul>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="120px"
          header-align="center"
          align="center"
          fixed="right"
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
        legendName: null,
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
        if (newval[0].flag) {
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
          legendName: null,
        };
        this.fetch();
        this.$refs.legendBox.style.left = "50%";
        this.$refs.legendBox.style.top = "42%";
        this.$refs.legendBox.style.transform = "translate(-50%, -50%)";
      }
    },
  },
  methods: {
    ...mapMutations({
      setMenuList: "menuBar/setMenuList",
    }),
    // 获取rgba值
    getRgba(color) {
      let rgbaArr = [];
      for (let i = 1; i < 9; i += 2) {
        rgbaArr.push(parseInt("0x" + color.slice(i, i + 2)));
      }
      let str =
        "rgba(" +
        parseInt(rgbaArr[0]) +
        "," +
        parseInt(rgbaArr[1]) +
        "," +
        parseInt(rgbaArr[2]) +
        "," +
        (parseInt(rgbaArr[3]) / 255).toFixed(2) +
        ")";
      return str;
    },
    // 获取rgba颜色列表
    getColorList(list) {
      let arr = []
      list.forEach((item,index)=>{
        arr.push(this.getRgba(item))
      })
      return arr
    },
    editItem(row) {
      this.$refs.edit.setData(row);
      this.dialog.isVisible = true;
      this.dialog.title = "修改图例";
    },
    // 搜索重置
    resetSearch() {
      this.queryParams = {
        legendName: null,
      };
      this.search();
    },
    // 删除
    deleteItem(row) {
      console.log(row, `row`);
      this.$confirm("确认删除该图例吗")
        .then(() => {
          this.$delete(`/api/legend-config`, {
            id: row.id,
          })
            .then(() => {
              this.$message({
                message: "图例删除成功",
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
        });
    },
    add() {
      this.dialog.isVisible = true;
      this.dialog.title = "添加图例";
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
      this.$get("/api/legend-config", {
        ...params,
      }).then((res) => {
        if (res.data.data) {
          console.log(res.data.data, `res.data.data`);
          this.total = res.data.data.total;
          this.tableData = res.data.data.rows;
          console.log(this.tableData);
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
      // this.menuList[3].flag = false;
      this.setMenuList(this.menuList);
    },
  },
};
</script>

<style lang="scss" scoped></style>
