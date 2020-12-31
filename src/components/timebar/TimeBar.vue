<template>
  <div id="timebar">
    <!-- 日期 -->
    <div id="calendar" style="left:300px;width:calc(100% - 410px)">
      <div v-for="(item, index) in calendarList" :key="index" :style="dayWidth">
        {{ item.day }}
      </div>
    </div>

    <el-date-picker
      v-model="dateVal"
      type="date"
      placeholder="选择日期"
      size="mini"
      value-format="yyyy-MM-dd"
      style="width:128px;position:absolute;left:0px; top:-19px;"
      @change="getDay"
    />

    <!-- 切换时间间隔 -->
    <div class="timeInterval">
      <el-select v-model="timeInterval" placeholder="时间间隔" size="small">
        <el-option
          v-for="item in timeIntervalList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>

      <el-select v-model="timeForcast" placeholder="起报时间" size="small">
        <el-option
          v-for="item in timeForcastList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>

    <!-- 时间进度条 -->
    <div class="timeline">
      <div
        id="tline"
        ref="totalLine"
        class="totalLen"
        style="width:calc(100% - 410px);"
        @click="loadTo"
        @mouseover="showTip"
        @mousemove="showTip"
        @mouseleave="hideTip"
      />
      <div
        ref="line"
        class="playLen"
        :style="{ width: playPosition }"
        @click="loadTo"
        @mouseover="showTip"
        @mousemove="showTip"
        @mouseleave="hideTip"
      />
      <ul class="time_ul">
        <li v-for="(item,index) in hasDataList" :key="index">
          <div class="greenCircle" :style="{ left: item }" @click="click"></div>
        </li>
      </ul>
      <!-- <div class="div1" @click="click"></div> -->
    </div>

    <!-- 划过提示框 -->
    <div
      v-show="tipshow"
      class="timecode ghost-timecode"
      :style="{ left: tipleft, top: tiptop }"
    >
      <div class="box">{{ tip }}</div>
    </div>

    <!-- 当前时间 -->
    <div class="circle" :style="{ left: circlePosition }" />
    <div
      ref="nowtime"
      class="timecode main-timecode"
      :style="{ left: nowTime }"
    >
      <div class="box">{{ showday }}</div>
    </div>

    <!-- 播放按钮 -->
    <div id="playpause" @click="changeIcon">
      <i :class="iconData" />
    </div>
    <!-- 切换下一个时间点 -->
    <div class="next" @click="nextTime">
      <!-- <i class="el-icon-arrow-right" @click="nextTime"></i> -->
      <img src="@/assets/images/timebar/next.svg" />
    </div>
    <!-- 切换上一个时间点 -->
    <div class="prev" @click="prevTime">
      <!-- <i class="el-icon-arrow-left"></i> -->
      <img src="@/assets/images/timebar/prev.svg" />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { parseTime } from "@/utils";

// 监听时间轴尺寸变化
var elementResizeDetectorMaker = require("element-resize-detector"); // 导入
export default {
  name: "TimeBar",
  props: {
    msg: String,
  },
  data() {
    return {
      barBottom: null,
      // 时间轴长度
      playPosition: 0,
      nowTime: "260px",
      circlePosition: "296px",
      // 显示日期
      showday: null,
      dayListLength: 0,
      calendarList: [],

      itemwidth: 0,
      // 时间戳
      tipPosition: 0,
      tip: null,
      tipshow: false,
      tipleft: "262px",
      tiptop: "-3.5em",
      itemcount: 0, // 总个数
      itemdayIndex: 0, // 天数
      itemtimeIndex: 0, // 时间段

      // 时次
      num: 24,

      // 时间段长度
      bItem: 0, // 天数
      sItem: 0, // 时间段

      // 当前时间
      dayIndex: 0,
      timeIndex: 0,

      // 初始化时间点
      nowPosition: "120px",

      // 播放
      iconData: "iconfont icon-ziyuan",
      playIcon: "iconfont icon-ziyuan",
      stopIcon: "iconfont icon-zanting",
      timer: "",
      // 分割个数
      count: 0,

      // 第几个时间点
      item: 1,

      // 长度
      totalwidth: 0,
      linewidth: 0,

      // 当前时间
      date: null,
      end: null,
      start: null,
      dateList: [],
      timeFlag: true,
      dateVal: null,

      // 获取最近的时间  要素的id
      currentId: null,

      // 时间间隔列表
      timeIntervalList: [
        {
          value: 1,
          label: "1小时",
        },
        {
          value: 3,
          label: "3小时",
        },
        {
          value: 6,
          label: "6小时",
        },
        // {
        //   value: 9,
        //   label: '9小时',
        // },
        {
          value: 12,
          label: "12小时",
        },
        {
          value: 24,
          label: "24小时",
        },
      ],
      timeInterval: 3,

      // 起报时间
      timeForcast: "20",
      timeForcastList: [
        {
          value: "00", //02
          label: "00:00",
        },
        {
          value: "08",
          label: "08:00",
        },
        {
          value: "12", //14
          label: "12:00",
        },
        {
          value: "20",
          label: "20:00",
        },
      ],
      hasDataList: [],
    };
  },
  created() {},
  computed: {
    ...mapState({
      sourceType: (state) => state.sideBar.sourceType,
      // 所有要素类型
      menuItemList: (state) => state.sideBar.menuItemList,
      // 刷新时间
      reloadTime: (state) => state.sideBar.reloadTime,
    }),
    // 单个日期宽度
    dayWidth: function() {
      return {
        width: "calc(100% / " + this.dayListLength + ")",
      };
    },
    // 获取时次
    timeLevel: function() {
      return this.$store.state.time.timeLevel;
    },
  },
  watch: {
    // timeLevel(newval) {
    //   this.calendarList.forEach((item, index) => {
    //     this.calendarList[index].timeArr = newval;
    //   });
    //   console.log("object");

    //   // 时次改变时间轴改变
    //   this.resetPlay();

    //   // 基数
    //   this.num = newval.length;
    //   // 初始化当前时间
    //   this.showday =
    //     this.calendarList[0].day + " - " + this.calendarList[0].timeArr[0];
    //   // 时间数组长度
    //   this.dayListLength = this.calendarList.length;
    //   // 分割的总个数
    //   this.count = this.dayListLength * newval.length;
    //   // 时间段长度
    //   this.bItem = this.totalwidth / this.dayListLength;
    //   this.sItem = this.totalwidth / this.count;
    // },
    // 时间间隔变化
    // timeInterval(newval) {
    //   if (newval === 1) {
    //     this.num = 24;
    //   } else if (newval === 3) {
    //     this.num = 8;
    //   } else if (newval === 6) {
    //     this.num = 4;
    //   } else if (newval === 12) {
    //     this.num = 2;
    //   } else if (newval === 24) {
    //     this.num = 1;
    //   }

    //   this.timeFlag = false;
    //   this.getLatestTime();
    //   // 初始化当前时间
    //   this.showday =
    //     this.calendarList[0].day + " " + this.calendarList[0].timeArr[0];
    //   // this.showday = "2020-08-01 03:00"
    //   // 时间数组长度
    //   this.dayListLength = this.calendarList.length;
    //   // 分割的总个数
    //   this.count = this.dayListLength * this.num;
    //   // 时间段长度
    //   this.bItem = this.totalwidth / this.dayListLength;
    //   // console.log(this.bItem)
    //   this.sItem = this.totalwidth / this.count;

    //   this.changeTime(this.showday);
    //   // this.$store.commit("changeTime", this.showday);

    //   this.resetPlay();
    // },
    // 起报时间
    timeForcast(newval) {
      this.setTimeForcast(newval);
      //起报时间变化时，根据起报时间重新获取有数据的时间点
      let startTime = this.dateVal + " " + this.timeForcast + ":00:00";
      this.getTypeTime(startTime);
    },
    // 刷新时间
    reloadTime(newval) {
      this.currentId = this.menuItemList[this.menuItemList.length - 1].id;
      this.timeFlag = false;
      let startTime = this.dateVal + " " + this.timeForcast + ":00:00";
      //刷新时间时，传起报时间获取时间列表
      this.getTypeTime(startTime);
    },

    dateVal(newVal){
      // console.log(newVal,"新的时间");
      let startTime = this.dateVal + " " + this.timeForcast + ":00:00";
      this.getTypeTime(startTime);
    }
  },
  mounted() {
    // 监听时间轴尺寸变化
    // 创建实例
    const erd = elementResizeDetectorMaker();
    // 创建实例带参
    const erdUltraFast = elementResizeDetectorMaker({
      strategy: "scroll", // <- For ultra performance.
      callOnAdd: true,
      debug: true,
    });
    // 监听id为tline的元素 大小变化
    erd.listenTo(document.getElementById("tline"), (element) => {
      const width = element.offsetWidth;
      // const height = element.offsetHeight
      // 总长度
      this.totalwidth = width;

      // 初始化时间
      // this.timeFlag = true
      // this.getLatestTime()
      this.timeFlag = false;
      // this.dateVal = "2020-08-01"
      // 根据数据源获取第一个要素的id  getTypeTime()根据这个id去获取最近时间
      this.$get("/api/parameters/get_type", {
        type: this.sourceType,
      })
        .then((res) => {
          if (res.status == 200) {
            this.currentId = res.data.data[0].id;
            //初始化时，不传起报时间获取时间列表
            this.getTypeTime();
          }
        })
        .catch((error) => {
          this.$message.error("获取要素失败");
        });

      // this.getLatestTime()
      // this.getTypeTime().then(res=>{
      //   console.log(res);
      // }).catch(err=>{
      //   console.log(err);
      // })

      // // 初始化当前时间
      // this.showday =
      //   this.calendarList[0].day + ' ' + this.calendarList[0].timeArr[0]
      // // this.showday = "2020-08-01 03:00"
      // // 时间数组长度
      // this.dayListLength = this.calendarList.length
      // // 分割的总个数
      // this.count = this.dayListLength * this.num
      // // 时间段长度
      // this.bItem = this.totalwidth / this.dayListLength
      // // console.log(this.bItem)
      // this.sItem = this.totalwidth / this.count

      // this.$store.commit('changeTime', this.showday)
      // console.log('------------')
      // console.log(this.showday)

      // this.resetPlay()
    });
  },
  methods: {
    ...mapMutations({
      setTimeForcast: "time/setTimeForcast",
      changeTime: "time/changeTime",
    }),
    // 获取选择的时间
    getDay() {
      if (this.dateVal === null) {
        this.timeFlag = true;
        this.resetPlay();
      } else {
        this.timeFlag = false;
      }
      this.changeTime(this.dateVal + " 00:00");
      // this.$store.commit("changeTime", this.dateVal + " 00:00");
      this.getLatestTime();
    },

    //获得最近有数据的时间点
    getTypeTime(startTime) {
      // const date = new Date();
      // const year = date.getFullYear();
      // const month =
      //   date.getMonth() + 1 < 10
      //     ? "0" + (date.getMonth() + 1)
      //     : date.getMonth() + 1;
      // const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      // const hour =
      //   date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      // const minute =
      //   date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      // let time = year + "-" + month + "-" + day + " " + hour + ":" + minute;
      // console.log("当前系统时间", time);
      // this.$get("/api/numerical-forecast/trygettime", {
      //   time: time,
      //   type: this.currentId,
      // }).then((res) => {
      //   let timeArr = res.data.data.split(" ");
      //   console.log(timeArr);
      //   // const hour = Number(timeArr[1])<10?'0'+Number(timeArr[1])<10:Number(timeArr[1])<10
      //   this.dateVal = timeArr[0];
      //   this.getLatestTime();
      //   // 初始化当前时间
      //   this.showday =
      //     this.calendarList[0].day + " " + this.calendarList[0].timeArr[0];
      //   // this.showday = "2020-08-01 03:00"
      //   // 时间数组长度
      //   this.dayListLength = this.calendarList.length;
      //   // 分割的总个数
      //   this.count = this.dayListLength * this.num;
      //   // 时间段长度
      //   this.bItem = this.totalwidth / this.dayListLength;
      //   // console.log(this.bItem)
      //   this.sItem = this.totalwidth / this.count;

      //   this.changeTime(this.showday);

      //   this.resetPlay();
      // });
      if (startTime) {
        this.$get("api/numerical-forecast/trygettime-list", {
          startTime: startTime,
          type: this.currentId,
        }).then((res) => {
          console.log(res.data.data, "根据起报时间获取时间列表");
          let data = res.data.data;
          if (data.length != 0) {
            this.dateVal = data[0].startDay;
            this.getLatestTime();
            // 初始化当前时间
            this.showday =
              this.calendarList[0].day + " " + this.calendarList[0].timeArr[0];
            // this.showday = "2020-08-01 03:00"
            // 时间数组长度
            this.dayListLength = this.calendarList.length;
            // 分割的总个数
            this.count = this.dayListLength * this.num;
            // 时间段长度
            this.bItem = this.totalwidth / this.dayListLength;
            // console.log(this.bItem)
            this.sItem = this.totalwidth / this.count;
            //初始化时间到有数据的时间点
            this.item = 1 + data[0].startHours;
            this.getLineData();

            this.changeTime(this.showday);
            console.log(this.calendarList, "时间轴时间列表");
            //找出当前时间段内，有数据的时间点并计算偏移的位置
            let start = new Date(
              this.calendarList[0].day + " " + this.calendarList[0].timeArr[0]
            ).getTime();
            let end =
              new Date(
                this.calendarList[this.calendarList.length - 1].day +
                  " " +
                  this.calendarList[this.calendarList.length - 1].timeArr[0]
              ).getTime() +
              1 * 24 * 60 * 60 * 1000;
            // console.log(start,end);
            this.hasDataList = [];
            const width =
              ((document.body.clientWidth - 410) / 7).toFixed(1) / this.num;
            data.forEach((item) => {
              let time = new Date(
                item.startDay + " " + item.startHours + ":00:00"
              ).getTime();
              if (time >= start && time < end) {
                let dif = (time - start) / (1 * 60 * 60 * 1000);
                this.hasDataList.push(width * dif - 3 + "px");
              }
            });
          } else {
            this.$message.warning("该起报时间无数据");
            this.hasDataList = []
            this.resetPlay()
            this.changeTime(this.showday);
          }

          // this.resetPlay();
        });
      } else {
        this.$get("api/numerical-forecast/trygettime-list", {
          type: this.currentId,
        }).then((res) => {
          console.log(res.data.data, "根据起报时间获取时间列表");
          let data = res.data.data;
          if (data.length != 0) {
            this.dateVal = data[0].startDay;
            this.getLatestTime();
            // 初始化当前时间
            this.showday =
              this.calendarList[0].day + " " + this.calendarList[0].timeArr[0];
            // this.showday = "2020-08-01 03:00"
            // 时间数组长度
            this.dayListLength = this.calendarList.length;
            // 分割的总个数
            this.count = this.dayListLength * this.num;
            // 时间段长度
            this.bItem = this.totalwidth / this.dayListLength;
            // console.log(this.bItem)
            this.sItem = this.totalwidth / this.count;
            //初始化时间到有数据的时间点
            this.item = 1 + data[0].startHours;
            this.getLineData();

            this.changeTime(this.showday);
            console.log(this.calendarList, "时间轴时间列表");
            //找出当前时间段内有数据的时间点，并计算偏移的位置
            let start = new Date(
              this.calendarList[0].day + " " + this.calendarList[0].timeArr[0]
            ).getTime();
            let end =
              new Date(
                this.calendarList[this.calendarList.length - 1].day +
                  " " +
                  this.calendarList[this.calendarList.length - 1].timeArr[0]
              ).getTime() +
              1 * 24 * 60 * 60 * 1000;
            // console.log(start,end);
            this.hasDataList = [];
            const width =
              ((document.body.clientWidth - 410) / 7).toFixed(1) / this.num;
            data.forEach((item) => {
              let time = new Date(
                item.startDay + " " + item.startHours + ":00:00"
              ).getTime();
              if (time >= start && time < end) {
                let dif = (time - start) / (1 * 60 * 60 * 1000);
                this.hasDataList.push(width * dif - 3 + "px");
              }
            });
            // console.log(this.hasDataList);
          }else{
            this.$message.warning("暂无数据");
          }

          // this.resetPlay();
        });
      }
      // .catch(err=>{
      //   console.log(err.response.status);
      //   if(err.response.status==404){
      //     this.getTypeTime()
      //   }
      // })
    },
    // 获取最近三周时间
    getLatestTime() {
      this.dateList = [];
      this.date = new Date();

      if (this.timeFlag) {
        // 当日
        this.end = new Date();
        this.start = new Date();
        for (let i = 0; i <= 6; i++) {
          const nowDate = this.end.getTime() + 3600 * 1000 * 24 * i;
          // this.dateList.push({
          //   day: parseTime(nowDate, "{y}-{m}-{d}"),
          //   timeArr: null,
          // });
          let obj = {
            day: parseTime(nowDate, "{y}-{m}-{d}"),
            timeArr: null,
          };
          let timeArr = [];
          let time = 0;
          while (time < 24) {
            let str = time < 10 ? "0" + time : time;
            timeArr.push(str + ":00");
            time += this.timeInterval;
          }
          obj.timeArr = timeArr;
          this.dateList.push(obj);
        }
      } else {
        this.end = this.date.setFullYear(
          parseTime(this.dateVal, "{y}"),
          parseTime(this.dateVal, "{m}") - 1,
          parseTime(this.dateVal, "{d}")
        );
        this.start = this.date.setFullYear(
          parseTime(this.dateVal, "{y}"),
          parseTime(this.dateVal, "{m}") - 1,
          parseTime(this.dateVal, "{d}")
        );
        for (let i = 0; i <= 6; i++) {
          const nowDate = this.end + 3600 * 1000 * 24 * i;
          // this.dateList.push({
          //   day: parseTime(nowDate, "{y}-{m}-{d}"),
          //   timeArr: [
          //     "00:00",
          //     "03:00",
          //     "06:00",
          //     "09:00",
          //     "12:00",
          //     "15:00",
          //     "18:00",
          //     "21:00",
          //   ],
          // });
          let obj = {
            day: parseTime(nowDate, "{y}-{m}-{d}"),
            timeArr: null,
          };
          let timeArr = [];
          let time = 0;
          while (time < 24) {
            let str = time < 10 ? "0" + time : time;
            timeArr.push(str + ":00");
            // time += this.timeInterval;
            time += 1;
          }
          obj.timeArr = timeArr;
          this.dateList.push(obj);
        }
      }

      this.calendarList = this.dateList;
      this.showday =
        this.calendarList[0].day + " " + this.calendarList[0].timeArr[0];

      // this.item = 1;
      this.dayIndex = 0;
      this.timeIndex = 0;
      this.linewidth = 0;
      this.playPosition = 0;
      this.nowTime = "260px";
      this.circlePosition = "296px";
      this.iconData = "iconfont icon-ziyuan";
      clearInterval(this.timer);
    },
    // 当前时间时间戳
    getNowTip(dayIndex, timeIndex) {
      return (
        this.calendarList[dayIndex].day +
        " " +
        this.calendarList[dayIndex].timeArr[timeIndex]
      );
    },
    // 不同窗口宽度下的长度
    // 不同时次下的天数和时间长度
    getItemWidth() {
      this.itemcount = 0;
      // 总个数
      this.calendarList.forEach((item, index) => {
        this.itemcount += item.timeArr.length;
      });
      this.itemwidth = this.totalwidth / this.itemcount;
      return this.itemwidth;
    },
    // 进度条滑动场长度
    loadTo(a, b) {
      this.playPosition = event.offsetX + "px";
      console.log(this.playPosition, "playPosition===========");
      this.nowTime = event.offsetX + 260 + "px";
      this.circlePosition = event.offsetX + 296 + "px";

      // 播放过程中点击
      this.iconData = this.playIcon;
      clearInterval(this.timer);

      // 时间戳内容
      this.getPosition(event.offsetX);
      this.showday = this.getNowTip(this.itemdayIndex, this.itemtimeIndex);
      this.dayIndex = this.itemdayIndex;
      this.timeIndex = this.itemtimeIndex;
      this.item = this.itemdayIndex * this.num + (this.itemtimeIndex + 1);
      // 传递时间
      this.changeTime(this.showday);
      // this.$store.commit("changeTime", this.showday);
    },
    // 当前点的位置
    getPosition(x) {
      this.itemdayIndex = parseInt(x / this.bItem);
      if (this.itemdayIndex > 0) {
        this.itemtimeIndex = parseInt(
          (x - this.itemdayIndex * this.bItem) / this.sItem
        );
      } else {
        this.itemtimeIndex = parseInt(x / this.sItem);
      }
    },
    // 时间戳显示
    showTip() {
      this.tipshow = true;

      // 时间戳偏移量
      this.tipleft = event.offsetX + 262 + "px";
      const nowVal = parseInt(this.$refs.nowtime.style.left.replace("px", ""));
      const tipVal = parseInt(this.tipleft.replace("px", ""));
      if (Math.abs(nowVal - tipVal) <= 80) {
        this.tiptop = "-6em";
      } else {
        this.tiptop = "-3.5em";
      }

      // 时间戳内容
      this.getPosition(event.offsetX);
      this.tip = this.calendarList[this.itemdayIndex].timeArr[
        this.itemtimeIndex
      ];
    },
    hideTip() {
      this.tipshow = false;
      this.tipleft = "262px";
    },

    // 播放
    // 重置
    resetPlay() {
      // const date = new Date()
      // const year = date.getFullYear()
      // const month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
      // const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      // let dateVal = year + '-' + month + '-' + day
      // this.dateVal = dateVal
      this.dateList = [];
      this.timeFlag = true;
      this.item = 1;
      this.dayIndex = 0;
      this.timeIndex = 0;
      this.linewidth = 0;
      this.playPosition = 0;
      this.nowTime = "260px";
      this.circlePosition = "296px";
      this.iconData = "iconfont icon-ziyuan";
      this.showday =
        this.calendarList[0].day + " " + this.calendarList[0].timeArr[0];
      clearInterval(this.timer);
    },
    getLineData() {
      // 当前时间
      this.dayIndex = parseInt((this.item - 1) / this.num);
      this.timeIndex = (this.item - 1) % this.num;

      this.linewidth = (this.dayIndex * this.num + this.timeIndex) * this.sItem;

      if (this.dayIndex === this.dayListLength && this.timeIndex === 0) {
        this.showday = this.getNowTip(this.dayIndex - 1, this.num - 1);
      } else {
        this.showday = this.getNowTip(this.dayIndex, this.timeIndex);
      }
      this.playPosition = this.linewidth + "px";
      this.nowTime = this.linewidth + 260 + "px";
      this.circlePosition = this.linewidth + 296 + "px";
    },
    // 播放时间轴长度
    changeLine() {
      // 当前长度
      this.linewidth = Number(this.$refs.line.style.width.replace("px", ""));
      // if (this.item <= this.count) {
      if (this.item + this.timeInterval <= this.count) {
        // this.item++;
        this.item += this.timeInterval;

        this.getLineData();
        this.changeTime(this.showday);
        // this.$store.commit("changeTime", this.showday);
      } else {
        this.resetPlay();
      }
    },
    changeIcon() {
      if (this.iconData === this.playIcon) {
        this.iconData = this.stopIcon;
        this.timer = setInterval(this.changeLine, 3000);
      } else {
        this.iconData = this.playIcon;
        clearInterval(this.timer);
      }
    },
    //下一个时间点
    nextTime() {
      if (this.timer) {
        this.iconData = this.playIcon;
        clearInterval(this.timer);
      }
      this.changeLine();
    },
    //上一个时间点
    prevTime() {
      console.log("切换上一个时间点");
      // 当前长度
      this.linewidth = Number(this.$refs.line.style.width.replace("px", ""));
      // if (this.item - 1 <= 0) {
      if (this.item - this.timeInterval <= 0) {
        this.resetPlay();
      } else {
        // this.item--;
        this.item -= this.timeInterval;
        this.getLineData();
        this.changeTime(this.showday);
        if (this.timer) {
          this.iconData = this.playIcon;
          clearInterval(this.timer);
        }
      }
      // this.item = 4
      // this.getLineData()
      // this.changeTime(this.showday);
    },
    click() {},
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
