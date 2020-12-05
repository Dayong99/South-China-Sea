<template>
  <div
    id="ship_manager"
    class="ship_manager"
    v-show="systemManagerShow"
    ref="dataitemBox"
    style="width: 900px; height: auto"
    v-drag
  >
    <div class="manager_title">
      <span>数据项配置</span>
      <img
        src="@/assets/images/legendbar/close.png"
        @click.stop="closeManager"
      />
    </div>
    <div class="manager_operation">
      <el-input
        placeholder="请输入关键词"
        prefix-icon="el-icon-search"
        v-model="queryParams.parameterName"
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
          label="名称"
          align="center"
          min-width="150px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.parameterName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="维数" align="center" min-width="100px">
          <template slot-scope="scope">
            <span>{{ scope.row.dimensionNum }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="维度参数"
          align="center"
          min-width="200px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.dimensionParameter }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="维度单词"
          align="center"
          min-width="120px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.dimensionWord }}</span>
          </template>
        </el-table-column>
        <el-table-column label="网络大小" align="center" min-width="100px">
          <template slot-scope="scope">
            <span>{{ scope.row.gridSize }}</span>
          </template>
        </el-table-column>
        <el-table-column label="海洋数据" align="center" min-width="100px">
          <template slot-scope="scope">
            <span>{{ scope.row.isWave == 1 ? "是" : "否" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="关键词"
          align="center"
          min-width="200px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.keyword }}</span>
          </template>
        </el-table-column>
        <el-table-column label="图标" align="center" width="50px">
          <template slot-scope="scope">
            <!-- <span>{{ scope.row.iconImage }}</span> -->
            <div :class="scope.row.iconImage == null ? null : 'imgdiv'">
              <img class="itemImg" :src="scope.row.iconImage" />
            </div>
          </template>
        </el-table-column>

        <el-table-column label="上传图标" align="center" min-width="100px">
          <template slot-scope="scope">
            <el-upload
              ref="upload"
              :show-file-list="false"
              :action="uploadFile()"
              :auto-upload="true"
              :on-success="
                function (res, file) {
                  return ModifySuccess(res, file);
                }
              "
              :on-error="
                function (res, file) {
                  return ModifyFail(res, file);
                }
              "
              :file-list="fileList"
            >
              <el-button
                size="mini"
                type="primary"
                @click="changeColumn(scope.row)"
                >上传</el-button
              >
            </el-upload>
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          width="140px"
          header-align="center"
          align="center"
          fixed="right"
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
      title="数据项详情"
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
        parameterName: null,
      },
      infoVisible: false,
      modifyItem: {},
      fileList: [],
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
        if (newval[7].flag) {
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
          parameterName: null,
        };
        this.fetch();
        this.$refs.dataitemBox.style.left = "50%";
        this.$refs.dataitemBox.style.top = "42%";
        this.$refs.dataitemBox.style.transform = "translate(-50%, -50%)";
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
      this.dialog.title = "修改数据项";
    },

    // 搜索重置
    resetSearch() {
      this.queryParams = {
        parameterName: null,
      };
      this.search();
    },
    // 删除
    deleteItem(row) {
      this.$confirm("确认删除该数据项吗")
        .then(() => {
          this.$delete(`/api/parameters`, {
            id: row.id,
          })
            .then(() => {
              this.$message({
                message: "数据项删除成功",
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
      this.dialog.title = "添加数据项";
    },
    information(row) {
      this.infoVisible = true;
      this.$refs.info.setData(row);
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
      this.$get("/api/parameters/page", {
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

    // 上传图标
    // 上传路径
    uploadFile() {
      return (
        // process.env.VUE_APP_BASE_API +
        globalConfig.baseURL + "/api/parameters/imageTobase"
      );
    },
    // 上传失败
    ModifyFail() {
      this.$message({
        message: "图片上传失败",
        type: "error",
      });
    },
    // 上传图片成功
    ModifySuccess(res, file) {
      this.$message({
        message: "图片上传成功",
        type: "success",
      });
      this.modifyItem.iconImage = res;

      this.$put("/api/parameters", { ...this.modifyItem })
        .then(() => {
          this.search();
          this.$refs.upload.clearFiles();
        })
        .catch((err) => {
          this.$message({
            message: "图片更新失败",
            type: "error",
          });
        });
    },
    changeColumn(row) {
      // this.$refs.upload.clearFiles()
      this.modifyItem = row;
    },
  },
};
</script>

<style lang="scss" scoped>
.imgdiv {
  width: 30px;
  height: 30px;
  line-height: 30px;
  background: #f99c00;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;

  img[src=""],
  img:not([src]) {
    opacity: 0;
  }

  .itemImg {
    width: 20px;
    height: 20px;
  }
}
</style>