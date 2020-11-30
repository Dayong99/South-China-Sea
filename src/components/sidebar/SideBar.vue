<template>
  <div class="sideBar" id="sideBar">
    <div class="sidebar_ul">
      <!-- 温度、气压等子项 -->
      <ul class="menu_name">
        <li
          v-for="(item, index) in menuList"
          :key="index"
          @click.stop="menuClick(index)"
        >
          <div class="menu_left">{{ item.name }}</div>
          <!-- <div :class="{ menu_right: true, bgcolor: item.flag == 1 }">
            <img :src="item.flag == 0 ? item.img : item.selectImg" />
          </div> -->
        </li>
      </ul>
      <ul class="menu_list">
        <li
          v-for="(item, index) in menuList"
          :key="index"
          @click.stop="menuClick(index)"
        >
          <!-- <div class="menu_left" :class="{ bgcolor: item.flag == 1 }">{{ item.name }}</div> -->
          <div :class="{ menu_right: true, bgcolor: item.flag == true }">
            <img :src="item.icon" />
          </div>
        </li>
      </ul>
    </div>

    <!-- 实况资料 -->
    <div class="real_time_data">
      <el-select
        v-model="realTimeValue"
        clearable
        placeholder="实况资料"
        size="small"
      >
        <el-option
          v-for="item in realTimeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>

    <!-- 潮汐显示 -->
    <div
      class="tidal"
      id="tidal"
      ref="tidal"
      :style="{ left: tidalObj.left + 'px', top: tidalObj.top + 'px' }"
      v-show="tidalObj.tidalShow"
      @mouseover="tidalOver(true)"
      @mouseout="tidalOver(false)"
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
          <!-- ul li 替换 -->
          <!-- <div class="echarts_time">2020-10</div> -->
          <ul class="echarts_time">
            <li
              v-for="(item, index) in tidalData.timeList"
              :key="index"
              @click.stop="changeTimeIndex(index)"
              :class="{ li_select: index === tidalIndex }"
            >
              <div>{{ item }}</div>
            </li>
          </ul>
          <div class="echarts_content" id="echarts_content"></div>
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

    <!-- 台风显示 -->
    <div class="tylist" v-if="typhoonShow">
      <div class="tytitle">
        <div class="chooseAll" @click="chooseAll">
          <img
            :src="
              this.chooseAllFlag
                ? require('@/assets/images/sidebar/checked.png')
                : require('@/assets/images/sidebar/choose.png')
            "
          />
        </div>
        <div class="title_num">类型</div>
        <div class="title_cn">名称</div>
        <!-- <div class="title_en">英文名</div> -->
      </div>
      <div class="tycontent">
        <div class="content_box">
          <div v-for="(item, index) in tyList" :key="index" class="libox">
            <div class="chooseAll" @click="chooseOne(item, index)">
              <img
                :src="
                  item.choose
                    ? require('@/assets/images/sidebar/checked.png')
                    : require('@/assets/images/sidebar/choose.png')
                "
              />
            </div>
            <div class="title_num">{{ item.cycloneType }}</div>
            <div class="title_cn">{{ item.cycloneName }}</div>
            <!-- <div class="title_en">{{ item.enName }}</div> -->
          </div>
        </div>
      </div>
    </div>
    <!-- 台风图例 -->
    <div class="ty_color" v-if="typhoonShow">
      <p>台风:</p>
      <div>
        <ul>
          <li v-for="(item, index) in colorList" :key="index">
            <div :style="{ background: item.color }" class="icon"></div>
            <div>{{ item.title }}</div>
          </li>
        </ul>
      </div>
    </div>

    <!-- 层级轴 -->
    <level-bar></level-bar>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import { PressureLayer } from "@/utils/pressure/ocean.weather.pressure";
import { FlowLayer } from "@/utils/pressure/ocean.weather.flow";
import { WindLayer } from "@/utils/pressure/ocean.weather.wind";

import LevelBar from "@/components/levelbar/LevelBar";
export default {
  components: {
    LevelBar: LevelBar,
  },
  data() {
    return {
      firstFlag: true,
      // 日期、小时
      day: null,
      time: null,
      // 菜单列表数组
      menuList: [
        {
          id: 0,
          img: require("@/assets/images/sidebar/temperature.png"),
          name: "温度",
          type: "temperature",
          flag: 0,
          stationType: true,
          gridType: false,
          mutex: 1,
        },
        {
          id: 1,
          img: require("@/assets/images/sidebar/pressure.png"),
          name: "气压",
          type: "pressure",
          flag: 0,
          stationType: true,
          gridType: false,
          mutex: 0,
        },
        {
          id: 2,
          img: require("@/assets/images/sidebar/humidity.png"),
          name: "湿度",
          type: "humidity",
          flag: 0,
          stationType: true,
          gridType: false,
          mutex: 1,
        },
        {
          id: 3,
          img: require("@/assets/images/sidebar/wind.png"),
          name: "风场",
          type: "wind",
          flag: 0,
          stationType: true,
          gridType: false,
          mutex: 1,
        },
        {
          id: 4,
          img: require("@/assets/images/sidebar/effectivewave.png"),
          name: "有效波高",
          type: "visibility",
          flag: 0,
          stationType: true,
          gridType: false,
          mutex: 1,
        },
        {
          id: 5,
          img: require("@/assets/images/sidebar/geopotential.png"),
          name: "位势高度",
          type: "rain",
          flag: 0,
          stationType: true,
          gridType: false,
          mutex: 0,
        },
        {
          id: 6,
          img: require("@/assets/images/sidebar/humidity.png"),
          name: "相对湿度",
          type: "thunder",
          flag: 0,
          stationType: true,
          gridType: false,
          mutex: 1,
        },
        {
          id: 7,
          img: require("@/assets/images/sidebar/pressure.png"),
          name: "海平面气压",
          type: "radar",
          flag: 0,
          stationType: true,
          gridType: false,
          mutex: 0,
        },
        {
          id: 8,
          img: require("@/assets/images/sidebar/vertical.png"),
          name: "垂直速度",
          type: "satellite",
          flag: 0,
          stationType: true,
          gridType: false,
          mutex: 0,
        },
      ],
      // 当前选中的所有要素集合
      currentItemList: [],
      // 当前选中的一个要素
      currentItem: null,
      // 当前选中的一个要素的层级
      currentLevel: null,
      // 线集合
      lineList: [],
      // 图层集合
      layerList: [],
      // 范围数组
      extentList: [],
      // 海流图层
      waveLayer: null,
      // 风羽图层
      windLayer: null,
      // 图层个数
      layerNum: null,

      // 潮汐面板显隐
      tidalObj: {
        // 面板显隐
        tidalShow: false,
        // 定位 left、top
        left: null,
        top: null,
      },
      // 面板数据
      tidalData: {
        time: null,
        name: null,
        timeList: [],
        tidalList: [],
      },
      // 图表数据
      tidalCharts: {
        xdata: [],
        ydata: [],
      },
      tidalChart: null,
      // 屏幕宽高数据
      screenWidth: document.body.clientWidth,
      screenHeight: document.body.clientHeight,
      // 潮汐面板选择时间
      tidalIndex: 2,
      // 潮汐图标
      tidalIcon: null,
      tidalSelectIcon: null,
      tidalMarker: [],
      markerId: null,
      // marker和tidal信息面板共同控制
      markerMouseFlag: false,
      tidalMouseFlag: false,

      // 实况选择
      realTimeValue: null,
      realTimeOptions: [
        {
          label: "地面常规观测",
          value: "ground",
        },
        {
          label: "船舶站",
          value: "ship",
        },
        {
          label: "浮标站",
          value: "buoy",
        },
        {
          label: "海洋站",
          value: "ocean",
        },
      ],
      tyList: [],
      typhoonShow: false,
      warningLine: [],
      colorList: [
        {
          color: "#33ff26",
          title: "热带低压",
        },
        {
          color: "#2665f9",
          title: "热带风暴",
        },
        {
          color: "#ffff0a",
          title: "强热带风暴",
        },
        {
          color: "#fd8a09",
          title: "台风",
        },
        {
          color: "#f75dfe",
          title: "强台风",
        },
        {
          color: "#f61525",
          title: "超强台风",
        },
      ],
      chooseAllFlag: false,
      timer: undefined,
      tyDeletArr:[]
    };
  },
  computed: {
    ...mapState({
      // 范围
      extent: (state) => JSON.parse(JSON.stringify(state.earth.extent)),
      // 时间
      nowTime: (state) => state.time.time,
      // 当前层级
      nowLevel: (state) => state.sideBar.nowLevel,
      // 重绘次数
      imageLayerNum: (state) => state.earth.imageLayerNum,
      // 数据源
      sourceType: (state) => state.sideBar.sourceType,
    }),
  },
  watch: {
    imageLayerNum(val, old) {
      this.layerNum = val;
    },
    // 当前要素列表的变化
    currentItemList: {
      handler(val, oldval) {
        this.setMenuItemList(this.currentItemList);
        console.log("currentItemList", this.currentItemList);
      },
      deep: true,
    },
    // 当前要素的变化
    currentItem: {
      handler(val, old) {
        // this.drawItem()
      },
    },
    // 范围数组的变化
    extent: {
      // async handler(val, old) {
      async handler(val, old) {
        console.log("val", val);
        console.log("old", old);
        // flag 为 true 需要重绘
        let flag = true;

        if (old === null || val.length !== old.length) {
          flag = true;
        } else {
          for (let i = 0; i < val.length; i++) {
            if (
              val[i].xMin === old[i].xMin &&
              val[i].xMax === old[i].xMax &&
              val[i].yMin === old[i].yMin &&
              val[i].yMax === old[i].yMax
            ) {
              flag = false;
              break;
            }
          }
          this.layerNum -= 1;
          this.setImageLayerNum(this.layerNum);
        }
        if (flag) {
          this.layerNum -= 1;
          this.extentList = val;
          await this.drawItemList();
          await this.setImageLayerNum(this.layerNum);
        }
      },
      deep: true,
    },
    // 层级变化
    nowLevel(newval) {
      // 最近的层级 作为缓存，删除当前要素之后 显示前一个要素的绘制层级
      this.currentItemList[
        this.currentItemList.length - 1
      ].currentLevel = newval;
      this.currentItem.currentLevel = newval;
      this.clearLayer(this.currentItem);
      this.drawItem();
    },
    // 监听时间
    nowTime(newval) {
      const str = Number(newval[11]);
      this.day = newval.substring(0, 10);
      this.time =
        str === 0 ? newval.substring(12, 13) : newval.substring(11, 13);

      // 如果有风羽或波向重新请求数据
      let windArr = this.currentItemList.filter((item) => {
        return item.drawType === "point_wind";
      });
      let waveArr = this.currentItemList.filter((item) => {
        return item.drawType === "point_flow";
      });
      if (windArr.length) {
        windArr.forEach((item) => {
          this.clearWindWave(item);
          this.getAndDrawWind(item);
        });
      }
      if (waveArr.length) {
        waveArr.forEach((item) => {
          this.clearWindWave(item);
          this.getAndDrawWave(item);
        });
      }
      this.drawItemList();
    },
    // 监听实况选择变化
    realTimeValue(newval) {
      console.log("实况数据变化监测", newval);
      this.setRealTimeValue(newval);
    },
  },
  created() {
    this.initMenuList();
  },
  mounted() {
    // 初始化图表
    this.tidalChart = this.$echarts.init(
      document.getElementById("echarts_content")
    );
    // 初始化潮汐图标
    this.tidalIcon = this.$utilsMap.createIcon({
      iconUrl: require("@/assets/images/sidebar/station.png"),
      iconSize: [45, 45],
      popupAnchor: [40, 40],
    });
    this.tidalSelectIcon = this.$utilsMap.createIcon({
      iconUrl: require("@/assets/images/sidebar/selectStation.png"),
      iconSize: [45, 45],
      popupAnchor: [40, 40],
    });

    const that = this;
    window.onresize = () => {
      return (() => {
        // window.fullWidth = document.documentElement.offsetWidth
        // window.fullHeight = document.documentElement.offsetHeight
        window.fullWidth = document.documentElement.clientWidth;
        window.fullHeight = document.documentElement.clientHeight;
        that.screenWidth = window.fullWidth;
        that.screenHeight = window.fullHeight;
      })();
    };
  },
  methods: {
    ...mapMutations({
      setMenuItemList: "sideBar/setMenuItemList",
      setLevelList: "sideBar/setLevelList",
      setImageLayerNum: "earth/setImageLayerNum",
      setRealTimeValue: "sideBar/setRealTimeValue",
    }),
    // 潮汐面板日期切换
    changeTimeIndex(i) {
      this.tidalIndex = i;
      let time = this.tidalData.timeList[i];
      let date = new Date();
      let year = date.getFullYear();
      let t = year + "-" + time;
      this.getTidalData(this.markerId, t);
    },
    // 鼠标在面板上移入移出控制面板显隐
    tidalOver(flag) {
      this.tidalMouseFlag = flag;
      this.tidalObj.tidalShow = flag;
      // 考虑id替换
      // 获取鼠标移入的面板  根据名称判断
      let marker = this.tidalMarker.filter((item) => {
        return item.name == this.$refs.tidal_name.innerText;
      });
      console.log("this.$refs.tidal", this.$refs.tidal_name.innerText);
      if (!flag && !this.markerMouseFlag) {
        marker[0].setIcon(this.tidalIcon);
      } else {
        marker[0].setIcon(this.tidalSelectIcon);
      }
    },
    // 初始选中
    initMenuList() {
      // 初始时间
      // this.day = this.$m().format('YYYY-MM-DD')
      // this.time = this.$m().format('HH')
      /**
       * this.sourceType: 数据源类型 store sideBar中   0--EC  1--GFS
       */
      this.$get("/api/parameters/get_type", {
        type: this.sourceType,
      })
        .then((res) => {
          if (res.status == 200) {
            this.menuList = [];
            res.data.data.forEach((item) => {
              let obj = {
                id: item.id,
                flag: false,
                icon: item.iconImage,
                dataSource: item.type,
                name: item.parameterName,
                parameterMark: item.parameterMark,
                legendId: item.legendId,
                mutex: item.dataGroup,
                level: [],
                parseIntLevel: [],
                grade: null,
                gridSize: item.gridSize,
                xMin: null,
                xMax: null,
                yMin: null,
                yMax: null,
                units: item.units,
                drawType: item.drawType,
                currentLevel: null,
              };
              // 处理level
              let level = item.parameterStep.split(",");
              level.forEach((item) => {
                obj.level.push(Number(item));
              });
              // parseIntLevel 直接取整，页面显示，请求数据用原始层级数据
              level.forEach((item) => {
                if (Number(item) > 10000) {
                  obj.parseIntLevel.push(parseInt(Number(item / 100)));
                } else {
                  obj.parseIntLevel.push(parseInt(Number(item)));
                }
              });
              obj.currentLevel = obj.parseIntLevel[0];
              // 处理经纬度范围
              let lat = item.latRange.split(",");
              obj.yMin = lat[1];
              obj.yMax = lat[0];
              let lon = item.lonRange.split(",");
              obj.xMin = lon[0];
              obj.xMax = lon[1];
              // 处理格点数据抽稀
              let gradesize = 0;
              if (item.gridSize == 0.1) {
                gradesize = 10;
              } else if (item.gridSize == 0.125) {
                gradesize = 8;
              } else if (item.gridSize == 0.25) {
                gradesize = 4;
              } else {
                gradesize = 0;
              }
              obj.grade = gradesize;
              this.menuList.push(obj);
            });
          }
          console.log("数据源", this.menuList);
          this.menuList[0].flag = true;
          this.currentItemList.push(this.menuList[0]);
          this.currentItem = this.menuList[0];
          this.currentLevel = this.menuList[0].currentLevel;
          this.setLevelList(this.menuList[0].parseIntLevel);
          // 首次加载绘制默认选中的要素
          // this.drawItem()
        })
        .catch((error) => {
          this.$message.error("获取数据源数据失败");
        });
    },
    // 要素选择
    menuClick(index) {
      // 选中状态时取消选中
      if (this.menuList[index].flag) {
        // 清除单个
        this.clearLayer(this.menuList[index]);
        // 海流和风用同一个清除方法
        if (
          this.menuList[index].drawType === "point_flow" ||
          this.menuList[index].drawType === "point_wind" ||
          this.menuList[index].drawType === "point"
        ) {
          this.clearWindWave(this.menuList[index]);
        }
        if (this.menuList[index].drawType === "typhoon") {
          console.log("取消台风---------");
          this.typhoonShow = false;
          //清除台风警戒线
          this.clearWarningLine();
          //清除台风
        }

        // 取消状态、重置最近缓存的level
        this.menuList[index].flag = false;
        this.menuList[index].currentLevel = this.menuList[
          index
        ].parseIntLevel[0];
        let i = this.currentItemList.findIndex((item) => {
          return item.id == this.menuList[index].id;
        });
        if (i != -1) {
          this.currentItemList.splice(i, 1);
        }
        // 当前要素设置为当前要素列表中的最后一个
        if (this.currentItemList.length) {
          this.currentItem = this.currentItemList[
            this.currentItemList.length - 1
          ];
          this.currentLevel = this.currentItemList[
            this.currentItemList.length - 1
          ].parseIntLevel[0];
          this.setLevelList(
            this.currentItemList[this.currentItemList.length - 1].parseIntLevel
          );
        } else {
          this.currentItem = null;
          this.currentLevel = null;
          this.setLevelList([]);
        }
      } else {
        // 互斥元素添加
        if (this.menuList[index].mutex) {
          // 当前选中的要素中找到前一个互斥的要素
          let i = this.currentItemList.findIndex((item) => {
            return item.mutex == 1;
          });
          // 所有的要素中找到前一个互斥的要素
          let j = this.menuList.findIndex((item) => {
            return item.mutex && item.flag;
          });
          // 只需要判断 i，currentItemList有menulist一定有
          if (i != -1) {
            // 清除前一个互斥的要素及色斑图
            this.clearLayer(this.menuList[j]);
            this.menuList[j].flag = false;
            this.currentItemList.splice(i, 1);
          }
          this.menuList[index].flag = true;
          this.currentItemList.push(this.menuList[index]);
        } else {
          this.menuList[index].flag = true;
          this.currentItemList.push(this.menuList[index]);
        }
        // 当前要素设置为当前要素列表中的最后一个
        this.currentItem = this.currentItemList[
          this.currentItemList.length - 1
        ];
        this.currentLevel = this.currentItemList[
          this.currentItemList.length - 1
        ].parseIntLevel[0];
        this.setLevelList(
          this.currentItemList[this.currentItemList.length - 1].parseIntLevel
        );

        // 绘制当前选中的要素
        this.drawItem();
        //如果类型是台风，打开台风列表
        if (this.currentItem.drawType == "typhoon") {
          console.log("选中台风---------");
          this.drawWarning();
          //获取台风列表数据信息
          this.$get("api/typhoon").then((res) => {
            console.log(res.data.data, "台风数据信息");
            let tyData = res.data.data;
            this.tyList = [];
            tyData.forEach((item) => {
              this.tyList.push({
                id: item.id,
                choose: false,
                cycloneType: item.cycloneType,
                cycloneName: item.cycloneName,
                centerMaxSpeed: item.centerMaxSpeed,
              });
            });
            console.log(this.tyList);
            this.typhoonShow = true;
          });
        }
      }

      // 当前要素设置为当前要素列表中的最后一个
      // this.currentItem = this.currentItemList[this.currentItemList.length - 1]
      // this.currentLevel = this.currentItemList[this.currentItemList.length - 1].level[0]
    },
    // 绘制单个要素
    drawItem() {
      if (this.currentItem.drawType == "point_flow") {
        this.getAndDrawWave(this.currentItem);
      } else if (this.currentItem.drawType == "point_wind") {
        this.getAndDrawWind(this.currentItem);
      } else if (this.currentItem.drawType == "point") {
        this.getAndDrawTidal(this.currentItem);
      } else {
        // 需要根据每个要素自带的限制范围进行范围约束
        let itemExtent = {
          xMin: null,
          xMax: null,
          yMin: null,
          yMax: null,
        };
        itemExtent.xMin = this.currentItem.xMin;
        itemExtent.xMax = this.currentItem.xMax;
        itemExtent.yMin = this.currentItem.yMin;
        itemExtent.yMax = this.currentItem.yMax;
        // 存放不在要素范围内的 extentList 中的项
        let otherList = [];
        // 深拷贝，范围是列表中所有数据共用的
        let extentList = this._.cloneDeep(this.extentList);
        extentList.forEach((item, index) => {
          // 最小范围大于最大范围，直接赋值
          if (item.xMin >= itemExtent.xMax) {
            otherList.push(item);
          } else if (item.xMax <= itemExtent.xMin) {
            otherList.push(item);
          } else if (item.yMin >= itemExtent.yMax) {
            otherList.push(item);
          } else if (item.yMax <= itemExtent.yMin) {
            otherList.push(item);
          } else {
            extentList[index].xMin =
              Number(itemExtent.xMin) > Number(item.xMin)
                ? Number(itemExtent.xMin)
                : Number(item.xMin);
            extentList[index].xMax =
              Number(itemExtent.xMax) < Number(item.xMax)
                ? Number(itemExtent.xMax)
                : Number(item.xMax);
            extentList[index].yMin =
              Number(itemExtent.yMin) > Number(item.yMin)
                ? Number(itemExtent.yMin)
                : Number(item.yMin);
            extentList[index].yMax =
              Number(itemExtent.yMax) < Number(item.yMax)
                ? Number(itemExtent.yMax)
                : Number(item.yMax);
          }
        });

        // 删除不用的 extent 数据
        otherList.forEach((item, index) => {
          let i = extentList.findIndex((item1) => {
            return item1 == item;
          });
          extentList.splice(i, 1);
        });
        // 色斑图按照 -180~180 请求，
        if (this.currentItem.drawType == "layer") {
          extentList.forEach((item, index) => {
            if (item.xMax > 180) {
              extentList[index].xMin -= 360;
              extentList[index].xMax -= 360;
            }
          });
        }
        extentList.forEach((item) => {
          this.clearLayer(this.currentItem);
          if (this.currentItem.drawType == "line") {
            this.getAndDrawLine(this.currentItem, item);
          } else if (this.currentItem.drawType == "layer") {
            this.getAndDrawLayer(this.currentItem, item);
          }
        });
        console.log("extentList", extentList);
      }
    },
    // 循环绘制当前要素列表的要素
    drawItemList() {
      // 循环所有元素，根据每个元素的范围给视口范围进行调整
      this.currentItemList.forEach((currentItem) => {
        let itemExtent = {
          xMin: null,
          xMax: null,
          yMin: null,
          yMax: null,
        };
        itemExtent.xMin = currentItem.xMin;
        itemExtent.xMax = currentItem.xMax;
        itemExtent.yMin = currentItem.yMin;
        itemExtent.yMax = currentItem.yMax;
        let otherList = [];
        // 深拷贝，范围是列表中所有数据共用的
        let extentList = this._.cloneDeep(this.extentList);
        extentList.forEach((item, index) => {
          // 最小范围大于最大范围，直接赋值
          if (item.xMin >= itemExtent.xMax) {
            otherList.push(item);
          } else if (item.xMax <= itemExtent.xMin) {
            otherList.push(item);
          } else if (item.yMin >= itemExtent.yMax) {
            otherList.push(item);
          } else if (item.yMax <= itemExtent.yMin) {
            otherList.push(item);
          } else {
            extentList[index].xMin =
              Number(itemExtent.xMin) > Number(item.xMin)
                ? Number(itemExtent.xMin)
                : Number(item.xMin);
            extentList[index].xMax =
              Number(itemExtent.xMax) < Number(item.xMax)
                ? Number(itemExtent.xMax)
                : Number(item.xMax);
            extentList[index].yMin =
              Number(itemExtent.yMin) > Number(item.yMin)
                ? Number(itemExtent.yMin)
                : Number(item.yMin);
            extentList[index].yMax =
              Number(itemExtent.yMax) < Number(item.yMax)
                ? Number(itemExtent.yMax)
                : Number(item.yMax);
          }
        });

        otherList.forEach((item, index) => {
          let i = extentList.findIndex((item1) => {
            return item1 == item;
          });
          extentList.splice(i, 1);
        });
        if (currentItem.drawType === "layer") {
          extentList.forEach((item, index) => {
            if (item.xMax > 180) {
              extentList[index].xMin -= 360;
              extentList[index].xMax -= 360;
            }
          });
        }
        extentList.forEach((item) => {
          this.clearLayer(currentItem);
          if (currentItem.drawType == "line") {
            this.getAndDrawLine(currentItem, item);
          } else if (currentItem.drawType == "layer") {
            // this.clearLayer(item)
            this.getAndDrawLayer(currentItem, item);
          }
        });
        console.log(extentList);
      });

      // this.extentList.forEach(item => {
      //   this.currentItemList.forEach(item1 => {
      //     this.clearLayer(item1)
      //     if(item1.drawType == 'line') {
      //       this.getAndDrawLine(item1, item)
      //     } else if(item1.drawType == 'layer') {
      //       // this.clearLayer(item)
      //       this.getAndDrawLayer(item1, item)
      //     }
      //   })
      // })
    },
    // 获取线的数据并绘制
    getAndDrawLine(currentItem, extent) {
      let levelIndex = currentItem.parseIntLevel.findIndex((item) => {
        return item === currentItem.currentLevel;
      });
      this.$get("/api/numerical-forecast/contours", {
        day: this.day,
        grade: currentItem.grade,
        level: currentItem.level[levelIndex],
        minX: extent.xMin,
        maxX: extent.xMax,
        minY: extent.yMin,
        maxY: extent.yMax,
        // minX: 0,
        // maxX: 360,
        // minY: -75,
        // maxY: 75,
        num: 30,
        time: this.time,
        type: currentItem.id,
      })
        .then((res) => {
          if (res.status == 200) {
            let polyline = [];
            res.data.data.forEach((item) => {
              let linedata = [];
              item.PointList.forEach((item1) => {
                let latlng = [];
                latlng.push(item1.Y);
                latlng.push(item1.X);
                latlng.push(Math.round(item.Value / 100));
                linedata.push(latlng);
              });

              polyline.push(linedata);
            });
            let line = new PressureLayer(
              {},
              {
                data: polyline,
                hlData: [],
              }
            ).addTo(window.map);
            line.id = currentItem.id;
            this.lineList.push(line);
          }
        })
        .catch((error) => {
          this.$message.error("获取" + currentItem.name + "数据失败");
        });
    },
    // 绘制色斑图
    async getAndDrawLayer(currentItem, extent) {
      let levelIndex = currentItem.parseIntLevel.findIndex((item) => {
        return item === currentItem.currentLevel;
      });
      console.log(this.day);
      console.log(this.time);
      try {
        let test = await this.$getbuffer(
          "/api/numerical-forecast/mercator-polygonsImage",
          {
            // this.$getbuffer('/api/numerical-forecast/polygonsImage', {
            day: this.day,
            grade: currentItem.grade,
            level: currentItem.level[levelIndex],
            minX: extent.xMin,
            maxX: extent.xMax,
            minY: extent.yMin,
            maxY: extent.yMax,
            num: 20,
            time: this.time,
            type: currentItem.id,
          },
          { responseType: "arraybuffer" }
        );

        const img = this.toImage(test);
        // let ex = this._.cloneDeep(extent)
        // if(extent.xMax == 360) {
        //   ex.xMin = extent.xMin - 360
        //   ex.xMax = extent.xMax - 360
        // }
        let bounds = L.latLngBounds(
          L.latLng(extent.yMin, extent.xMin),
          L.latLng(extent.yMax, extent.xMax)
        );
        let bounds1 = L.latLngBounds(
          L.latLng(extent.yMin, extent.xMin + 360),
          L.latLng(extent.yMax, extent.xMax + 360)
        );
        let bounds2 = L.latLngBounds(
          L.latLng(extent.yMin, extent.xMin - 360),
          L.latLng(extent.yMax, extent.xMax - 360)
        );
        if (img) {
          let imageLayer = L.imageOverlay(img, bounds);
          imageLayer.id = currentItem.id;
          imageLayer.on("add", (ev) => {
            console.log("加载完成", ev);
            if (this.imageLayerNum >= 0) {
              window.map.removeLayer(imageLayer);
            }
            console.log(this.layerNum);
            // this.setImageLayerNum(this.layerNum)
          });
          imageLayer.addTo(window.map);
          console.log(imageLayer);
          this.layerList.push(imageLayer);
          let imageLayer1 = L.imageOverlay(img, bounds1);
          imageLayer1.id = currentItem.id;
          imageLayer1.on("add", (ev) => {
            if (this.imageLayerNum >= 0) {
              window.map.removeLayer(imageLayer1);
            }
          });
          imageLayer1.addTo(window.map);
          this.layerList.push(imageLayer1);
          let imageLayer2 = L.imageOverlay(img, bounds2).addTo(window.map);
          imageLayer2.id = currentItem.id;
          imageLayer2.on("add", (ev) => {
            if (this.imageLayerNum >= 0) {
              window.map.removeLayer(imageLayer2);
            }
            // this.setImageLayerNum(this.layerNum)
          });
          imageLayer2.addTo(window.map);
          this.layerList.push(imageLayer2);
        }
      } catch (error) {
        this.$message.error("获取" + currentItem.name + "数据失败");
      }

      // test.then(res => {
      //   if(res.status == 200) {
      //     return (
      //       'data:image/png;base64,' +
      //       btoa(
      //         new Uint8Array(res.data).reduce(
      //           (data, byte) => data + String.fromCharCode(byte),
      //           ''
      //         )
      //       )
      //     )
      //   }
      // }).then((data) => {
      //   const img = data
      //   // let ex = this._.cloneDeep(extent)
      //   // if(extent.xMax == 360) {
      //   //   ex.xMin = extent.xMin - 360
      //   //   ex.xMax = extent.xMax - 360
      //   // }
      //   let bounds = L.latLngBounds(L.latLng(extent.yMin, extent.xMin), L.latLng(extent.yMax, extent.xMax))
      //   let bounds1 = L.latLngBounds(L.latLng(extent.yMin, extent.xMin + 360), L.latLng(extent.yMax, extent.xMax + 360))
      //   let bounds2 = L.latLngBounds(L.latLng(extent.yMin, extent.xMin - 360), L.latLng(extent.yMax, extent.xMax - 360))
      //   if (img) {
      //     let imageLayer = L.imageOverlay(img, bounds)
      //     imageLayer.id = currentItem.id
      //     imageLayer.on('add', ev => {
      //       console.log('加载完成', ev)
      //       if(this.imageLayerNum >= 1) {
      //         window.map.removeLayer(imageLayer)
      //       }
      //       console.log(this.layerNum)
      //       // this.setImageLayerNum(this.layerNum)
      //     })
      //     imageLayer.addTo(window.map)
      //     console.log(imageLayer)
      //     this.layerList.push(imageLayer)
      //     let imageLayer1 = L.imageOverlay(img, bounds1)
      //     imageLayer1.id = currentItem.id
      //     imageLayer1.on('add', ev => {
      //       if(this.imageLayerNum >= 1) {
      //         window.map.removeLayer(imageLayer1)
      //       }
      //     })
      //     imageLayer1.addTo(window.map)
      //     this.layerList.push(imageLayer1)
      //     let imageLayer2 = L.imageOverlay(img, bounds2).addTo(window.map)
      //     imageLayer2.id = currentItem.id
      //     imageLayer2.on('add', ev => {
      //       if(this.imageLayerNum >= 1) {
      //         window.map.removeLayer(imageLayer2)
      //       }
      //       // this.setImageLayerNum(this.layerNum)
      //     })
      //     imageLayer2.addTo(window.map)
      //     this.layerList.push(imageLayer2)
      //   }
      // }).catch(error => {
      //   this.$message.error("获取" + currentItem.name + "数据失败")
      // })
    },
    // 接收图像转base64
    toImage(res) {
      return (
        "data:image/png;base64," +
        btoa(
          new Uint8Array(res.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        )
      );
    },
    getAndDrawWind(currentItem, extent) {
      let levelIndex = currentItem.parseIntLevel.findIndex((item) => {
        return item === currentItem.currentLevel;
      });
      this.$get("/api/numerical-forecast/wind", {
        day: this.day,
        level: currentItem.level[levelIndex],
        time: this.time,
        grade: 0,
        type: currentItem.id,
      })
        .then((res) => {
          if (res.status == 200) {
            console.log("wind--res", res.data.data);
            if (res.status == 200) {
              let windList = res.data.data;

              var config = {
                lat: "0",
                lng: "1",
                value: "2",
                dir: "3",
                data: windList,
              };
              this.windLayer = new WindLayer({}, config);
              this.windLayer.id = currentItem.id;
              window.map.addLayer(this.windLayer);
            }
          }
        })
        .catch((error) => {
          this.$message.error("获取" + currentItem.name + "数据失败");
        });
    },
    // 绘制 洋流\波向
    getAndDrawWave(currentItem) {
      this.$get("/api/numerical-forecast/wave", {
        day: this.day,
        time: this.time,
        type: currentItem.id,
      })
        .then((res) => {
          console.log("wave--res", res.data.data);
          if (res.status == 200) {
            let gridSize = currentItem.gridSize;
            let xMin = currentItem.xMin;
            let xMax = currentItem.xMax;
            let yMin = currentItem.yMin;
            let yMax = currentItem.yMax;
            // waveList 构造数组 361 * 720 [lat, lng, value, dir]
            let waveList = [];
            let data = res.data.data;
            for (let i = 0; i < data.length; i++) {
              let latlngList = [];
              for (let j = 0; j < data[i].length; j++) {
                let arr = [];
                arr.push(Number(yMax) - i * gridSize);
                if (Number(xMin) + j * gridSize > 180) {
                  arr.push(Number(xMin) + j * gridSize - 360);
                } else {
                  arr.push(Number(xMin) + j * gridSize);
                }
                if (data[i][j] != "") {
                  let temp = data[i][j].split(",");
                  arr.push(temp[0]);
                  arr.push(temp[1]);
                } else {
                  arr.push("");
                  arr.push("");
                }
                latlngList.push(arr);
              }
              waveList.push(latlngList);
            }
            console.log("waveList", waveList);

            var config = {
              lat: "0",
              lng: "1",
              value: "2",
              dir: "3",
              data: waveList,
            };
            this.waveLayer = new FlowLayer({}, config);
            this.waveLayer.id = currentItem.id;
            window.map.addLayer(this.waveLayer);
          }
        })
        .catch((error) => {
          this.$message.error("获取" + currentItem.name + "数据失败");
        });
    },
    // 绘制潮汐
    getAndDrawTidal(currentItem) {
      // 先绘制港口数据
      this.$get("/api/harbor")
        .then((res) => {
          if (res.status == 200) {
            console.log("harbor", res.data.data);
            let harborList = res.data.data.rows;
            harborList.forEach((item) => {
              this.createMarker(item);
            });
          }
        })
        .catch((error) => {
          this.$message.error(
            this.$message.error("获取" + currentItem.name + "数据失败")
          );
        });
    },
    // 根据港口数据创建marker
    createMarker(harbor) {
      // let icon = this.$utilsMap.createIcon({
      //   iconUrl: require('@/assets/images/sidebar/station.png'),
      //   iconSize: [45, 45],
      //   popupAnchor: [40, 40]
      // })
      // let selectIcon = this.$utilsMap.createIcon({
      //   iconUrl: require('@/assets/images/sidebar/selectStation.png'),
      //   iconSize: [45, 45],
      //   popupAnchor: [40, 40]
      // })
      let marker = this.$utilsMap.createMarkerByLatlng(
        window.map,
        [harbor.lat, harbor.lon],
        {
          icon: this.tidalIcon,
          title: harbor.hname,
        }
      );
      marker.harborId = harbor.id;
      marker.name = harbor.hname;
      marker.id = this.currentItem.id;
      marker.on("mouseover", (ev) => {
        // 移入marker置为true
        this.markerMouseFlag = true;
        this.markerId = ev.target.harborId;
        // 请求潮汐数据
        let time = this.day;
        if (!this.tidalMouseFlag) {
          this.getTidalData(harbor.id, time);
        }

        console.log("mouseover", ev);
        // ev.target.   构造数据
        this.tidalData.time = this.time;
        this.tidalData.name = ev.target.name;
        // 前三天日期数据
        this.tidalIndex = 2; // 重置选择的日期
        this.tidalData.timeList = [];
        let now = this.$m(this.time).format("MM-DD");
        let yestoday = this.$m(this.time)
          .subtract(1, "days")
          .format("MM-DD");
        let lastday = this.$m(this.time)
          .subtract(2, "days")
          .format("MM-DD");
        this.tidalData.timeList.push(lastday);
        this.tidalData.timeList.push(yestoday);
        this.tidalData.timeList.push(now);

        // 潮汐面板显示并重新定位
        this.tidalObj.tidalShow = true;
        this.tidalObj.left = ev.containerPoint.x;
        this.tidalObj.top = ev.containerPoint.y - 50;
        marker.setIcon(this.tidalSelectIcon);
        this.$nextTick(() => {
          // let width = document.querySelector('.tidal').offsetWidth
          // let height = this.$refs.tidal.clientHeight
          let width = this.$refs.tidal.offsetWidth;
          let height = this.$refs.tidal.offsetHeight;
          // 都在屏幕范围内
          if (
            this.screenWidth - ev.containerPoint.x > width + 50 &&
            this.screenHeight - ev.containerPoint.y > height + 50
          ) {
            this.tidalObj.left = ev.containerPoint.x + 10;
            this.tidalObj.top = ev.containerPoint.y - 50;
          } else if (this.screenWidth - ev.containerPoint.x > width + 50) {
            // 高度超出屏幕
            let offHeight = height - (this.screenHeight - ev.containerPoint.y);
            this.tidalObj.left = ev.containerPoint.x + 10;
            this.tidalObj.top = ev.containerPoint.y - offHeight - 50;
          } else if (this.screenHeight - ev.containerPoint.y > height + 50) {
            // 宽度超出屏幕
            let offWidth = width - (this.screenWidth - ev.containerPoint.x);
            this.tidalObj.left = ev.containerPoint.x - width - 10;
            this.tidalObj.top = ev.containerPoint.y + 10;
          } else {
            // 宽度、高度都超出屏幕
            let offWidth = width - (this.screenWidth - ev.containerPoint.x);
            let offHeight = height - (this.screenHeight - ev.containerPoint.y);
            this.tidalObj.left = ev.containerPoint.x - width - 10;
            this.tidalObj.top = ev.containerPoint.y - offHeight - 50;
          }
        });
      });
      marker.on("mouseout", (ev) => {
        this.markerMouseFlag = false;
        if (!this.tidalMouseFlag) {
          marker.setIcon(this.tidalIcon);
          this.tidalObj.tidalShow = false;
        }
      });
      this.tidalMarker.push(marker);
      // marker.on('click', ev => {
      //   console.log('harbor--click', harbor);
      //   this.tidalObj.left = 500
      //   this.tidalObj.top = 300
      //   this.tidalObj.tidalShow = true
      // })
    },
    getTidalData(id, time) {
      this.$get("/api/tidal/one", {
        id: id,
        localDate: time,
      })
        .then((res) => {
          if (res.status == 200) {
            let tidalList = res.data.data;
            console.log("tidalList", tidalList);
            this.tidalData.tidalList = [];
            let time = null;
            this.clearChart();
            this.createChart(this.tidalCharts);
            if (
              tidalList.length &&
              tidalList != null &&
              tidalList != undefined
            ) {
              // 最大值和最小值
              let maxObj = tidalList[0];
              let minObj = tidalList[0];
              for (let i = 0; i < tidalList.length; i++) {
                if (maxObj.height < tidalList[i].height) {
                  maxObj = tidalList[i];
                }
                if (minObj.height > tidalList[i].height) {
                  minObj = tidalList[i];
                }
                let time = this.$m(tidalList[i].tidalTime).format("HH");
                this.tidalCharts.xdata.push(time);
                this.tidalCharts.ydata.push(tidalList[i].height);
              }
              // 绘制图表
              this.createChart(this.tidalCharts);
              console.log("xdata", this.tidalCharts.xdata);
              console.log("ydata", this.tidalCharts.ydata);
              this.tidalData.tidalList.push(this._.cloneDeep(maxObj));
              time = this.$m(this.tidalData.tidalList[0].tidalTime).format(
                "hh-mm"
              );
              this.tidalData.tidalList[0].tidalTime =
                time.split("-")[0] + "时" + time.split("-")[1] + "分";
              this.tidalData.tidalList[0].name = "第一高潮";
              this.tidalData.tidalList[0].type = "max";
              this.tidalData.tidalList.push(this._.cloneDeep(minObj));
              time = this.$m(this.tidalData.tidalList[1].tidalTime).format(
                "hh-mm"
              );
              this.tidalData.tidalList[1].tidalTime =
                time.split("-")[0] + "时" + time.split("-")[1] + "分";
              this.tidalData.tidalList[1].name = "第一低潮";
              this.tidalData.tidalList[1].type = "min";
              console.log("tidalList", this.tidalData.tidalList);
            } else {
              this.$message.warning("此时刻暂无潮汐数据");
            }
          } else {
            this.$message.warning("此时刻暂无潮汐数据");
          }
        })
        .catch((error) => {
          this.$message.error("获取潮汐数据失败");
        });
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
    // 清除图表数据
    clearChart() {
      this.tidalCharts.xdata = [];
      this.tidalCharts.ydata = [];
    },
    // 清除
    clearLayer(layer) {
      if (layer.drawType === "line" && this.lineList.length) {
        let arr = this.lineList.filter((item) => {
          return item.id == layer.id;
        });
        arr.forEach((item) => {
          let i = this.lineList.findIndex((item1) => {
            return item1.id == item.id;
          });
          map.removeLayer(this.lineList[i]);
          this.lineList.splice(i, 1);
        });
      }

      if (layer.drawType === "layer" && this.layerList.length) {
        let arr = this.layerList.filter((item) => {
          return item.id == layer.id;
        });
        arr.forEach((item) => {
          let i = this.layerList.findIndex((item1) => {
            return item1.id == item.id;
          });
          map.removeLayer(this.layerList[i]);
          this.layerList.splice(i, 1);
        });
      }

      // if(layer.drawType === 'point_flow' && (this.waveLayer !== null)) {
      //   map.removeLayer(layer)
      //   this.waveLayer = null
      // }
    },
    // wind、wave使用了自动重绘，需要单独清除
    clearWindWave(layer) {
      if (layer.drawType === "point_flow" && this.waveLayer !== null) {
        map.removeLayer(this.waveLayer);
        this.waveLayer = null;
      } else if (layer.drawType === "point_wind" && this.windLayer !== null) {
        map.removeLayer(this.windLayer);
        this.windLayer = null;
      } else if (layer.drawType === "point" && this.tidalMarker !== null) {
        let tidal = this.tidalMarker.filter((item) => {
          return item.id === layer.id;
        });
        tidal.forEach((item) => {
          map.removeLayer(item);
        });
        this.tidalMarker = [];
      }
    },

    //绘制台风警戒线
    drawWarning() {
      let latlngs24 = [
        [34, 127],
        [22, 127],
        [18, 119],
        [11, 119],
        [4.5, 113],
        [0, 105],
      ];

      let latlngs48 = [
        [34, 132],
        [15, 132],
        [0, 120],
        [0, 105],
      ];
      this.warningLine = [];
      let lin1 = L.polyline(latlngs24, { color: "red" }).addTo(map);
      let lin2 = L.polyline(latlngs48, { color: "blue", dashArray: 5 }).addTo(
        map
      );
      this.warningLine.push(lin1, lin2);

      let myIcon = L.divIcon({
        html: "<div>24小时警戒线</div>",
        className: "my-div-icon",
        iconSize: 50,
      });
      let mark1 = L.marker([32, 127], { icon: myIcon }).addTo(map);

      let myIcon1 = L.divIcon({
        html: "<div>48小时警戒线</div>",
        className: "my-div-icon1",
        iconSize: 50,
      });
      let mark2 = L.marker([32, 132], { icon: myIcon1 }).addTo(map);
      this.warningLine.push(mark1, mark2);
    },

    clearWarningLine() {
      this.warningLine.forEach((item) => {
        map.removeLayer(item);
      });
    },

    //台风列表全选功能
    chooseAll() {
      //全选时，取消全选
      if (this.chooseAllFlag) {
        this.chooseAllFlag = false;
        let chooseArr = [];
        this.tyList.forEach((item, index) => {
          if (item.choose) {
            item.choose = false;
            chooseArr.push(index);
          }
        });
        console.log(chooseArr, "取消的集合");
        //点击全选
      } else {
        this.chooseAllFlag = true;
        let chooseArr = [];
        this.tyList.forEach((item, index) => {
          if (!item.choose) {
            item.choose = true;
            chooseArr.push(index);
          }
        });
        console.log(chooseArr, "选中的集合");
      }
    },

    //选择单个台风时
    chooseOne(item, index) {
      console.log(item, index);
      //如果点击之前是选中状态，则取消选中，并删除画的该条台风
      if (item.choose) {
        item.choose = false;
        //如果所有的都变为未选中，则将全选置为false
        let i = this.tyList.findIndex((item) => {
          return item.choose == true;
        });
        if ((i = -1)) {
          this.chooseAllFlag = false;
        }
        this.deleteTy(item.id)
        //点击之前是未选中状态时，则选中，并绘制该条台风
      } else {
        item.choose = true;
        //如果所有的都变为选中，则将全选置为true
        let i = this.tyList.findIndex((item) => {
          return item.choose == false;
        });
        if ((i = -1)) {
          this.chooseAllFlag = true;
        }
        this.drawTy(item.id);
      }
    },

    //根据id查询台风数据并绘制台风
    drawTy(id) {
      //根据id查询台风数据
      this.$get("api/typhoon/one", {
        id: id,
      }).then((res) => {
        console.log(res.data.data, "单个台风的数据");
        let trackList = res.data.data.trackList;
        trackList.forEach((item) => {
          if (item.centerMaxSpeed >= 10.8 && item.centerMaxSpeed <= 17.1) {
            item.color = "#33ff26";
          } else if (
            item.centerMaxSpeed >= 17.2 &&
            item.centerMaxSpeed <= 24.4
          ) {
            item.color = "#2665f9";
          } else if (
            item.centerMaxSpeed >= 24.5 &&
            item.centerMaxSpeed <= 32.6
          ) {
            item.color = "#ffff0a";
          } else if (
            item.centerMaxSpeed >= 32.7 &&
            item.centerMaxSpeed <= 41.4
          ) {
            item.color = "#fd8a09";
          } else if (
            item.centerMaxSpeed >= 41.5 &&
            item.centerMaxSpeed <= 50.9
          ) {
            item.color = "#f75dfe";
          } else if (item.centerMaxSpeed >= 51) {
            item.color = "#f61525";
          }
        });
        console.log(trackList, "台风点----------");
        let circle = L.circleMarker([trackList[0].lat, trackList[0].lon], {
          // id: id,
          radius: 6,
          fillOpacity: 1,
          fillColor: trackList[0].color,
          weight: 0,
        }).addTo(map);
        circle.id = id
        this.tyDeletArr.push(circle)

        let i = 0;
        let that = this;
        function test() {
          if (i < trackList.length - 1) {
            that.timer = setTimeout(() => {
              let latlngs = [
                [trackList[i].lat, trackList[i].lon],
                [trackList[i + 1].lat, trackList[i + 1].lon],
              ];
              let polyline = L.polyline(latlngs, { color: "#666666" }).addTo(
                map
              );
              polyline.id = id
              that.tyDeletArr.push(polyline)
              let circle = L.circleMarker(
                [trackList[i + 1].lat, trackList[i + 1].lon],
                {
                  // id:id,
                  radius: 6,
                  fillOpacity: 1,
                  fillColor: trackList[i + 1].color,
                  weight: 0,
                }
              ).addTo(map);
              circle.id = id
              that.tyDeletArr.push(circle)
              i++;
              test();
            }, 200);
          } else {
            clearTimeout(that.timer);
            i = 0;
          }
        }
        test();
      });
    },

    //根据id清除台风
    deleteTy(id){
      console.log(this.tyDeletArr);
      this.tyDeletArr.forEach((item,index)=>{
        if(item.id==id){
          map.removeLayer(item)
          // this.tyDeletArr.splice(index,1)
        }
      })
      for(let i=0;i<this.tyDeletArr.length;i++){
        if(this.tyDeletArr[i].id==id){
          this.tyDeletArr.splice(i,1)
          i--
        }
      }
      console.log(this.tyDeletArr);
    },

    //删除全部台风
    deleteAllTy(){
      this.tyDeletArr.forEach(item=>{
        map.removeLayer(item)
      })
      this.tyDeletArr = []
    }
  },
};
</script>
<style scoped lang="scss">
/* 设置滚动条的样式 */
::-webkit-scrollbar {
  width: 4px;
  background-color: rgba(0, 0, 0, 0.5);
}

/* 滚动槽 */
::-webkit-scrollbar-track {
  border-radius: 10px;
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: rgba(240, 240, 240, 0.6);
}

#sideBar {
  z-index: 999;
}
.leaflet-marker-pane .leaflet-div-icon {
  background: none !important;
  border: none !important;
}
</style>
<style lang="scss">
.my-div-icon {
  color: red;
  // writing-mode: vertical-rl;
  width: 20px !important;
  margin-left: 10px !important;
  margin: 0 auto;
  line-height: 24px;
  // font-size: 14px;
}
.my-div-icon1 {
  color: blue;
  // writing-mode: vertical-rl;
  width: 20px !important;
  margin-left: 10px !important;
  margin: 0 auto;
  line-height: 24px;
  // font-size: 14px;
}
</style>
