<template>
  <!-- eslint-disable-->
  <el-dialog
    :title="title"
    width="500px"
    top="100px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="isVisible"
    append-to-body
  >
    <el-form
      ref="form"
      :model="formData"
      :rules="rules"
      label-position="right"
      label-width="100px"
      style="line-height: 100%"
    >
      <!-- 名称 -->
      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="区域名称" prop="name">
              <el-input
                placeholder="请输入区域名称"
                v-model="formData.name"
              ></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <!-- 经纬度 -->
      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="最小经度" prop="minLon">
              <el-input
                placeholder="请输入最小经度"
                v-model="formData.minLon"
              ></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="最小纬度" prop="minLat">
              <el-input
                placeholder="请输入最小纬度"
                v-model="formData.minLat"
              ></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="最大经度" prop="maxLon">
              <el-input
                placeholder="请输入最大经度"
                v-model="formData.maxLon"
              ></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="最大纬度" prop="maxLat">
              <el-input
                placeholder="请输入最大纬度"
                v-model="formData.maxLat"
              ></el-input>
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
const longreg = /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,6})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/;
const latreg = /^(\-|\+)?([0-8]?\d{1}\.\d{0,6}|90\.0{0,6}|[0-8]?\d{1}|90)$/;
export default {
  data() {
    var checkLon = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("经度不能为空"));
      } else if (!longreg.test(value)) {
        callback(new Error("经度整数部分为0-180,小数部分为0到6位!"));
      } else if (
        this.formData.minLon &&
        this.formData.maxLon &&
        this.formData.maxLon <= this.formData.maxLon
      ) {
        callback(new Error("最大经度需大于最小经度"));
      } else {
        return callback();
      }
    };

    var checkLat = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("纬度不能为空"));
      } else if (!latreg.test(value)) {
        callback(new Error("纬度整数部分为0-90,小数部分为0到6位"));
      } else if (
        this.formData.minLat &&
        this.formData.maxLat &&
        this.formData.maxLat <= this.formData.minLat
      ) {
        console.log(this.formData.maxLat);
        console.log(this.formData.minLat);

        callback(new Error("最大纬度需大于最小纬度"));
      } else {
        return callback();
      }
    };

    return {
      data: {},
      formData: {
        name: "",
        minLon: "",
        minLat: "",
        maxLon: "",
        maxLat: "",
      },
      rules: {
        name: {
          required: true,
          message: "区域名称不能为空",
          trigger: "blur",
        },
        minLon: { validator: checkLon, trigger: "blur" },
        minLat: { validator: checkLat, trigger: "blur" },
        maxLon: { validator: checkLon, trigger: "blur" },
        maxLat: { validator: checkLat, trigger: "blur" },
      },
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
    setData(data) {
      this.formData = {
        ...data,
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
        name: "",
        minLon: "",
        minLat: "",
        maxLon: "",
        maxLat: "",
      };
    },
    // 添加或修改
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (
            this.formData.minLon >= this.formData.maxLon ||
            this.formData.minLat >= this.formData.maxLat
          ) {
            this.$message.warning("请输入正确的经纬度值");
          } else if (this.title === "添加区域") {
            this.$post("/api/region-division", this.formData)
              .then(() => {
                this.$message({
                  message: "区域添加成功",
                  type: "success",
                });
                this.reset();
              })
              .then(() => {
                this.$emit("close");
              })
              .catch(() => {
                this.$message({
                  message: "区域添加失败",
                  type: "error",
                });
              });
          } else if (this.title === "修改区域") {
            this.$put("/api/region-division", {
              ...this.formData,
            })
              .then(() => {
                this.$message({
                  message: "区域修改成功",
                  type: "success",
                });
              })
              .then(() => {
                this.$emit("close");
                this.reset();
              })
              .catch(() => {
                this.$message({
                  message: "区域修改失败",
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
<style lang="scss">
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
