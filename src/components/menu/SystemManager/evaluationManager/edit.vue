<template>
  <!-- eslint-disable-->
  <el-dialog
    :title="title"
    width="650px"
    top="100px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="isVisible"
    append-to-body
  >
    <el-form
      ref="form"
      :model="formData"
      label-position="right"
      label-width="100px"
      style="line-height: 100%"
      :rules="rules"
    >
      <!-- 名称 -->
      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="因子名称" prop="name">
              <el-input
                placeholder="请输入条件因子名称"
                v-model="formData.remark"
              ></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <!-- 气象要素选择 -->
      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="气象要素" prop="parametersId">
              <el-select
                v-model="formData.parametersId"
                placeholder="请选择"
                clearable
                style="width: 260px"
              >
                <el-option
                  v-for="(item, index) in weatherOptionsList"
                  :key="index"
                  :label="item.parameterName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <!-- 分级表达式选择 -->
      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="表达式选择" prop="parametersId">
              <el-select
                v-model="formData.expression"
                placeholder="请选择"
                clearable
                style="width: 260px"
              >
                <el-option
                  v-for="(item, index) in ['<', '>', '>=', '<=']"
                  :key="index"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <!-- 分级填值 -->
      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="分级填值" prop="parametersId">
              <el-row>
                <ul class="item-wrapper">
                  <li class="item" v-for="(item, index) in formData.parameter">
                    <ul class="item-items-wrapper">
                      <li class="item-items">
                        {{ ["很好", "好", "中", "差", "很差"][index] }}
                      </li>
                      <li class="item-items" v-if="index === 4"></li>
                      <li class="item-items" v-else>{{ formData.expression }}</li>
                      <li class="item-items">
                        <div v-if="index === 4" style="width: 30px;"></div>
                        <input
                          v-else
                          style="width: 30px; outline: none"
                          type="text"
                          v-model="formData.parameter[index]"
                        />
                      </li>
                    </ul>
                  </li>
                </ul>
                <ul class="item-wrapper">
                  <li
                    class="item"
                    v-for="(item, index) in formData.coefficient"
                  >
                    <ul class="item-items-wrapper">
                      <li class="item-items"></li>
                      <li class="item-items"></li>
                      <li class="item-items">
                        <div v-if="index === 4" style="width: 30px"></div>
                        <input
                          v-else
                          style="width: 30px; outline: none"
                          type="text"
                          v-model="formData.coefficient[index]"
                        />
                      </li>
                    </ul>
                  </li>
                </ul>
              </el-row>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <div style="margin-left: 230px" class="save_wrapper">
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
      formData: {
        remark: "",
        parametersId: null,
        expression: "<",
        parameter: [1, 2, 3, 4],
        coefficient: [0.8, 0.6, 0.4, 0.2],
      },
      weatherOptionsList: [],
      rules: {},
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
  watch: {
    dialogVisible(val) {
      if (val) {
        this.loadWeatherFactor();
      }
    },
  },
  methods: {
    setData(data) {
      console.log(data, `setData`);
      this.formData = {
        remark: data.remark,
        parametersId: data.parametersId,
        expression: data.expression,
        parameter: data.parameter.split(","),
        coefficient: data.coefficient.split(","),
        id: data.id,
      };
    },
    // 关闭对话框
    close() {
      this.$emit("close");
    },
    // 重置
    reset() {
      this.$refs.form.clearValidate();
      this.$refs.form.resetFields();
      this.formData = {
        remark: "",
        parametersId: null,
        expression: ">",
        parameter: [1, 2, 3, 4],
        coefficient: [0.8, 0.6, 0.4, 0.2],
      };
      this.weatherOptionsList = [];
    },
    // 添加或修改
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.title === "添加评估条件因子") {
            this.$post("/api/condition", {
              expression: this.formData.expression,
              remark: this.formData.remark,
              parametersId: this.formData.parametersId,
              coefficient: this.formData.coefficient.join(","),
              parameter: this.formData.parameter.join(","),
            })
              .then(() => {
                this.$message({
                  message: "评估条件因子添加成功",
                  type: "success",
                });
                this.reset();
              })
              .then(() => {
                this.close();
              })
              .catch(() => {
                this.$message({
                  message: "评估条件因子添加失败",
                  type: "error",
                });
              });
          } else if (this.title === "修改评估条件因子") {
            this.$put("/api/condition", {
              expression: this.formData.expression,
              remark: this.formData.remark,
              parametersId: this.formData.parametersId,
              coefficient: this.formData.coefficient.join(","),
              parameter: this.formData.parameter.join(","),
              id: this.formData.id,
            })
              .then(() => {
                this.$message({
                  message: "评估条件因子修改成功",
                  type: "success",
                });
              })
              .then(() => {
                this.$emit("close");
                this.reset();
              })
              .catch(() => {
                this.$message({
                  message: "评估条件因子修改失败",
                  type: "error",
                });
              });
          }
        }
      });
    },
    loadWeatherFactor() {
      this.$get(`api/parameters`, {
        isEvaluate: 1,
      })
        .then((res) => {
          if (res.status === 200) {
            this.weatherOptionsList = res.data.data;
          }
        })
        .catch(() => {
          this.$message({
            message: "气象要素列表载入失败",
            type: "error",
          });
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
::v-deep input:disabled::-webkit-input-placeholder {
  color: #c0b2c0;
  -webkit-text-fill-color: #c0b2c0;
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
  margin-left: 230px;
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

.item-wrapper {
  width: 500px;
  height: 35px;
  display: flex;
  background: #f5f5f5;
  .item {
    flex: 1;
    .item-items-wrapper {
      display: flex;
      .item-items {
        flex: 1;
      }
    }
  }
}
</style>
