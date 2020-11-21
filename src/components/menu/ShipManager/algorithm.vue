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
    <div class="chart" id="chart" ref="chart"></div>
  </el-dialog>
</template>
<script>
import { toBase64 } from "@/utils/toBase64.js";
export default {
  data() {
    return {};
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
  mounted() {
    this.$nextTick(() => {
      this.initCharts()
    });
  },
  methods: {
    // 关闭对话框
    close() {
      this.$emit("close");
    },
    // 重置
    reset() {
      this.formData = {
        warshipName: "",
        warshipType: "",
        number: "",
        tonnage: "",
        speed: "",
        shipPhoto: "",
        windResistant: "",
      };
      this.photoList = [];
    },
    // 树图
    initCharts() {
      const chart = this.$refs.chart;
      console.log(chart,this.$echarts, `this.$echarts`);
      const eChart = this.$echarts.init(chart);
      console.log(eChart, `eChart`);
      const option = {
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: "line",
          },
        ],
      };
      eChart.clear();
      eChart.setOption(option);
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
<style lang='scss'></style>