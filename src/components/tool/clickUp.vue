<template>
  <div id="clickup_box">
    <div
      id="p_infobox"
      v-if="pointInfoShow"
      :style="{ top: top - 14 + 'px', left: left + 14 + 'px' }"
    >
      <div class="info_title">评估信息</div>
      <div class="info_content">
        <div v-for="(item, index) in pointInfo.arr" :key="index">
          <div class="content_item">{{ item.name }}: {{ item.value }}</div>
        </div>
        <div class="descriptionBox">
          描述信息:
          <textarea
            name="description"
            id="des_text"
            cols="25"
            rows="3"
            style="resize:none;"
            v-model="pointInfo.message"
          ></textarea>
        </div>
        <div class="btn_box">
          <button id="des_btn_pre" @click="desPreserve">保存</button>
          <button id="des_btn_close" @click="desClose">取消</button>
        </div>
      </div>
    </div>

    <div
      id="p_infobox"
      v-if="infoShow"
      :style="{ top: infoTop - 14 + 'px', left: infoLeft + 14 + 'px' }"
    >
      <div class="info_title">水文信息</div>
      <div class="info_content">
        <div v-for="(item, index) in infoData" :key="index">
          <div class="content_item">{{ item.name }}: {{ item.value }}</div>
        </div>
      </div>
    </div>

    <!-- 潮汐显示 -->
    <div
      class="tidal"
      id="tidal"
      ref="tidal"
      :style="{ left: tidalObj.left + 'px', top: tidalObj.top + 'px' }"
      v-show="tidalShow"
    >
      <div class="tidal_title">
        <div class="title_detail" ref="tidal_name">{{ tidalData.name }}</div>
        <div class="title_time">
          <img src="@/assets/images/sidebar/refresh.png" />
          <span>{{ tidalData.time }}</span>
        </div>
      </div>
      <div class="tidal_content">
        <div class="content_echarts">
          <ul class="echarts_time">
            <li
              v-for="(item, index) in tidalData.timeList"
              :key="index"
              @click.stop="changeTimeIndex(index)"
              :class="{ li_select: index === changeDateIndex }"
            >
              <div>{{ item }}</div>
            </li>
          </ul>
          <div class="echarts_content" id="echarts_content"></div>
        </div>
        <div class="tidal_msg" v-show="tidalMsgFlag">
          <span>此时刻暂无潮汐数据</span>
        </div>
        <div class="content_list">
          <ul>
            <li
              v-for="(item, index) in tidalData.tidalList"
              :key="index"
              :class="{ li_blue: index % 2 == 0, li_red: index % 2 != 0 }"
            >
              <div class="list_top">
                <img
                  :src="
                    index % 2 == 0
                      ? require('@/assets/images/sidebar/bluetidal.png')
                      : require('@/assets/images/sidebar/redtidal.png')
                  "
                />
                <span :class="{ blue: index % 2 == 0, red: index % 2 != 0 }">{{
                  item.name
                }}</span>
              </div>
              <div class="list_bottom">
                <div class="list_time">
                  <img src="@/assets/images/sidebar/time.png" />
                  <span>潮时：</span>
                  <span>{{ item.tidalTime }}</span>
                </div>
                <div class="list_height">
                  <img src="@/assets/images/sidebar/up.png" />
                  <span>潮高：</span>
                  <span>{{ item.height + "cm" }}</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "vueName",
  components: {},
  props: {},
  data() {
    return {
      pointInfoList: [
        {
          name: "时间",
          value: "2020-01-01 10:00",
        },
        {
          name: "温度",
          value: "23",
        },
        {
          name: "高度",
          value: "1234",
        },
      ],
      //   textValue:""

      // 潮汐面板数据
      tidalChart: null,
    };
  },
  computed: {
    ...mapState({
      pointInfoShow: (state) => state.clickup.pointInfoShow,
      pointInfo: (state) => state.clickup.pointInfo,
      top: (state) => state.clickup.top,
      left: (state) => state.clickup.left,
      infoTop: (state) => state.clickup.infoTop,
      infoLeft: (state) => state.clickup.infoLeft,
      infoShow: (state) => state.clickup.infoShow,
      infoData: (state) => state.clickup.infoData,

      // 潮汐
      tidalShow: state => state.clickup.tidalShow,
      tidalObj: state => state.clickup.tidalObj,
      tidalData: state => state.clickup.tidalData,
      tidalCharts: state => state.clickup.tidalCharts,
      tidalMsgFlag: state => state.clickup.tidalMsgFlag,
      changeDateIndex: state => state.clickup.changeDateIndex,
    }),
  },
  watch: {
    tidalShow(newval) {
      console.log('-----------',newval);
      // this.$nextTick(() => {
      //   // 初始化图表
      //   this.tidalChart = this.$echarts.init(
      //     document.getElementById("echarts_content")
      //   )
      // })
    },
    tidalCharts: {
      handler(val, old) {
        this.createChart(val)
        console.log(val);
      },
      deep: true
    }
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      // 初始化图表
      this.tidalChart = this.$echarts.init(
        document.getElementById("echarts_content")
      )
    })

    map.on("click",() => {
        this.setPointInfoShow(false)
        this.setInfoShow(false)
        this.setTidalShow(false)
    })
  },
  methods: {
    ...mapMutations({
      setPointInfoShow: "clickup/setPointInfoShow",
      setInfoShow: "clickup/setInfoShow",
      setChangeDateIndex: "clickup/setChangeDateIndex",
      setTidalShow: "clickup/setTidalShow",
    }),
    desPreserve() {
      console.log(this.pointInfo.message);
      this.$get("api/assessment/prompt-title", {
        assessmentId: this.pointInfo.assessmentId,
        index: this.pointInfo.index,
        title: this.pointInfo.message,
      })
        .then((res) => {
          console.log(res);
          this.$message({
            message: "保存成功",
            type: "success",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    desClose() {
      this.setPointInfoShow(false);
    },
    changeTimeIndex(i) {
      this.setChangeDateIndex(i)
    },
    // 创建图表
    createChart(dital) {
      let option = {
        backgroundColor: "#fff",
        color: ["#73A0FA"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
            lineStyle: {
              type: "dashed",
            },
          },
        },
        grid: {
          left: 5,
          right: 5,
          bottom: 5,
          top: 15,
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: dital.xdata,
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
        },
        yAxis: {
          type: "value",
          axisLabel: {
            color: "#999",
            textStyle: {
              fontSize: 12,
            },
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#F3F4F4",
            },
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
        },
        series: [
          {
            name: "潮高",
            type: "line",
            smooth: true,
            data: dital.ydata,
          },
        ],
      };

      this.tidalChart.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped></style>
