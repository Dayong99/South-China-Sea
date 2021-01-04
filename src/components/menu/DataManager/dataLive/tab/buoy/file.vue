<template>
  <!-- eslint-disable-->
  <el-dialog
    title="导入资料"
    width="500px"
    top="200px"
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
            <el-form-item label="目标路径" prop="filePath">
              <el-input
                placeholder="请输入目标路径"
                v-model="formData.filePath"
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
export default {
  data() {


    return {
      data: {},
      rules: {},
      formData: {
        filePath:''
      },
      rules: {
        filePath: {
          required: true,
          message: "目标路径不能为空",
          trigger: "blur",
        }
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
        filePath:''
      };
    },
    // 添加或修改
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
            this.$get("/api/ocean-buoys-live/analysisOceanBuoysLive", {
              filePath:encodeURIComponent(this.formData.filePath)
            })
              .then(() => {
                this.$message({
                  message: "目标路径导入成功",
                  type: "success",
                });
                this.reset();
              })
              .then(() => {
                this.$emit("close");
              })
              .catch(() => {
                this.$message({
                  message: "目标路径导入失败",
                  type: "error",
                });
              });
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

</style>