<template>
  <!-- eslint-disable-->
  <el-dialog
    :title="title"
    width="1550px"
    top="50px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="isVisible"
    append-to-body
    @open="open"
    class="dialog_wrapper"
  >
    <div class="chart" id="chart" ref="chart"></div>
  </el-dialog>
</template>
<script>
import { treeData } from "./1.js";
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
  methods: {
    open() {
      console.log("打开");
      this.$nextTick(() => {
        this.initCharts();
      });
    },
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
      const eChart = this.$echarts.init(chart);
      const data = treeData;
      this.$echarts.util.each(data.children, function (datum, index) {
        index % 2 === 0 && (datum.collapsed = true);
        datum.label = {
          color: "red",
          fontSize: "12",
        };
        datum.itemStyle = {
          normal: {
            color: "#00EAEC",
            lineStyle: {
              color: "#fff000",
            },
          },
        };
      });
      const option = {
        tooltip: {
          trigger: "item",
          triggerOn: "mousemove",
        },
        series: [
          {
            type: "tree",
            data: [data],
            top: "1%",
            left: "7%",
            bottom: "1%",
            right: "20%",
            symbolSize: 7,
            label: {
              position: "left",
              verticalAlign: "middle",
              align: "right",
              fontSize: 9,
            },
            leaves: {
              label: {
                position: "right",
                verticalAlign: "middle",
                align: "left",
              },
            },

            expandAndCollapse: true,
            animationDuration: 550,
            animationDurationUpdate: 750,
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
<style lang='scss'>
.dialog_wrapper {
  height: 900px;
  .chart {
    width: 865px;
    height: 500px;
  }
}
</style>