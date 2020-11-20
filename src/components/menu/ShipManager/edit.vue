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
                v-model="formData.warshipName"
              ></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <!-- 类型 -->
      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="类型">
              <el-input
                v-model="formData.warshipType"
                placeholder="请选择"
              ></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <!-- 编号 -->
      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="编号">
              <el-input
                placeholder="请输入编号"
                v-model="formData.number"
              ></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <!-- 吨位 -->
      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="吨位">
              <el-input
                placeholder="请输入吨位"
                v-model="formData.tonnage"
              ></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="unit_class">t</div>
        </el-col>
      </el-row>
      <!-- 航速 -->
      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="航速">
              <el-input
                v-model="formData.speed"
                placeholder="请输入航速"
              ></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="unit_class">m/s</div>
        </el-col>
      </el-row>
      <!-- 抗风能力 -->
      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="抗风能力">
              <el-input
                v-model="formData.windResistant"
                placeholder="请输入抗风能力"
              ></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="unit_class">m/s</div>
        </el-col>
      </el-row>
      <!-- 图片 -->
      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="图片">
              <el-upload
                class="upload-demo"
                drag
                :on-change="getFile"
                :auto-upload="false"
                list-type="picture"
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">点击或将文件拖拽到这里上传</div>
                <div
                  style="
                    font-size: 12px;
                    height: 18px;
                    line-height: 18px;
                    color: rgba(0, 0, 0, 0.43);
                  "
                >
                  支持扩展名:.jpg .png .pdf
                </div>
              </el-upload>
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
import { toBase64 } from '@/utils/toBase64.js'
export default {
  data() {
    return {
      data: {},
      rules: {},
      formData: {
        warshipName: "",
        warshipType: "",
        number: "",
        tonnage: "",
        speed: "",
        shipPhoto: "",
        windResistant: ''
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
    // 上传文件变化
    getFile(file, fileList) {
      console.log(file.raw);
      toBase64(file.raw).then((res) => {
        console.log(res);
        this.formData.shipPhoto = res
      });
    },
    // 关闭对话框
    close() {
      this.$emit("close");
    },
    // 重置
    reset() {
      // 先清除校验，再清除表单
      console.log("重置表单");
    },
    // 添加或修改
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log("校验通过");
          console.log(this.formData);
          this.$post("/api/warship", {
            ...this.formData,
          })
            .then(() => {
              this.$message({
                message: "舰船添加成功",
                type: "success",
              });
            }).then(() => {
              this.$emit('close')
            })
            .catch(() => {
              this.$message({
                message: "舰船添加失败",
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
.unit_class {
  height: 32px;
  line-height: 40px;
  margin-left: 10px;
  font-size: 14px;
}
.el-upload-dragger {
  width: 260px;
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