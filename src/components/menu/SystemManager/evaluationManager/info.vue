<template>
  <!-- eslint-disable-->
  <el-dialog
    :title="title"
    width="700px"
    top="50px"
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
            <el-form-item label="海区名称:" prop="name">
              <div>
                {{formData.name}}
              </div>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="是否显示:" prop="isShow">
              <div>
                {{Number(formData.isShow)==1?"显示":"不显示"}}
              </div>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="geojson:" prop="dataGeo">
              <div>
                {{formData.dataGeo}}
              </div>
           
            </el-form-item>
          </div>
        </el-col>
      </el-row>
    </el-form>
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
        isShow:"",
        dataGeo: "",
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
        isShow:"",
        dataGeo: "",
      };
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