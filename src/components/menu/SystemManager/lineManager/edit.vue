<template>
  <!-- eslint-disable-->
  <el-dialog
    :title="title"
    width="900px"
    top="100px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="isVisible"
    append-to-body
  >
    <el-form
      ref="form"
      :model="color"
      :rules="rules"
      label-position="right"
      label-width="80px"
    >
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="线名称" prop="contourName">
            <el-input v-model="color.contourName" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="线风格" prop="lineStyle">
            <el-select
              v-model="color.lineStyle"
              placeholder="请选择"
              clearable
              style="width:auto;"
            >
              <el-option
                v-for="(item, index) in lineOption"
                :key="index"
                :label="item.label"
                :value="item.value"
              >
                <span>{{ item.label }}</span>
                <img :src="getSrc(item.value)" class="option_img" />
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="线粗细" prop="lineThickness">
            <el-input v-model="color.lineThickness" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="起始值" prop="svalue">
            <el-input v-model="color.svalue" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="终止值" prop="evalue">
            <el-input v-model="color.evalue" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="步长" prop="step">
            <el-input v-model="color.step" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8" class="color_show">
          <el-form-item
            label="起始颜色"
            prop="scolor"
            style="position: relative"
          >
            <el-input v-model="color.scolor" clearable />
            <el-color-picker
              class="color_value"
              v-model="color.scolor"
              :show-alpha="alpha"
              @change="resetInsert"
            ></el-color-picker>
          </el-form-item>
          <div
            class="preview_color"
            :style="{ background: color.scolor }"
          ></div>
        </el-col>
        <el-col :span="8" class="color_show">
          <el-form-item
            label="终止颜色"
            prop="ecolor"
            style="position: relative"
          >
            <el-input v-model="color.ecolor" clearable />
            <el-color-picker
              class="color_value"
              v-model="color.ecolor"
              :show-alpha="alpha"
              @change="resetInsert"
            ></el-color-picker>
          </el-form-item>
          <div
            class="preview_color"
            :style="{ background: color.ecolor }"
          ></div>
        </el-col>
      </el-row>
    </el-form>

    <div class="btnBox">
      <el-button type="primary" @click="createColor">生 成</el-button>
      <el-button type="primary" plain @click="cancleColor">重 置</el-button>
    </div>

    <div v-show="colorShow">
      <div class="insertBox">
        <el-row :gutter="20">
          <el-col :span="22">
            <div class="color_main" style="width: 650px">
              <ul class="colorBox">
                <li
                  @click="getSelected(index)"
                  v-for="(item, index) in gradientColorArr"
                  :key="index"
                >
                  <div
                    class="color_item"
                    :style="{ background: item }"
                    :class="{ border_active: isActive[index] }"
                  ></div>
                  <div
                    class="color_text"
                    style="left: 0"
                    @click="updateVal(index)"
                    :title="'颜色值:' + color.legendValues[index]"
                  >
                    {{ color.legendValues[index] }}
                  </div>

                  <el-color-picker
                    class="color_picker"
                    v-model="gradientColorArr[index]"
                    @change="changeColor"
                    title="更改颜色"
                    :show-alpha="alpha"
                  ></el-color-picker>
                </li>
              </ul>
            </div>
          </el-col>
          <el-col :span="2">
            <i class="el-icon-remove-outline reduce" @click="reduceColor"></i>
          </el-col>
        </el-row>
      </div>
      <el-form
        label-position="right"
        ref="insertForm"
        label-width="100px"
        :model="insertObj"
        :rules="insertRules"
      >
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="插入值" prop="value">
              <el-input v-model="insertObj.value" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8" class="color_show">
            <el-form-item
              label="插入颜色"
              prop="color"
              style="position: relative"
            >
              <el-input v-model="insertObj.color" clearable />
              <el-color-picker
                class="color_value"
                v-model="insertObj.color"
                :show-alpha="alpha"
              ></el-color-picker>
            </el-form-item>
            <div
              class="preview_color"
              :style="{ background: insertObj.color }"
            ></div>
          </el-col>
          <el-col :span="4">
            <i class="el-icon-circle-plus-outline add" @click="insertColor"></i>
          </el-col>
        </el-row>
      </el-form>
      <div class="btnBox">
        <el-button type="primary" @click="submitForm">保 存</el-button>
        <el-button type="primary" plain @click="closeDialog">取 消</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { toBase64 } from "@/utils/toBase64.js";
export default {
  data() {
    var regPos = /(^[\-0-9][0-9]*(.[0-9]+)?)$/;
    var checkSvalue = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("起始值不能为空"));
      } else if (!regPos.test(value)) {
        callback(new Error("请输入数字值"));
      } else {
        callback();
      }
    };
    var checkEvalue = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("终止值不能为空"));
      } else if (!regPos.test(value)) {
        callback(new Error("请输入数字值"));
      } else if (Number(value) <= Number(this.color.svalue)) {
        callback(new Error("终止值不能小于等于起始值"));
      } else {
        callback();
      }
    };
    var checkStep = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("步长不能为空"));
      } else if (!regPos.test(value)) {
        callback(new Error("请输入数字值"));
      }
      if (value <= 0) {
        return callback(new Error("步长需大于0"));
      }
      // else if (Number(this.color.evalue) < Number(value)) {
      //   callback(new Error("步长不得大于终止值"));
      // }
      else {
        callback();
      }
    };
    var checkInsert = (rule, value, callback) => {
      if (!regPos.test(value)) {
        callback(new Error("请输入数字值"));
      } else {
        callback();
      }
    };
    return {
      alpha: true,
      lineOption: [
        {
          label: "实线",
          value: "实线",
        },
        {
          label: "虚线",
          value: "虚线",
        },
      ],
      solidImg: require("../../../../assets/images/menu/solid.png"),
      dashImg: require("../../../../assets/images/menu/dashed.png"),
      colorShow: false,
      data: {},
      isActive: [],
      colorIndex: null,
      color: this.initColor(),
      insertObj: this.initInsert(),
      rules: {
        contourName: {
          required: true,
          message: "线名称不能为空",
          trigger: "blur",
        },
        svalue: {
          validator: checkSvalue,
          trigger: "blur",
        },
        evalue: {
          validator: checkEvalue,
          trigger: "blur",
        },
        step: {
          validator: checkStep,
          trigger: "blur",
        },
        scolor: [
          { required: true, message: "起始颜色不能为空", trigger: "blur" },
          // {
          //   pattern: /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i,
          //   message: "请输入正确的颜色值",
          // },
        ],
        ecolor: [
          { required: true, message: "终止颜色不能为空", trigger: "blur" },
          // {
          //   pattern: /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i,
          //   message: "请输入正确的颜色值",
          // },
        ],
        lineThickness: {
          validator: checkInsert,
          trigger: "blur",
        },
        lineStyle: {
          required: true,
          trigger: "change",
          message: "请选择线风格",
        },
      },
      insertRules: {
        value: {
          validator: checkInsert,
          trigger: "blur",
        },
        color: {
          // trigger: "blur",
          // pattern: /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i,
          // message: "请输入正确的颜色值",
        },
      },
      gradientColorArr: [],
      nowColor: {},
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
    dialogVisible(newval, oldval) {
      if (newval) {
        if (this.color.colorValues.length !== 0) {
          this.isActive = [];
          this.color.colorValues.forEach((item, index) => {
            this.isActive.push(false);
          });
        }
      }
    },
  },
  methods: {
    getSrc(type) {
      switch (type) {
        case "实线":
          return this.solidImg;
        case "虚线":
          return this.dashImg;
      }
    },
    // 编辑图例
    setData(data) {
      this.color = { ...data };
      this.colorShow = true;
      this.color.colorValues = this.color.colorValues.split(",");
      this.gradientColorArr = [];
      this.color.colorValues.forEach((item, index) => {
        this.gradientColorArr.push(this.getRgba(item));
      });
      this.color.legendValues = this.color.legendValues
        .split(",")
        .map((item) => Number(item));
    },
    // 重置初始颜色和结束颜色
    resetColor(arr) {
      this.color.scolor = arr[0];
      this.color.ecolor = arr[arr.length - 1];
    },

    // 获取颜色的16进制值
    getHex(color) {
      let values = color
        .replace(/rgba?\(/, "")
        .replace(/\)/, "")
        .replace(/[\s+]/g, "")
        .split(",");
      let a = Math.floor(values[3] * 256),
        r = values[0],
        g = values[1],
        b = values[2];

      let alpha = a.toString(16);
      if (alpha == 100) {
        return this.rgbToHex(r, g, b) + "FF";
      } else {
        return this.rgbToHex(r, g, b) + ("0" + alpha).slice(-2);
      }
    },
    // hex转化为rgba
    getRgba(color) {
      let rgbaArr = [];
      for (let i = 1; i < 9; i += 2) {
        rgbaArr.push(parseInt("0x" + color.slice(i, i + 2)));
      }

      let str =
        "rgba(" +
        parseInt(rgbaArr[0]) +
        "," +
        parseInt(rgbaArr[1]) +
        "," +
        parseInt(rgbaArr[2]) +
        "," +
        (parseInt(rgbaArr[3]) / 255).toFixed(2) +
        ")";
      return str;
    },

    // rgb to hex
    rgbToHex(r, g, b) {
      let hex = ((r << 16) | (g << 8) | b).toString(16);
      return "#" + new Array(Math.abs(hex.length - 7)).join("0") + hex;
    },

    // 计算渐变过渡色
    gradient(startColor, endColor, step) {
      let sColor = startColor
        .replace(/rgba?\(/, "")
        .replace(/\)/, "")
        .replace(/[\s+]/g, "")
        .split(",");
      let eColor = endColor
        .replace(/rgba?\(/, "")
        .replace(/\)/, "")
        .replace(/[\s+]/g, "")
        .split(",");

      // 计算R\G\B每一步的差值
      let rStep = (eColor[0] - sColor[0]) / step;
      let gStep = (eColor[1] - sColor[1]) / step;
      let bStep = (eColor[2] - sColor[2]) / step;
      let aStep = (eColor[3] - sColor[3]) / step;

      this.gradientColorArr = [];
      let rgba;
      for (let i = 0; i < step - 1; i++) {
        // 计算每一步的hex值
        rgba =
          "rgba(" +
          parseInt(rStep * i + Number(sColor[0])) +
          "," +
          parseInt(gStep * i + Number(sColor[1])) +
          "," +
          parseInt(bStep * i + Number(sColor[2])) +
          "," +
          Number(aStep * i + Number(sColor[3])).toFixed(2) +
          ")";
        this.gradientColorArr.push(rgba);

        this.color.colorValues.push(this.getHex(rgba));
      }

      this.gradientColorArr.push(endColor);
      this.color.colorValues.push(this.getHex(endColor));
    },
    // 生成颜色列表
    createColor() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.resetInsert();
          this.colorShow = true;
          for (
            let i = Number(this.color.svalue);
            i <= Number(this.color.evalue);
            i += Number(this.color.step)
          ) {
            this.color.legendValues.push(i);
          }

          this.gradient(
            this.color.scolor,
            this.color.ecolor,
            this.color.legendValues.length
          );

          this.gradientColorArr.forEach((item, index) => {
            this.isActive.push(false);
          });
        } else {
          this.$message.warning("请填写正确的相关数据");
        }
      });
    },
    // 取消颜色列表
    resetInsert() {
      this.colorShow = false;
      this.gradientColorArr = [];
      this.isActive = [];
      this.color.legendValues = [];
      this.color.colorValues = [];
      this.insertObj = this.initInsert();
    },
    cancleColor() {
      if (!this.colorShow) {
        this.$message.warning("当前无颜色值可重置");
      } else {
        this.resetInsert();
        this.color.scolor = null;
        this.color.ecolor = null;
      }
    },
    // 选中某个色块
    resetSelected() {
      this.isActive.forEach((item, index) => {
        this.$set(this.isActive, index, false);
      });
      this.colorIndex = null;
    },
    getSelected(index) {
      this.resetSelected();
      this.colorIndex = index;
      this.$set(this.isActive, index, true);
      this.nowColor = {
        hex: this.color.colorValues[this.colorIndex],
        rgba: this.gradientColorArr[this.colorIndex],
      };
    },
    // 删除色块
    reduceColor() {
      if (this.colorIndex !== null) {
        this.$confirm(
          "是否确定删除以下颜色：<span style='background:" +
            this.color.colorValues[this.colorIndex] +
            ";width:16px;height:16px;vertical-align:middle;margin-right:5px;display:inline-block;'></span><span>" +
            this.color.colorValues[this.colorIndex] +
            "</span>，颜色值:" +
            this.color.legendValues[this.colorIndex],
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
            align: "center",
            dangerouslyUseHTMLString: true,
          }
        )
          .then(() => {
            this.color.legendValues.splice(this.colorIndex, 1);
            this.color.colorValues.splice(this.colorIndex, 1);
            this.gradientColorArr.splice(this.colorIndex, 1);

            this.resetColor(this.gradientColorArr);

            this.$message({
              type: "success",
              message: "删除成功!",
            });

            if (this.gradientColorArr.length == 0) {
              this.resetInsert();
            }

            this.resetSelected();
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      } else {
        this.$message.warning("未选择颜色");
      }
    },
    // 插入色块
    insertColor() {
      this.resetSelected();
      let insertValue = Number(this.insertObj.value);
      if (insertValue && this.insertObj.color) {
        if (this.color.legendValues.indexOf(insertValue) === -1) {
          let index = 0;
          let indexFlag = false;
          for (let i = 0; i < this.color.legendValues.length; i++) {
            if (this.color.legendValues[i] >= insertValue) {
              index = i;
              indexFlag = true;
              break;
            }
          }
          if (!indexFlag) {
            index = this.color.legendValues.length;
          }
          if (index >= this.color.legendValues.length) {
            this.color.legendValues.push(insertValue);
            this.gradientColorArr.push(this.insertObj.color);
            this.color.colorValues.push(this.getHex(this.insertObj.color));
          } else {
            for (var j = this.color.legendValues.length; j > index; j--) {
              //进行移动 aar[5]=arr[4]      arr[4]=arr[3]
              this.color.legendValues[j] = this.color.legendValues[j - 1];
              this.color.colorValues[j] = this.color.colorValues[j - 1];
              this.gradientColorArr[j] = this.gradientColorArr[j - 1];
            }
            this.$set(this.color.legendValues, index, insertValue);
            this.$set(this.gradientColorArr, index, this.insertObj.color);
            this.$set(
              this.color.colorValues,
              index,
              this.getHex(this.insertObj.color)
            );
            this.$message.success("插入颜色值成功");
            this.resetColor(this.gradientColorArr);
          }
        } else {
          this.$message.warning("该值已存在");
        }
        this.insertObj = this.initInsert();
      } else {
        this.$message.warning("请填写插入值和插入颜色");
      }
      // console.log(this.color.legendValues)
    },
    // 改变颜色
    changeColor() {
      if (this.gradientColorArr[this.colorIndex] === null) {
        this.$message.warning("颜色值不能为空");
        this.gradientColorArr[this.colorIndex] = this.nowColor.rgba;
      } else {
        this.color.colorValues.splice(
          this.colorIndex,
          1,
          this.getHex(this.gradientColorArr[this.colorIndex])
        );
        this.resetColor(this.gradientColorArr);
      }
      this.resetSelected();
    },
    // 修改颜色值
    updateVal(index) {
      this.$prompt("请输入颜色值", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /(^[\-0-9][0-9]*(.[0-9]+)?)$/,
        inputErrorMessage: "请输入正确的数字",
        inputValue: this.color.legendValues[index],
      })
        .then(({ value }) => {
          let _value = Number(value);
          if (this.color.legendValues.includes(_value)) {
            this.$message({
              type: "warning",
              message: "该值已存在",
            });
          } else {
            this.$message({
              type: "success",
              message: "已更新颜色值: " + _value,
            });

            // 插入后排序
            let color_index = 0;
            let color = this.gradientColorArr[index];
            let indexFlag = false;

            this.gradientColorArr.splice(index, 1);
            this.color.colorValues.splice(index, 1);
            this.color.legendValues.splice(index, 1);

            for (let i = 0; i < this.color.legendValues.length; i++) {
              if (this.color.legendValues[i] >= _value) {
                color_index = i;
                indexFlag = true;
                break;
              }
            }
            if (!indexFlag) {
              color_index = this.color.legendValues.length;
            }
            if (color_index >= this.color.legendValues.length) {
              this.color.legendValues.push(_value);
              this.color.gradientColorArr.push(color);
              this.color.colorValues.push(this.getHex(color));
            } else {
              for (
                var j = this.color.legendValues.length;
                j > color_index;
                j--
              ) {
                this.color.legendValues[j] = this.color.legendValues[j - 1];
                this.gradientColorArr[j] = this.gradientColorArr[j - 1];
                this.color.colorValues[j] = this.color.colorValues[j - 1];
              }
              this.$set(this.gradientColorArr, color_index, color);
              this.$set(
                this.color.colorValues,
                color_index,
                this.getHex(color)
              );
            }
            this.resetColor(this.gradientColorArr);
          }
          this.resetSelected();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消修改",
          });
          this.resetSelected();
        });
    },
    initColor() {
      return {
        contourName: null,
        svalue: null,
        evalue: null,
        step: null,
        scolor: null,
        ecolor: null,
        legendValues: [],
        colorValues: [],
        lineStyle: "",
        lineThickness: "",
      };
    },
    // 重置插入值
    initInsert() {
      return {
        color: null,
        value: null,
      };
    },
    close() {
      this.$emit("close");
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.color.colorValues.length === 0) {
            this.$message.warning("颜色值不能为空");
          } else if (this.title === "添加等值线") {
            // 新增
            this.$post("/api/contour-config", { ...this.color }).then(() => {
              this.isVisible = false;
              this.$message({
                message: this.$t("tips.createSuccess"),
                type: "success",
              });
              this.$emit("success");
            });
          } else if (this.title === "修改等值线") {
            // 更新
            this.$put("/api/contour-config", { ...this.color }).then(() => {
              this.isVisible = false;
              this.$message({
                message: this.$t("tips.updateSuccess"),
                type: "success",
              });
              this.$emit("success");
            });
          }
        } else {
          return false;
        }
      });
    },
    reset() {
      // 先清除校验，再清除表单，不然有奇怪的bug
      this.$refs.form.clearValidate();
      this.$refs.form.resetFields();
      this.color = this.initColor();

      this.$refs.insertForm.clearValidate();
      this.$refs.insertForm.resetFields();
      this.insertObj = this.initInsert();
      this.colorShow = false;
    },
    closeDialog() {
      this.isVisible = false;
      this.reset();
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
/deep/input:disabled::-webkit-input-placeholder {
  color: #c0b2c0;
  -webkit-text-fill-color: #c0b2c0;
}
</style>
