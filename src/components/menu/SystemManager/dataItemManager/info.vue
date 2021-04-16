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
      label-position="right"
      label-width="100px"
      class="info-form"
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
            <el-form-item label="值范围：" prop="valueRange">
              <div>
                {{ formData.valueRange }}
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
              <span>{{ legendName(formData.legendId) }}</span>
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
                {{ getType(formData.type) }}
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
        valueRange: "",
      };
    },
    legendName(val) {
      let name;
      for (let i = 0; i < this.legendList.length; i++) {
        if (val == this.legendList[i].id) {
          name = this.legendList[i].legendName;
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
    getType(type) {
      console.log(type)
      let source
      switch (type) {
        case 0:
          source=  "ECMWF";
        case 1:
          source=  "GFS";
        case 2:
          source=  "总参";
      }
      console.log(source)
      return source
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
</style>
