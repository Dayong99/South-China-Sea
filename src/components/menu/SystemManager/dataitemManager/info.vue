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
      :model="formData"
      label-position="right"
      label-width="100px"
      style="line-height: 100%"
    >
      <!-- 名称 -->
      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="数据项名称：" prop="parameterName">
              <div>
                {{ formData.parameterName }}
              </div>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <!-- 经纬度 -->
      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="维数：" prop="dimensionNum">
              <div>
                {{ formData.dimensionNum }}
              </div>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="维度参数：" prop="dimensionParameter">
              <div>
                {{ formData.dimensionParameter }}
              </div>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="维度单词：" prop="dimensionWord">
              <div>
                {{ formData.dimensionWord }}
              </div>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="网格大小：" prop="gridSize">
              <div>
                {{ formData.gridSize }}
              </div>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="海洋数据：" prop="isWave">
              <div>
                {{ formData.isWave == 1 ? "是" : "否" }}
              </div>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="评估参数：" prop="isWave">
              <div>
                {{ formData.isEvaluate == 1 ? "是" : "否" }}
              </div>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="关键词：" prop="keyword">
              <div>
                {{ formData.keyword }}
              </div>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="纬度范围：" prop="latRange">
              <div>
                {{ formData.latRange }}
              </div>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="经度范围：" prop="lonRange">
              <div>
                {{ formData.lonRange }}
              </div>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="标识：" prop="parameterMark">
              <div>
                {{ formData.parameterMark }}
              </div>
            </el-form-item>
          </div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="高度选择：" prop="parameterStep">
              <div>
                {{ formData.parameterStep }}
              </div>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="顺序：" prop="nindex">
              <div>
                {{ formData.nindex }}
              </div>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="文件类型：" prop="sourceType">
              <div>
                {{ formData.sourceType }}
              </div>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="图例：" prop="legendId">
              <span>{{legendName(formData.legendId)}}</span>
            </el-form-item>
          </div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="绘图类型：" prop="drawType">
              <div>{{ drawType(formData.drawType) }}</div>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="数据源：" prop="type">
              <div>
                {{ formData.type == 0 ? "ECMWF" : "GFS" }}
              </div>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="单位：" prop="units">
              <div>
                {{ formData.units }}
              </div>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="色斑图：" prop="dataGroup">
              <div>
                <span>{{ isDataGroup(formData.dataGroup) }}</span>
              </div>
            </el-form-item>
          </div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="备注：" prop="remark">
              <div>
                {{ formData.remark }}
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
      formData: this.initForm(),
      legendList: [],
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
  computed: {},
  watch: {
    dialogVisible(val) {
      if (val) {
        this.getLegend();
      } else {
        this.reset();
      }
    },
  },
  mounted() {
    this.getLegend();
  },
  methods: {
    initForm() {
      return {
        dataGroup: null,
        dimensionNum: null,
        dimensionParameter: "",
        dimensionWord: "",
        gridSize: null,
        iconImage: "",
        isWave: null,
        keyword: "",
        latRange: "",
        legendId: "",
        lonRange: "",
        nindex: null,
        parameterMark: "",
        parameterName: "",
        parameterStep: "",
        remark: "",
        sourceType: "",
        type: null,
        units: "",
        drawType: "",
        isEvaluate: "",
      };
    },
    legendName(val) {
      let name
      for (let i = 0; i < this.legendList.length; i++) {
          if (val == this.legendList[i].id) {
            name =  this.legendList[i].legendName;
          }
        }
      return name;
    },
    drawType(type) {
      switch (type) {
        case "point":
          return "点";
        case "line":
          return "线";
        case "layer":
          return "图层";
      }
    },
    // 是否是色斑图分组
    isDataGroup(val) {
        if (val == null) {
          return "";
        } else if (val == 0) {
          return "否";
        } else if (val == 1) {
          return "是";
        }
    },
    getLegend() {
      this.$get("/api/legend-config/all").then((res) => {
        this.legendList = res.data.data;
      });
    },
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
      this.colorValues = [];
      this.legendValues = [];
      this.$refs.form.clearValidate();
      this.$refs.form.resetFields();
      this.formData = this.initForm();
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