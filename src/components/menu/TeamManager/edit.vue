<template>
  <!-- eslint-disable-->
  <el-dialog
    :title="title"
    width="500px"
    top="50px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="isVisible"
    append-to-body
  >
    <el-form
      ref="form"
      :model="data"
      :rules="rules"
      label-position="right"
      label-width="100px"
      style="line-height: 100%"
    >
      <!-- 名称 -->
      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="名称">
              <el-input
                placeholder="请输入名称"
                v-model="formData.name"
              ></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <!-- 作战单元 -->
      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="作战单元">
              <div class="wrapper">
                <div
                  class="content_wrapper"
                  v-for="(item, index) in shipList"
                  :key="index"
                >
                  <div class="content">
                    <span
                      class="content_desc item"
                      :style="{
                        color: item.checked ? '#FF0000' : 'rgba(80, 80, 80, 1)',
                      }"
                      >{{ item.warshipName }}</span
                    >
                    <span
                      class="content_type item"
                      :style="{
                        color: item.checked
                          ? '#FF0000'
                          : 'rgba(138, 138, 138, 1)',
                      }"
                      >{{ item.warshipType }}</span
                    >
                  </div>
                  <div class="check">
                    <el-checkbox v-model="item.checked"></el-checkbox>
                  </div>
                </div>
              </div>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <div class="save_wrapper">
      <button class="save" type="button" @click="submit()">保存</button>
    </div>
  </el-dialog>
</template>
<script>
import { toBase64 } from "@/utils/toBase64.js";
export default {
  data() {
    return {
      data: {},
      rules: {},
      formData: {
        name: "",
      },
      // 舰船列表
      shipList: [],
    };
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
  },
  methods: {
    // 获取舰船列表
    loadShipList(row = {}) {
      this.$get(`/api/warship`,{
        pageSize: 100000,
        pageNum: 1
      }).then((res) => {
        if (res.data.data) {
          this.shipList = res.data.data.rows.map((e, i) => {
            return { ...e, checked: false };
          });
          if (this.title === "修改编队") {
            this.formData = {
              ...this.formData,
              ...row,
            };
            let activeShipList = row.ships.split(",");
            this.shipList = this.shipList.map((e, i) => {
              let obj = e;
              if (activeShipList.includes(String(e.id))) {
                obj.checked = true;
              }
              return obj;
            });
          }
        }
      });
    },
    // 关闭对话框
    close() {
      this.$emit("close");
    },
    // 重置
    reset() {
      this.formData = {
        name: "",
      };
      this.shipList = [];
    },
    // 添加或修改
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let shipNameList = [];
          this.shipList.forEach((e, i) => {
            e.checked ? shipNameList.push(e.id) : "";
          });
          const ships = shipNameList.join(",");
          if (this.title === "添加编队") {
            this.$post("/api/formation", {
              ships: ships,
              name: this.formData.name,
            })
              .then(() => {
                this.$message({
                  message: "编队添加成功",
                  type: "success",
                });
                this.reset();
              })
              .then(() => {
                this.$emit("close");
              })
              .catch(() => {
                this.$message({
                  message: "编队添加失败",
                  type: "error",
                });
              });
          }
          if (this.title === "修改编队") {
            this.formData.ships = ships
            this.$put("/api/formation", {
              ...this.formData,
            })
              .then(() => {
                this.$message({
                  message: "编队修改成功",
                  type: "success",
                });
              })
              .then(() => {
                this.$emit("close");
                this.reset();
              })
              .catch(() => {
                this.$message({
                  message: "编队修改失败",
                  type: "error",
                });
              });
          }
        }
      });
    },
  },
  computed: {
    isVisible: {
      get() {
        return this.dialogVisible;
      },
      set() {
        this.close();
        this.reset();
      },
    },
  },
};
</script>
<style lang='scss'>
.el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: red;
  border-color: red;
}
.el-dialog {
  border: 8px;
}
.el-dialog__title {
  font-size: 16px;
}
.el-dialog__body {
  padding: 10px;
}
.el-input__inner {
  border: none;
  border: 2px;
  background: rgba(245, 245, 245, 1);
  height: 32px;
}
.el-form-item__label {
  color: rgba(112, 114, 116, 1);
  font-size: 14px;
}
/deep/input:disabled::-webkit-input-placeholder {
  color: #c0b2c0;
  -webkit-text-fill-color: #c0b2c0;
}
.unit_class {
  height: 32px;
  line-height: 40px;
  margin-left: 10px;
  font-size: 14px;
}
.el-upload-dragger {
  width: 260px;
}
.wrapper::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 2px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
.wrapper::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgba(245, 245, 245, 1);
  background: #535353;
}
.wrapper::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 5pxrgba (245, 245, 245, 1);
  border-radius: 10px;
  background: #ededed;
}
.wrapper {
  background: rgba(245, 245, 245, 1);
  width: 265px;
  height: 400px;
  overflow-y: auto;
  .content_wrapper {
    background: rgba(245, 245, 245, 1);
    width: 260px;
    height: 55px;
    display: flex;
    border-radius: 5px;
    .content {
      width: 92%;
      height: 60px;
      display: flex;
      flex-flow: column;
      white-space: nowrap;

      .item {
        flex: 1;
        padding-left: 5px;
      }
      .content_desc {
        font-family: Microsoft YaHei;
        font-size: 14px;
        color: rgba(80, 80, 80, 1);
        height: 25px;
        font-size: 700;
      }
      .content_type {
        font-family: Microsoft YaHei;
        font-size: 12px;
        font-weight: 400;
        color: rgba(138, 138, 138, 1);
        height: 20px;
        line-height: 30px;
        border-bottom: 1px solid rgba(212, 212, 212, 1);
      }
    }
    .active {
      color: red;
    }
    .check {
      width: 8%;
    }
  }
}

.save_wrapper {
  margin-left: 162px;
  margin-bottom: 15px;
  .save {
    cursor: pointer;
    width: 150px;
    height: 30px;
    background: rgba(152, 26, 0, 1);
    border: none;
    border-radius: 2px;
    color: #ffffff;
    font-family: Microsoft YaHei;
    font-size: 16px;
    letter-spacing: 10px;
  }
  .save:active {
    border: none;
  }
}
</style>