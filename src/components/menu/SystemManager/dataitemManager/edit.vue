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
      :rules="rules"
      label-position="right"
      label-width="100px"
      style="line-height: 100%; height: 600px"
    >
      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="数据项名称" prop="parameterName">
              <el-input
                placeholder="请输入数据项名称"
                v-model="formData.parameterName"
              ></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <!-- 经纬度 -->
      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="维数" prop="dimensionNum">
              <el-select
                v-model="formData.dimensionNum"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="(item, index) in numOption"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="维度参数" prop="dimensionParameter">
              <el-input
                placeholder="例：isobaric3"
                v-model="formData.dimensionParameter"
              ></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="维度单词" prop="dimensionWord">
              <el-input
                placeholder="例：time,isobaric3"
                v-model="formData.dimensionWord"
              ></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="网格大小" prop="gridSize">
              <el-input
                placeholder="例：0.5"
                v-model="formData.gridSize"
              ></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="海洋数据" prop="isWave">
              <el-select
                v-model="formData.isWave"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="(item, index) in waveOption"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="评估参数" prop="isWave">
              <el-select
                v-model="formData.isEvaluate"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="(item, index) in waveOption"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="关键词" prop="keyword">
              <el-input placeholder="" v-model="formData.keyword"></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="纬度范围" prop="latRange">
              <el-input
                placeholder="例：0,90"
                v-model="formData.latRange"
              ></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="经度范围" prop="lonRange">
              <el-input
                placeholder="例：0,180"
                v-model="formData.lonRange"
              ></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="标识" prop="parameterMark">
              <el-input v-model="formData.parameterMark"></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="高度选择" prop="parameterStep">
              <el-input v-model="formData.parameterStep"></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="顺序" prop="nindex">
              <el-input v-model="formData.nindex"></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="文件类型" prop="sourceType">
              <el-input v-model="formData.sourceType"></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="图例" prop="legendId">
              <el-select
                v-model="formData.legendId"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="(item, index) in legendOption"
                  :key="index"
                  :label="item.legendName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="绘图类型" prop="drawType">
              <el-select
                v-model="formData.drawType"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="(item, index) in drawOption"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="数据源" prop="type">
              <el-select v-model="formData.type" placeholder="请选择" clearable>
                <el-option
                  v-for="(item, index) in sourceOption"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="单位" prop="units">
              <el-input v-model="formData.units"></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="色斑图" prop="dataGroup">
              <el-select
                v-model="formData.dataGroup"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="(item, index) in waveOption"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="备注" prop="remark">
              <el-input
                type="textarea"
                :rows="2"
                v-model="formData.remark"
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
      } else {
        return callback();
      }
    };

    var checkLat = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("纬度不能为空"));
      } else if (!latreg.test(value)) {
        callback(new Error("纬度整数部分为0-90,小数部分为0到6位"));
      } else {
        return callback();
      }
    };

    return {
      data: {},
      rules: {},
      formData: this.initForm(),
      rules: {
        name: {
          required: true,
          message: "数据项名称不能为空",
          trigger: "blur",
        },
        minLon: { validator: checkLon, trigger: "blur" },
        minLat: { validator: checkLat, trigger: "blur" },
        maxLon: { validator: checkLon, trigger: "blur" },
        maxLat: { validator: checkLat, trigger: "blur" },
      },
      waveOption: [
        {
          label: "是",
          value: 1,
        },
        {
          label: "否",
          value: 0,
        },
      ],
      legendOption: [],
      numOption: [
        {
          value: 3,
          label: "3",
        },
        {
          value: 4,
          label: "4",
        },
      ],
      sourceOption: [
        {
          value: 0,
          label: "ECMWF",
        },
        {
          value: 1,
          label: "GFS",
        },
      ],
      drawOption: [
        {
          label: "点",
          value: "point",
        },
        {
          label: "线",
          value: "line",
        },
        {
          label: "图层",
          value: "layer",
        },
      ],
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
        this.getLegend();
      }
    },
  },
  mounted() {},
  methods: {
    initForm() {
      return {
        dataGroup: null,
        dimensionNum: null,
        dimensionParameter: "",
        dimensionWord: "",
        drawType: "",
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
      };
    },
    getLegend() {
      this.$get("/api/legend-config/all").then((res) => {
        this.legendOption = res.data.data;
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
      this.$refs.form.clearValidate();
      this.$refs.form.resetFields();
      this.formData = this.initForm();
    },
    // 添加或修改
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.formData.legendId === "") {
            this.source.legendId = 0;
          }
          if (this.title === "添加数据项") {
            this.$post("/api/parameters", this.formData)
              .then(() => {
                this.$message({
                  message: "数据项添加成功",
                  type: "success",
                });
                this.reset();
              })
              .then(() => {
                this.$emit("close");
              })
              .catch(() => {
                this.$message({
                  message: "数据项添加失败",
                  type: "error",
                });
              });
          } else if (this.title === "修改数据项") {
            this.$put("/api/parameters", {
              ...this.formData,
            })
              .then(() => {
                this.$message({
                  message: "数据项修改成功",
                  type: "success",
                });
              })
              .then(() => {
                this.$emit("close");
                this.reset();
              })
              .catch(() => {
                this.$message({
                  message: "数据项修改失败",
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
.el-form {
  .el-select {
    width: 260px;
  }
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