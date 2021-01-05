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
          <!-- 风羽、波向显示 -->
          <div
            :class="{ menu_left: true, bg_color: item.windWaveFlag }"
            v-if="item.windWave !== 'other' && item.flag"
            @click.stop="changeWindWave(index)"
          >
            {{ item.windWaveName }}
          </div>

          <div :class="{ menu_left: true, bg_color: item.flag }">
            {{ item.name }}
          </div>
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

    <!-- 重绘/刷新-位置2 -->
    <!-- <div  @click="changeDrawFlag" >
      <el-tooltip class="draw" :class="{ draw_active: drawFlag }" effect="light" content="重绘底图" placement="bottom">
        <img src="@/assets/images/sidebar/draw.svg" />
      </el-tooltip>
    </div>
    <div @click.stop="reloadTime">
      <el-tooltip class="reload"  effect="light" content="刷新时间" placement="bottom">
        <img src="@/assets/images/sidebar/reload.svg" />
      </el-tooltip>
    </div> -->

    <!--  定位按钮 -->
    <div class="other_btn">
      <div class="isSwitch" v-if="windSwitchflag">
        <el-switch
          v-model="windSwitch"
          active-text="风"
          active-color="#fa5433"
          class="el_switch"
        >
        </el-switch>
      </div>
      <div class="isSwitch" v-if="waveSwitchflag">
        <el-switch
          v-model="waveSwitch"
          active-text="海浪"
          active-color="#fa5433"
          class="el_switch"
        >
        </el-switch>
      </div>
      <div class="latlng">
        <img src="@/assets/images/sidebar/position.svg" />
        <div class="other_lat">{{ latNum }}</div>
        <div class="other_lon">,{{ lonNum }}</div>
      </div>
      <!-- 重绘刷新位置1 -->
      <div
        class="isDraw"
        :class="{ draw_active: drawFlag }"
        @click="changeDrawFlag"
      >
        <img src="@/assets/images/sidebar/draw.svg" />重绘底图
      </div>
      <div class="re_time" @click.stop="reloadTime">
        <img src="@/assets/images/sidebar/reload.svg" />刷新时间
      </div>
    </div>

    <!-- 卫星云图 和 实况资料样式一样-->
    <div class="fyType">
      <el-select
        v-model="fyType"
        clearable
        placeholder="卫星云图"
        size="small"
        popper-class="fy_select"
      >
        <el-option
          v-for="item in fyTypeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
          <div class="fy_option">
            <div class="fy_dot"></div>
            <span>{{ item.label }}</span>
          </div>
        </el-option>
      </el-select>
    </div>

    <!-- 实况资料 -->
    <div class="real_time_data">
      <el-select
        v-model="realTimeValue"
        clearable
        placeholder="实况资料"
        size="small"
        popper-class="real_select"
      >
        <el-option
          v-for="item in realTimeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
          <div class="real_option">
            <img
              :src="realTimeValue == item.value ? item.selectIcon : item.icon"
            />
            <span>{{ item.label }}</span>
          </div>
        </el-option>
      </el-select>
    </div>

    <!-- 台风显示 -->
    <div class="tylist" v-if="typhoonShow">
      <div class="select_wrapper">
        <div class="item_desc">年份</div>
        <div class="item_select">
          <select v-model="selectDate">
            <option v-for="(item, index) in dateList" :key="index" :value="item">
              {{ item }} 年
            </option>
          </select>
        </div>
      </div>
      <div class="tytitle">
        <div class="chooseAll" @click="chooseAll">
          <img
            :src="
              this.chooseAllFlag
                ? require('@/assets/images/sidebar/checked1.png')
                : require('@/assets/images/sidebar/choose1.png')
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
                    ? require('@/assets/images/sidebar/checked1.png')
                    : require('@/assets/images/sidebar/choose1.png')
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
    <div class="color_box">
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
      <!-- 风险评估图例 -->
      <div class="assess_color" v-if="assessLegendShow">
        <p class="assess_title">评估等级</p>
        <div class="color">
          <ul>
            <li
              v-for="(item, index) in assessColor.color"
              :key="index"
              :style="{
                background: item,
              }"
              :data-value="assessColor.value[index]"
            />
          </ul>
          <div class="info">
            <div class="first">可行</div>
            <div class="second">临界</div>
            <div class="third">禁止</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 站点填图图例 -->
    <div class="color_box_station">
      <div
        class="ty_color"
        v-if="
          realTimeValue === 'ship' ||
            realTimeValue === 'buoy' ||
            realTimeValue === 'ocean'
        "
      >
        <div class="thunder_left_ship" v-if="realTimeValue === 'ship'">
          <img src="@/assets/images/legendbar/wind.png" />
          <span>时间</span>
          <span>气温</span>
          <span>气压</span>
        </div>
        <div class="thunder_left_buoy" v-if="realTimeValue === 'buoy'">
          <img src="@/assets/images/legendbar/wind.png" />
          <span>气温</span>
          <span>能见度</span>
          <span>相对湿度</span>
          <span>水温</span>
          <span>周期</span>
          <span>浪高</span>
          <span>气压</span>
          <span>时间</span>
        </div>
        <div class="thunder_left_ocean" v-if="realTimeValue === 'ocean'">
          <img src="@/assets/images/legendbar/wind.png" />
          <span>气温</span>
          <span>能见度</span>
          <span>水温</span>
          <span>周期</span>
          <span>浪高</span>
          <span>气压</span>
          <span>时间</span>
        </div>
      </div>
    </div>
    <!-- 台风信息弹框 -->
    <!-- <div class="ty_infobox">
      <div class="info_title">VAMCO</div>
      <div class="info_content">
        <div>时间: 2020-11-20 06:00</div>
        <div>纬度: 16.2</div>
        <div>经度: 120.5</div>
        <div>中心气压: 995</div>
        <div>最大速度: 20</div>
      </div>
    </div> -->

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

import "leaflet-velocity/dist/leaflet-velocity.min.css";
import "leaflet-velocity";
// 色斑图图层
let layerGroup = L.layerGroup();
// 风羽图层
let windGroup = L.layerGroup();
// 波向图层
let waveGroup = L.layerGroup();
// 卫星云图
let fyTypeGroup = L.layerGroup();
// 风场粒子
let windParticleLayer = undefined;
// 波向粒子
let waveParticleLayer = undefined;
export default {
  components: {
    LevelBar: LevelBar,
  },
  data() {
    return {
      // 选中的年份
      selectDate: 2020,
      dateList: [],
      firstFlag: true,
      // 日期、小时
      day: null,
      time: null,
      // 菜单列表数组
      menuList: [
        {
          id: 0,
          img: require("@/assets/images/sidebar/temperature.svg"),
          name: "温度",
          type: "temperature",
          flag: 0,
          stationType: true,
          gridType: false,
          mutex: 1,
        },
        {
          id: 1,
          img: require("@/assets/images/sidebar/pressure.svg"),
          name: "气压",
          type: "pressure",
          flag: 0,
          stationType: true,
          gridType: false,
          mutex: 0,
        },
        {
          id: 2,
          img: require("@/assets/images/sidebar/humidity.svg"),
          name: "湿度",
          type: "humidity",
          flag: 0,
          stationType: true,
          gridType: false,
          mutex: 1,
        },
        {
          id: 3,
          img: require("@/assets/images/sidebar/wind.svg"),
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
          img: require("@/assets/images/sidebar/geopotential.svg"),
          name: "位势高度",
          type: "rain",
          flag: 0,
          stationType: true,
          gridType: false,
          mutex: 0,
        },
        {
          id: 6,
          img: require("@/assets/images/sidebar/humidity.svg"),
          name: "相对湿度",
          type: "thunder",
          flag: 0,
          stationType: true,
          gridType: false,
          mutex: 1,
        },
        {
          id: 7,
          img: require("@/assets/images/sidebar/pressure.svg"),
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
      oldZoom: 4,
      // 海流图层
      // waveGroup: L.layerGroup(),
      // 风羽图层
      windList: [],
      // windGroup: L.layerGroup(),
      // 图层个数
      layerNum: 0,
      // layerGroup: L.layerGroup(),

      tidalObj: {
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
      // 潮汐图标
      tidalIcon: null,
      tidalSelectIcon: null,
      tidalMarker: [],
      markerId: null,
      // marker和tidal信息面板共同控制
      markerMouseFlag: false,
      tidalMouseFlag: false,

      // 重绘
      drawFlag: false,

      // 卫星云图
      fyTypeOptions: [
        {
          value: "channel3",
          label: "可见光",
        },
        {
          value: "channel12",
          label: "红外",
        },
        {
          value: "true_colors",
          label: "红外增强",
        },
      ],
      fyType: null,
      // fyTypeGroup: L.layerGroup(),

      // 实况选择
      realImgSrc: "",
      realTimeValue: null,
      realTimeOptions: [
        {
          label: "地面常规观测",
          value: "ground",
          icon: require("@/assets/images/sidebar/ground.svg"),
          selectIcon: require("@/assets/images/sidebar/redground.svg"),
        },
        {
          label: "船舶站",
          value: "ship",
          icon: require("@/assets/images/sidebar/ship.svg"),
          selectIcon: require("@/assets/images/sidebar/redship.svg"),
        },
        {
          label: "浮标站",
          value: "buoy",
          icon: require("@/assets/images/sidebar/buoy.svg"),
          selectIcon: require("@/assets/images/sidebar/redbuoy.svg"),
        },
        {
          label: "海洋站",
          value: "ocean",
          icon: require("@/assets/images/sidebar/ocean.svg"),
          selectIcon: require("@/assets/images/sidebar/redocean.svg"),
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
      // timer: undefined,
      tyDeletArr: [],
      flag: true,

      // 经纬数据
      latNum: 0,
      lonNum: 0,

      //风险评估图例色值
      assessColor: {
        color: ["#00ff00", "#ffff00", "#ff8000", "#9919e5", "#ff0000"],
        // value:["0","0.2","0.4","0.6","0.8"]
        value: ["很好", "好", "中", "差", "很差"],
      },
      //风粒子动画开关
      windSwitch: false,
      //是否显示风粒子动画开关
      windSwitchflag: false,
      //风场粒子图层，用于删除
      // windParticleLayer: undefined,
      //处理后的风场粒子数据
      windData: [],
      //海浪粒子动画开关
      waveSwitch: false,
      //是否显示海浪粒子动画开关
      waveSwitchflag: false,
      //海浪粒子图层，用于删除
      // waveParticleLayer: undefined,
      //处理后的海浪粒子动画
      waveData: [],

      // 风羽、洋流详细信息数组
      windWaveList: [],
      // 当前windWave
      currentWindWave: null,
      // 站点填图图例
      stationLegendList: {
        ship: [],
        buoy: [],
        ocean: [],
      },
      
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
      // 数据源
      sourceType: (state) => state.sideBar.sourceType,
      assessLegendShow: (state) => state.menuBar.assessLegendShow,
      // 潮汐面板切换日期
      changeDateIndex: (state) => state.clickup.changeDateIndex,
      // 潮汐面板隐藏
      tidalShow: (state) => state.clickup.tidalShow,
      // 起报时间
      timeForcast: (state) => state.time.timeForcast,
    }),
  },
  watch: {
    selectDate(val) {
      console.log(val, `年份`);
      this.loadTyphoon();
    },
    timeForcast(newval) {
      console.log(newval);
    },
    // 当前要素列表的变化
    currentItemList: {
      handler(val, oldval) {
        this.setMenuItemList(this.currentItemList);
        console.log("currentItemList", this.currentItemList);
        let index1 = val.findIndex((item) => {
          return (
            item.parameterMark == "U_V_component_of_wind" ||
            item.parameterMark === "U_V_component_of_wind_ground"
          );
        });
        let index2 = val.findIndex((item) => {
          return (
            item.parameterMark == "ec_wave_height" ||
            item.parameterMark === "waves_direction"
          );
        });
        if (index1 != -1) {
          this.windSwitchflag = true;
        } else {
          this.windSwitchflag = false;
          //重置开关状态
          this.windSwitch = false;
        }
        if (index2 != -1) {
          this.waveSwitchflag = true;
        } else {
          this.waveSwitchflag = false;
          //重置开关状态
          this.waveSwitch = false;
        }
      },
      deep: true,
    },
    // 当前要素的变化，用来改变风羽、波向的绘制，不用于其他，没有冲突
    currentItem: {
      handler(val, old) {
        console.log("currentItem---", val);
        if (val.windWaveFlag) {
          this.clearWindOrWave(val);
          this.findAndDrawWindWave(val, val.currentLevel);

          console.log(this.currentWindWave);
          // 绘制
        }
      },
      deep: true,
    },
    // 范围数组的变化
    extent: {
      handler(val, old) {
        console.log("val", val);
        console.log("old", old);
        // flag 为 true 标识区域变化，需要重绘
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
        }
        // 解决不重绘时，直接跳到小于3层底图时不能再重绘的问题
        let zoom = window.map.getZoom();
        if (zoom <= 3 && this.oldZoom > 3) {
          flag = true;
        }

        if (flag) {
          this.extentList = val;
          // drawFlag 控制重绘的按钮
          if (this.drawFlag) {
            this.drawItemList();
          }
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
      if (
        this.currentItem.drawType == "point_flow" ||
        this.currentItem.drawType == "point_wind"
      ) {
        this.clearWindWave(this.currentItem);
      } else if (this.currentItem.drawType == "layer") {
        this.clearLayer(this.currentItem);
      }
      this.drawItem();
      if (
        this.currentItemList[this.currentItemList.length - 1].name == "风场"
      ) {
        this.windSwitch = false;
      }
      if (
        this.currentItemList[this.currentItemList.length - 1].name == "海浪"
      ) {
        this.waveSwitch = false;
      }
    },
    // 监听时间
    nowTime(newval) {
      const str = Number(newval[11]);
      this.day = newval.substring(0, 10);
      this.time =
        str === 0 ? newval.substring(12, 13) : newval.substring(11, 13);

      // 如果有风羽或波向重新请求数据
      let windWaveIndex = this.currentItemList.findIndex((item) => {
        return (
          item.parameterMark === "U_V_component_of_wind" ||
          item.parameterMark === "U_V_component_of_wind_ground" ||
          item.parameterMark === "ec_wave_height" ||
          item.parameterMark === "waves_direction"
        );
      });
      if (windWaveIndex !== -1) {
        this.clearWindOrWave(this.currentItemList[windWaveIndex]);
        this.findAndDrawWindWave(
          this.currentItemList[windWaveIndex],
          this.currentItemList[windWaveIndex].currentLevel
        );
      }
      this.drawItemList();

      // 切换卫星云图
      if (this.fyType) {
        this.getAndDrawFyType(this.fyType);
      }

      //时间发生改变时，关闭粒子开关
      this.windSwitch = false;
      this.waveSwitch = false;
    },
    // 监听实况选择变化
    realTimeValue(newval) {
      this.setRealTimeValue(newval);
      console.log(newval, `选择的站点`);
    },
    // 监听卫星云图
    fyType(newval) {
      if (newval) {
        this.getAndDrawFyType(newval);
      } else {
        fyTypeGroup.clearLayers();
      }
    },
    // 潮汐面板时间切换
    changeDateIndex(newval) {
      this.changeTimeIndex(newval);
    },
    // 潮汐面板隐藏时切换图标
    tidalShow(newval) {
      if (!newval) {
        this.tidalMarker.forEach((item) => {
          item.setIcon(this.tidalIcon);
        });
      }
    },
    //风粒子动画开关
    windSwitch(val) {
      console.log(val, "风粒子开关状态");
      if (val) {
        if (map.hasLayer(windParticleLayer)) {
          map.removeLayer(windParticleLayer);
          map.off("movestart", this.removeWindAnimate);
          map.off("moveend", this.drawWindAnimate);
        }
        let index = this.currentItemList.findIndex((item) => {
          return (
            item.parameterMark === "U_V_component_of_wind" ||
            item.parameterMark === "U_V_component_of_wind_ground"
          );
        });
        // currentWind当前选中的风场对应的风场粒子 currentLevel当前层级
        let currentWind = null;
        let currentLevel = null;
        if (
          this.currentItemList[index].parameterMark === "U_V_component_of_wind"
        ) {
          let i = this.windWaveList.findIndex((item) => {
            return item.parameterMark === "wind_plume";
          });
          currentWind = this.windWaveList[i];
          currentLevel = this.currentItemList[index].currentLevel;
        } else if (
          this.currentItemList[index].parameterMark ===
          "U_V_component_of_wind_ground"
        ) {
          let i = this.windWaveList.findIndex((item) => {
            return item.parameterMark === "wind_plume_ground";
          });
          currentWind = this.windWaveList[i];
          currentLevel = this.currentItemList[index].currentLevel;
        }
        console.log("currentWind", currentWind);
        // let i = this.currentItemList[index].parseIntLevel.findIndex((item) => {
        //   return item == this.currentItemList[index].currentLevel;
        // });

        //获取风数据
        this.$get("api/numerical-forecast/wind", {
          day: this.day,
          level: currentLevel,
          time: this.time,
          grade: 0,
          type: currentWind.id,
        })
          .then((res) => {
            let dataArr = res.data.data;
            let newDataArr = [];
            for (let i = 90; i >= -90; i--) {
              for (let j = 0; j < dataArr.length; j++) {
                if (dataArr[j][0] == i) {
                  newDataArr.push(dataArr[j]);
                }
              }
            }
            newDataArr = newDataArr.map((item) => {
              item[1] = item[1] > 180 ? item[1] - 360 : item[1];
              return item;
            });
            newDataArr.sort((a, b) => {
              if (a[0] == b[0]) {
                return a[1] - b[1];
              }
            });
            console.log(newDataArr, "====================");
            // newDataArr = newDataArr.map((item) => {
            //   item[1] = item[1] > 180 ? item[1] - 360 : item[1];
            //   return item
            // });
            // console.log(newDataArr);
            // console.log(
            //   newDataArr.sort(this.sortArr),
            //   "排序后的数组----------"
            // );
            // newDataArr = newDataArr.sort(this.sortArr),
            let xMin = currentWind.xMax > 180 ? -179 : currentWind.xMin;
            let xMax = currentWind.xMax > 180 ? 180 : currentWind.xMax;
            this.windData = [];
            let windUObj = {
              data: [],
              header: {
                dx: currentWind.gridSize,
                dy: currentWind.gridSize,
                la1: currentWind.yMax,
                la2: currentWind.yMin,
                lo1: xMin,
                lo2: xMax,
                nx: (xMax - xMin) / currentWind.gridSize + 1,
                ny:
                  (currentWind.yMax - currentWind.yMin) / currentWind.gridSize +
                  1,
                parameterCategory: 2,
                parameterNumber: 2,
                parameterUnit: "m.s-1",
                // "basicAngle": 0,
              },
            };
            let windVObj = {
              data: [],
              header: {
                dx: currentWind.gridSize,
                dy: currentWind.gridSize,
                la1: currentWind.yMax,
                la2: currentWind.yMin,
                lo1: xMin,
                lo2: xMax,
                nx: (xMax - xMin) / currentWind.gridSize + 1,
                ny:
                  (currentWind.yMax - currentWind.yMin) / currentWind.gridSize +
                  1,
                parameterCategory: 2,
                parameterNumber: 3,
                parameterUnit: "m.s-1",
                // basicAngle: 0,
              },
            };

            for (var i = 0; i < dataArr.length; i++) {
              // var value = (dataArr[i][2] * 1852) / 3600; //海里/时=》米/秒
              var value = dataArr[i][2];
              // var rad = (Math.PI * dataArr[i][3]) / 180; //度数=》弧度
              var rad = (Math.PI * (dataArr[i][3] - 180)) / 180; //度数=》弧度
              windUObj.data.push(value * Math.sin(rad));
              windVObj.data.push(value * Math.cos(rad));
              // var rad = (Math.PI * (270-dataArr[i][3])) / 180; //度数=》弧度
              // windUObj.data.push(value * Math.cos(rad));
              // windVObj.data.push(value * Math.sin(rad));
            }
            this.windData.push(windUObj, windVObj);
            console.log(this.windData);
            this.drawWindAnimate();

            map.on("movestart", this.removeWindAnimate);
            map.on("moveend", this.drawWindAnimate);
            // windParticleLayer = L.velocityLayer({
            //   displayValues: true,
            //   displayOptions: {
            //     velocityType: "Global Wind",
            //     displayPosition: "bottomleft",
            //     displayEmptyString: "No wind data",
            //   },
            //   data: this.windData,
            //   maxVelocity: 15,
            //   // velocityScale:0.002,
            //   // colorScale: ["#fff"],
            //   // lineWidth: 2,
            // });
            // map.addLayer(windParticleLayer);
          })
          .catch((err) => {
            this.$message({
              message: "该时刻无风场数据",
            });
          });
      } else {
        map.removeLayer(windParticleLayer);
        map.off("movestart", this.removeWindAnimate);
        map.off("moveend", this.drawWindAnimate);
      }
    },
    //海浪粒子动画开关
    waveSwitch(val) {
      console.log(val, "海浪粒子开关状态");
      //选中时开启粒子
      if (val) {
        if (map.hasLayer(waveParticleLayer)) {
          map.removeLayer(waveParticleLayer);
        }
        let index = this.currentItemList.findIndex((item) => {
          return (
            item.parameterMark == "ec_wave_height" ||
            item.parameterMark === "waves_direction"
          );
        });
        // currentWind当前选中的海浪、海流对应的风场粒子
        let currentWave = null;
        if (this.currentItemList[index].parameterMark === "ec_wave_height") {
          let i = this.windWaveList.findIndex((item) => {
            return item.parameterMark === "waves_direction_lang";
          });
          currentWave = this.windWaveList[i];
        } else if (
          this.currentItemList[index].parameterMark === "waves_direction"
        ) {
          let i = this.windWaveList.findIndex((item) => {
            return item.parameterMark === "waves_direction_liu";
          });
          currentWave = this.windWaveList[i];
        }
        //获取海浪数据
        // this.$get("api/numerical-forecast/wave-list", {
        //   day: this.day,
        //   grade: 0,
        //   time: this.time,
        //   type: currentWave.id,
        // }).then((res) => {
        //   console.log(res.data.data);
        //   let dataArr = res.data.data;
        //   let newDataArr = [];
        //   for (let i = 90; i >= -90; i = i - 0.5) {
        //     for (let j = 0; j < dataArr.length; j++) {
        //       if (dataArr[j][0] == i) {
        //         newDataArr.push(dataArr[j]);
        //       }
        //     }
        //   }
        //   console.log(newDataArr,"海浪数据==========");
        //   this.waveData = [];
        //   let waveUObj = {
        //     data: [],
        //     header: {
        //       dx: 0.5,
        //       dy: 0.5,
        //       la1: 90,
        //       la2: -90,
        //       lo1: 0,
        //       lo2: 359,
        //       nx: 719,
        //       ny: 361,
        //       parameterCategory: 2,
        //       parameterNumber: 2,
        //       parameterUnit: "m.s-1",
        //     },
        //   };
        //   let waveVObj = {
        //     data: [],
        //     header: {
        //       dx: 0.5,
        //       dy: 0.5,
        //       la1: 90,
        //       la2: -90,
        //       lo1: 0,
        //       lo2: 359,
        //       nx: 719,
        //       ny: 361,
        //       parameterCategory: 2,
        //       parameterNumber: 3,
        //       parameterUnit: "m.s-1",
        //     },
        //   };

        //   for (var i = 0; i < dataArr.length; i++) {
        //     // var value = (dataArr[i][2] * 1852) / 3600; //海里/时=》米/秒
        //     var value = Number(dataArr[i][2]);
        //     var rad = (Math.PI * dataArr[i][3]) / 180; //度数=》弧度
        //     if (!Number.isNaN(value)) {
        //       waveUObj.data.push(value * Math.sin(rad));
        //       waveVObj.data.push(value * Math.cos(rad));
        //     } else {
        //       waveUObj.data.push(null);
        //       waveVObj.data.push(null);
        //     }
        //   }
        //   this.waveData.push(waveUObj, waveVObj);
        //   console.log(this.waveData);

        //   this.drawWaveAnimate();
        //   map.on("movestart", this.removeWaveAnimate);
        //   map.on("moveend", this.drawWaveAnimate);
        //   // waveParticleLayer = L.velocityLayer({
        //   //   displayValues: true,
        //   //   displayOptions: {
        //   //     velocityType: "Global Wind",
        //   //     displayPosition: "bottomleft",
        //   //     displayEmptyString: "No wind data",
        //   //   },
        //   //   data: data,
        //   //   maxVelocity: 15,
        //   //   velocityScale: 0.002,
        //   //   colorScale: ["#fff"],
        //   //   lineWidth: 7,
        //   // });
        //   // map.addLayer(waveParticleLayer);
        // });
        if (currentWave.parameterMark === "waves_direction_lang") {
          this.$get("/api/numerical-forecast/wave", {
            day: this.day,
            time: this.time,
            type: currentWave.id,
          })
            .then((res) => {
              console.log("wave--res", res.data.data);
              if (res.status == 200) {
                let gridSize = currentWave.gridSize;
                let xMin = currentWave.xMin;
                let xMax = currentWave.xMax;
                let yMin = currentWave.yMin;
                let yMax = currentWave.yMax;
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
                console.log("waveList粒子", waveList);
              }
            })
            .catch((error) => {
              this.$message.error("获取" + currentWave.name + "数据失败");
            });
        } else if (currentWave.parameterMark === "waves_direction_liu") {
          this.$get("/api/numerical-forecast/ocean-current", {
            day: this.day,
            time: this.time,
            grade: 1,
            level: 1,
            type: currentWave.id,
          })
            .then((res) => {
              console.log("wave--res", res.data.data);
              if (res.status == 200) {
                let gridSize = currentWave.gridSize;
                let xMin = currentWave.xMin;
                let xMax = currentWave.xMax;
                let yMin = currentWave.yMin;
                let yMax = currentWave.yMax;
                // waveList 构造数组 361 * 720 [lat, lng, value, dir]
                let waveList = [];
                console.log(gridSize);
                let data = res.data.data;

                // data.reverse()
                let firstX = data[0][0];
                let latlngList = [];
                for (let i = 0; i < data.length; i++) {
                  if (firstX == data[i][0]) {
                    latlngList.push(data[i]);
                  } else {
                    // latlngList.reverse()
                    waveList.push(latlngList);
                    latlngList = [];
                    firstX = data[i][0];
                    latlngList.push(data[i]);
                  }
                }
                console.log("waveList粒子", waveList);
              }
            })
            .catch((error) => {
              this.$message.error("获取" + currentWave.name + "数据失败");
            });
        }
      } else {
        //关闭粒子
        map.removeLayer(waveParticleLayer);
        map.off("movestart", this.removeWaveAnimate);
        map.off("moveend", this.drawWaveAnimate);
      }
    },
  },
  created() {
    this.initMenuList();
  },
  mounted() {
    const date = this.$m().format("YYYY");
    this.selectDate = date;
    console.log(date, `年`);
    this.dateList = this.generateArray(1949, Number(date));
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

    // 经纬度显示
    window.map.on("mousemove", (e) => {
      let latlng = L.latLng(e.latlng.lat, e.latlng.lng).wrap();
      this.latNum =
        latlng.lat > 0
          ? Math.abs(latlng.lat).toFixed(3) + " N"
          : Math.abs(latlng.lat).toFixed(3) + " S";
      this.lonNum =
        latlng.lng > 0
          ? Math.abs(latlng.lng).toFixed(3) + " E"
          : Math.abs(latlng.lng).toFixed(3) + " W";
    });

    L.CustomPopup = L.Popup.extend({
      _initLayout: function () {
        var prefix = "leaflet-popup",
          container = (this._container = L.DomUtil.create(
            "div",
            prefix +
              " " +
              (this.options.className || "") +
              " leaflet-zoom-animated"
          ));

        var wrapper = container;
        this._contentNode = L.DomUtil.create(
          "div",
          prefix + "-content",
          wrapper
        );

        L.DomEvent.disableClickPropagation(wrapper)
          .disableScrollPropagation(this._contentNode)
          .on(wrapper, "contextmenu", L.DomEvent.stopPropagation);
      },
    });

    // add bindCustomPopup
    L.Layer.include({
      bindCustomPopup: function (content, options) {
        if (content instanceof L.Popup) {
          L.setOptions(content, options);
          this._popup = content;
          content._source = this;
        } else {
          if (!this._popup || options) {
            this._popup = new L.CustomPopup(options, this);
          }
          this._popup.setContent(content);
        }

        if (!this._popupHandlersAdded) {
          this.on({
            click: this._openPopup,
            // mouseover: this._openPopup,
            // mouseout: this.closePopup,
            remove: this.closePopup,
            move: this._movePopup,
          });
          this._popupHandlersAdded = true;
        }

        return this;
      },
    });
  },
  methods: {
    ...mapMutations({
      setMenuItemList: "sideBar/setMenuItemList",
      setLevelList: "sideBar/setLevelList",
      setRealTimeValue: "sideBar/setRealTimeValue",
      setTidalShow: "clickup/setTidalShow",
      setTidalObj: "clickup/setTidalObj",
      setTidalData: "clickup/setTidalData",
      setTidalCharts: "clickup/setTidalCharts",
      setTidalMsgFlag: "clickup/setTidalMsgFlag",
      setChangeDateIndex: "clickup/setChangeDateIndex",
      setReloadTime: "sideBar/setReloadTime",
    }),
    // 生成日期数组
    generateArray(start, end) {
      return Array.from(new Array(end + 1).keys())
        .slice(start)
        .reverse();
    },
    changeDrawFlag() {
      this.drawFlag = !this.drawFlag;
      if (!this.drawFlag) {
        this.oldZoom = window.map.getZoom();
      }
    },
    // 潮汐面板日期切换
    changeTimeIndex(i) {
      let time = this.tidalData.timeList[i];
      let date = new Date();
      let year = date.getFullYear();
      let t = year + "-" + time;
      this.getTidalData(this.markerId, t);
    },
    // 切换风羽、波向是否选中
    changeWindWave(index) {
      this.menuList[index].windWaveFlag = !this.menuList[index].windWaveFlag;
      if (!this.menuList[index].windWaveFlag) {
        this.clearWindOrWave(this.menuList[index]);
      }
    },
    // wind、wave使用了自动重绘，需要单独清除
    clearWindOrWave(layer) {
      let windList = windGroup.getLayers();
      let waveList = waveGroup.getLayers();
      if (
        (layer.parameterMark === "ec_wave_height" ||
          layer.parameterMark === "waves_direction") &&
        waveList.length
      ) {
        waveGroup.clearLayers();
      } else if (
        (layer.parameterMark === "U_V_component_of_wind" ||
          layer.parameterMark === "U_V_component_of_wind_ground") &&
        windList.length
      ) {
        windGroup.clearLayers();
      }
    },
    // 查找对应的wind、wave
    findAndDrawWindWave(currentItem, level) {
      // 找到并绘制wind wave
      if (currentItem.windWave === "wind") {
        if (currentItem.parameterMark === "U_V_component_of_wind") {
          // 风
          let index = this.windWaveList.findIndex((item) => {
            return item.parameterMark === "wind_plume";
          });
          this.currentWindWave = this.windWaveList[index];
        } else if (
          currentItem.parameterMark === "U_V_component_of_wind_ground"
        ) {
          // 地面风
          let index = this.windWaveList.findIndex((item) => {
            return item.parameterMark === "wind_plume_ground";
          });
          this.currentWindWave = this.windWaveList[index];
        }

        this.getAndDrawWind(this.currentWindWave, level);
      } else if (currentItem.windWave === "wave") {
        if (currentItem.parameterMark === "ec_wave_height") {
          // 海浪
          let index = this.windWaveList.findIndex((item) => {
            return item.parameterMark === "waves_direction_lang";
          });
          this.currentWindWave = this.windWaveList[index];
        } else if (currentItem.parameterMark === "waves_direction") {
          // 海流
          let index = this.windWaveList.findIndex((item) => {
            return item.parameterMark === "waves_direction_liu";
          });
          this.currentWindWave = this.windWaveList[index];
        }

        this.getAndDrawWave(this.currentWindWave);
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
                // windWave 标识 是否含有 wind 或 wave  other表示不是
                windWave: "other",
                // windWaveFlag 表示风羽、洋流是否选中
                windWaveFlag: true,
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
              // 海流的grade不变
              if (item.parameterMark === "waves_direction") {
                gradesize = 0;
              }
              obj.grade = gradesize;
              // 给定含有风羽、洋流的标识
              if (
                item.parameterMark === "U_V_component_of_wind" ||
                item.parameterMark === "U_V_component_of_wind_ground"
              ) {
                obj.windWave = "wind";
                obj.windWaveName = "风羽";
              }
              if (item.parameterMark === "ec_wave_height") {
                obj.windWave = "wave";
                obj.windWaveName = "波向";
              }
              if (item.parameterMark === "waves_direction") {
                obj.windWave = "wave";
                obj.windWaveName = "流向";
              }
              // wind\wave 不显示在sidebar上
              if (
                item.drawType === "point_wind" ||
                item.drawType === "point_flow"
              ) {
                this.windWaveList.push(obj);
              } else {
                this.menuList.push(obj);
              }
            });
          }
          console.log("数据源", this.menuList);
          console.log("数据源wind", this.windWaveList);
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
      console.log(index, `菜单选择`);
      // 选中状态时取消选中
      if (this.menuList[index].flag) {
        // 清除单个
        this.clearLayer(this.menuList[index]);
        if (this.menuList[index].drawType === "layer") {
          layerGroup.clearLayers();
        }
        // 海流和风用同一个清除方法
        if (
          this.menuList[index].drawType === "point_flow" ||
          this.menuList[index].drawType === "point_wind" ||
          this.menuList[index].drawType === "point"
        ) {
          this.clearWindWave(this.menuList[index]);
        }

        if (
          this.menuList[index].parameterMark === "U_V_component_of_wind" ||
          this.menuList[index].parameterMark === "U_V_component_of_wind_ground" ||
          this.menuList[index].parameterMark === "ec_wave_height" ||
          this.menuList[index].parameterMark === "waves_direction"
        ) {
          this.clearWindOrWave(this.menuList[index]);
        }

        if (this.menuList[index].drawType === "typhoon") {
          console.log("取消台风---------");
          this.typhoonShow = false;
          this.chooseAllFlag = false;
          //清除台风警戒线
          this.clearWarningLine();
          //清除台风
          this.deleteAllTy();
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
            this.clearWindOrWave(this.menuList[j]);
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
          this.typhoonShow = true;
          this.drawWarning();
          //获取台风列表数据信息
          this.loadTyphoon();
        }
      }

      // 当前要素设置为当前要素列表中的最后一个
      // this.currentItem = this.currentItemList[this.currentItemList.length - 1]
      // this.currentLevel = this.currentItemList[this.currentItemList.length - 1].level[0]
    },
    // 请求台风数据
    loadTyphoon() {
      this.$get("api/typhoon", {
        year: this.selectDate,
      }).then((res) => {
        console.log(res.data.data, "台风数据信息");
        let tyData = res.data.data;
        this.tyList = [];
        tyData.forEach((item) => {
          this.tyList.push({
            id: item.id,
            choose: false,
            cycloneType: item.cycloneType,
            cycloneName: item.cycloneName,
            // centerMaxSpeed: item.centerMaxSpeed,
          });
        });
        console.log(this.tyList);
        // this.typhoonShow = true;
      });
    },
    // 绘制单个要素
    drawItem() {
      // 这边 point_flow point_wind 不用了
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
        // layer 0~180 -180~0   line 0~180 180~360
        if (this.currentItem.drawType == "layer") {
          this.layerNum++;
          extentList.forEach((item, index) => {
            if (item.xMax > 180) {
              extentList[index].xMin -= 360;
              if (extentList[index].xMin == -1) {
                extentList[index].xMin = 0;
              }
              extentList[index].xMax -= 360;
              if (extentList[index].xMax == -1) {
                extentList[index].xMax = 0;
              }
            }
          });
        } else if (this.currentItem.drawType == "line") {
          // 等值线 0-180 180-360
          // extentList.forEach((item, index) => {
          //   if (extentList[index].xMax == 359) {
          //     extentList[index].xMax = 360;
          //   }
          // });

          // 下面是改为等值线 0-360
          let obj = {
            xMin: null,
            xMax: null,
            yMin: extentList[0].yMin,
            yMax: extentList[0].yMax,
          };
          let xMin = 666;
          let xMax = -1;
          extentList.forEach((item, index) => {
            xMin = xMin > item.xMin ? item.xMin : xMin;
            xMax = xMax < item.xMax ? item.xMax : xMax;
          });
          obj.xMin = xMin;
          obj.xMax = xMax;
          extentList = [];
          extentList.push(obj);
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
        // layer 0~180 -180~0   line 0~180 180~360
        if (currentItem.drawType === "layer") {
          this.layerNum++;
          extentList.forEach((item, index) => {
            if (item.xMax > 180) {
              extentList[index].xMin -= 360;
              if (extentList[index].xMin == -1) {
                extentList[index].xMin = 0;
              }
              extentList[index].xMax -= 360;
              if (extentList[index].xMax == -1) {
                extentList[index].xMax = 0;
              }
            }
          });
        } else if (currentItem.drawType == "line") {
          // extentList.forEach((item, index) => {
          //   if (extentList[index].xMax == 359) {
          //     extentList[index].xMax = 360;
          //   }
          // });
          let obj = {
            xMin: null,
            xMax: null,
            yMin: extentList[0].yMin,
            yMax: extentList[0].yMax,
          };
          let xMin = 666;
          let xMax = -1;
          extentList.forEach((item, index) => {
            xMin = xMin > item.xMin ? item.xMin : xMin;
            xMax = xMax < item.xMax ? item.xMax : xMax;
          });
          obj.xMin = xMin;
          obj.xMax = xMax;
          extentList = [];
          extentList.push(obj);
        }
        extentList.forEach((item) => {
          this.clearLayer(currentItem);
          if (currentItem.drawType == "line") {
            this.getAndDrawLine(currentItem, item);
          } else if (currentItem.drawType == "layer") {
            this.getAndDrawLayer(currentItem, item);
          }
        });
        console.log(extentList);
      });

      // 清除一下风羽、洋流，避免没有清楚的问题
      let windWaveIndex = this.currentItemList.findIndex((item) => {
        return (
          item.parameterMark === "U_V_component_of_wind" ||
          item.parameterMark === "U_V_component_of_wind_ground" ||
          item.parameterMark === "ec_wave_height" ||
          item.parameterMark === "waves_direction"
        );
      });
      let windList = windGroup.getLayers();
      let waveList = waveGroup.getLayers();
      if (windWaveIndex == -1 && windList.length) {
        windGroup.clearLayers();
      }
      if (windWaveIndex == -1 && waveList.length) {
        waveGroup.clearLayers();
      }

      // 清除多余的色斑图
      let layerIndex = this.currentItemList.findIndex((item) => {
        return item.drawType === "layer";
      });
      let layerList = layerGroup.getLayers();
      if (layerIndex == -1 && layerList.length) {
        layerGroup.clearLayers();
      }
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
        num: 20,
        time: this.time,
        type: currentItem.id,
      })
        .then((res) => {
          if (res.status == 200) {
            let polyline = [];
            console.log('------------', currentItem);
            
            if(currentItem.parameterMark === 'Geopotential_Height') {
              res.data.data.forEach((item) => {
                let linedata = [];
                item.PointList.forEach((item1) => {
                  let latlng = [];
                  latlng.push(item1.Y);
                  latlng.push(item1.X);
                  latlng.push(item.Value);
                  linedata.push(latlng);
                });
  
                polyline.push(linedata);
              });
            } else {
              res.data.data.forEach((item) => {
                let linedata = [];
                item.PointList.forEach((item1) => {
                  let latlng = [];
                  latlng.push(item1.Y);
                  latlng.push(item1.X);
                  latlng.push(item.Value);
                  linedata.push(latlng);
                });
  
                polyline.push(linedata);
              });
            }

            let line = new PressureLayer(
              {
                lineType: currentItem.parameterMark
              },
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
        // 往两边扩展
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
          let imageLayer = L.imageOverlay(img, bounds, { opacity: 0.8 });
          imageLayer.id = currentItem.id;
          imageLayer.layerId = this.layerNum;
          layerGroup.addLayer(imageLayer);
          // imageLayer.addTo(window.map);
          // this.layerList.push(imageLayer);
          let imageLayer1 = L.imageOverlay(img, bounds1, { opacity: 0.8 });
          imageLayer1.id = currentItem.id;
          imageLayer1.layerId = this.layerNum;
          layerGroup.addLayer(imageLayer1);
          // imageLayer1.addTo(window.map);
          // this.layerList.push(imageLayer1);
          let imageLayer2 = L.imageOverlay(img, bounds2, { opacity: 0.8 });
          imageLayer2.id = currentItem.id;
          imageLayer2.layerId = this.layerNum;
          layerGroup.addLayer(imageLayer2);

          // if (layer.drawType === "layer") {
          // 本次的加载完成，删除上次的图
          let lastLayer = layerGroup.getLayers();
          lastLayer.forEach((item) => {
            if (item.layerId !== this.layerNum) {
              layerGroup.removeLayer(item);
            }
          });
          // }

          // layerGroup.on('add', e => {
          //   let lastLayer = e.target._layers
          //   for(let layer in lastLayer) {
          //     if(lastLayer[layer].layerId !== this.layerNum) {
          //       window.map.removeLayer(lastLayer[layer])
          //     }
          //   }
          // })
          window.map.addLayer(layerGroup);
          // imageLayer2.addTo(window.map);
          // this.layerList.push(imageLayer2);
        }
        console.log("layer  test ---", layerGroup);
      } catch (error) {
        window.map.removeLayer(layerGroup);
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
    getAndDrawWind(currentItem, level) {
      // let levelIndex = currentItem.parseIntLevel.findIndex((item) => {
      //   return item === currentItem.currentLevel;
      // });
      this.$get("/api/numerical-forecast/wind", {
        day: this.day,
        level: level,
        time: this.time,
        grade: 0,
        type: currentItem.id,
      })
        .then((res) => {
          if (res.status == 200) {
            console.log("wind--res", res.data.data);
            if (res.status == 200) {
              this.windList = [];
              this.windList = res.data.data;

              var config = {
                lat: "0",
                lng: "1",
                value: "2",
                dir: "3",
                data: this.windList,
              };
              let windLayer = new WindLayer({}, config);
              windLayer.id = currentItem.id;
              windGroup.addLayer(windLayer);
              window.map.addLayer(windGroup);
            }
          }
        })
        .catch((error) => {
          this.$message.error("获取" + currentItem.name + "数据失败");
        });
    },
    // 绘制 洋流\波向
    getAndDrawWave(currentItem) {
      if (currentItem.parameterMark === "waves_direction_lang") {
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
              let waveLayer = new FlowLayer({}, config);
              waveLayer.id = currentItem.id;
              waveGroup.addLayer(waveLayer);
              window.map.addLayer(waveGroup);
            }
          })
          .catch((error) => {
            this.$message.error("获取" + currentItem.name + "数据失败");
          });
      } else if (currentItem.parameterMark === "waves_direction_liu") {
        this.$get("/api/numerical-forecast/ocean-current", {
          day: this.day,
          time: this.time,
          grade: 1,
          level: 1,
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
              console.log(gridSize);
              let data = res.data.data;

              // data.reverse()
              let firstX = data[0][0];
              let latlngList = [];
              for (let i = 0; i < data.length; i++) {
                if (firstX == data[i][0]) {
                  latlngList.push(data[i]);
                } else {
                  // latlngList.reverse()
                  waveList.push(latlngList);
                  latlngList = [];
                  firstX = data[i][0];
                  latlngList.push(data[i]);
                }
              }
              // for (let i = 0; i < data.length; i++) {
              //   let latlngList = [];
              //   for (let j = 0; j < data[i].length; j++) {
              //     let arr = [];
              //     arr.push(Number(yMax) - i * gridSize);
              //     if (Number(xMin) + j * gridSize > 180) {
              //       arr.push(Number(xMin) + j * gridSize - 360);
              //     } else {
              //       arr.push(Number(xMin) + j * gridSize);
              //     }
              //     if (data[i][j] != "") {
              //       let temp = data[i][j].split(",");
              //       arr.push(temp[0]);
              //       arr.push(temp[1]);
              //     } else {
              //       arr.push("");
              //       arr.push("");
              //     }
              //     latlngList.push(arr);
              //   }
              //   waveList.push(latlngList);
              // }
              console.log("waveList", waveList);

              var config = {
                lat: "0",
                lng: "1",
                value: "2",
                dir: "3",
                data: waveList,
              };
              let waveLayer = new FlowLayer({}, config);
              waveLayer.id = currentItem.id;
              waveGroup.addLayer(waveLayer);
              window.map.addLayer(waveGroup);
            }
          })
          .catch((error) => {
            this.$message.error("获取" + currentItem.name + "数据失败");
          });
      }
    },
    // 绘制潮汐
    getAndDrawTidal(currentItem) {
      // 先绘制港口数据
      this.$get("/api/harbor")
        .then((res) => {
          if (res.status == 200) {
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
      marker.on("click", (ev) => {
        let marker = ev.target;
        let point = ev.containerPoint;
        this.markerId = ev.target.harborId;
        // 切换图标
        marker.setIcon(this.tidalSelectIcon);
        let otherMarker = this.tidalMarker.filter((item) => {
          return item.harborId !== this.markerId;
        });
        otherMarker.forEach((item) => {
          item.setIcon(this.tidalIcon);
        });

        // 设置面板位置
        let p = map.latLngToContainerPoint(
          L.latLng(marker._latlng.lat, marker._latlng.lng)
        );
        this.tidalObj.left = p.x;
        this.tidalObj.top = p.y;
        this.setTidalObj(this.tidalObj);

        // ev.target.   构造数据
        let time = Number(this.time) > 10 ? " " + this.time : " 0" + this.time;
        this.tidalData.time = this.day + time + ":00:00";
        this.tidalData.name = ev.target.name;
        // 前三天日期数据
        this.setChangeDateIndex(2); // 重置为第三个日期
        this.tidalData.timeList = [];
        let now = this.$m(this.day).format("MM-DD");
        let yestoday = this.$m(this.day).subtract(1, "days").format("MM-DD");
        let lastday = this.$m(this.day).subtract(2, "days").format("MM-DD");
        this.tidalData.timeList.push(lastday);
        this.tidalData.timeList.push(yestoday);
        this.tidalData.timeList.push(now);

        let day = this.day;
        this.getTidalData(harbor.id, day);

        map.on("move", (e) => {
          let p = map.latLngToContainerPoint(
            L.latLng(marker._latlng.lat, marker._latlng.lng)
          );
          this.tidalObj.left = p.x;
          this.tidalObj.top = p.y;
          this.setTidalObj(this.tidalObj);
        });
      });
      this.tidalMarker.push(marker);
    },
    getTidalData(id, time) {
      this.$get("/api/tidal/one", {
        id: id,
        localDate: time,
      })
        .then((res) => {
          if (res.status == 200) {
            let tidalList = res.data.data;
            console.log("tidalList修改", tidalList);
            this.tidalData.tidalList = [];
            let time = null;
            this.clearChart();
            // this.createChart(this.tidalCharts);
            if (
              tidalList.length &&
              tidalList != null &&
              tidalList != undefined
            ) {
              // 高低潮数据列表
              let tidalLists = [];
              this.setTidalMsgFlag(false);
              // 最大值和最小值
              tidalList.forEach((e, i) => {
                if (e.tidalType === 2) {
                  console.log("第一低潮", e);
                  let time = e.tidalTime.split("T")[1];
                  let tidal = {
                    tidalTime: `${time.split(":")[0]}时${time.split(":")[1]}分`,
                    name: `第一低潮`,
                    height: e.height,
                  };
                  tidalLists.push(tidal);
                  return;
                }
                if (e.tidalType === 1) {
                  let time = e.tidalTime.split("T")[1];
                  let tidal = {
                    tidalTime: `${time.split(":")[0]}时${time.split(":")[1]}分`,
                    name: `第二低潮`,
                    height: e.height,
                  };
                  tidalLists.push(tidal);
                  return;
                }
                if (e.tidalType === 3) {
                  console.log("第一高潮", e);
                  let time = e.tidalTime.split("T")[1];
                  let tidal = {
                    tidalTime: `${time.split(":")[0]}时${time.split(":")[1]}分`,
                    name: `第一高潮`,
                    height: e.height,
                  };
                  tidalLists.push(tidal);
                  return;
                }
                if (e.tidalType === 4) {
                  console.log("第二高潮", e);
                  let time = e.tidalTime.split("T")[1];
                  let tidal = {
                    tidalTime: `${time.split(":")[0]}时${time.split(":")[1]}分`,
                    name: `第二高潮`,
                    height: e.height,
                  };
                  tidalLists.push(tidal);
                  return;
                }
              });
              console.log(tidalLists, `tidalListstidalListstidalLists`);
              this.tidalData.tidalList = tidalLists;
              for (let i = 0; i < tidalList.length; i++) {
                let time = this.$m(tidalList[i].tidalTime).format("HH");
                this.tidalCharts.xdata.push(time);
                this.tidalCharts.ydata.push(tidalList[i].height);
              }
              // 绘制图表
              this.setTidalCharts(this.tidalCharts);
              // 传递面板数据
              this.setTidalData(this.tidalData);
            } else {
              // 暂无数据
              this.setTidalMsgFlag(true);
              // 传递面板数据
              this.setTidalData(this.tidalData);
            }

            // 显示面板
            this.setTidalShow(true);
          }
        })
        .catch((error) => {
          this.$message.error("获取潮汐数据失败");
        });
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

      // if (layer.drawType === "layer") {
      //   let lastLayer = layerGroup.getLayers()
      //   lastLayer.forEach(item => {
      //     if(item.layerId !== this.layerNum) {
      //       layerGroup.removeLayer(item)
      //     }
      //   })
      // }

      // if(layer.drawType === 'point_flow' && (this.waveLayer !== null)) {
      //   map.removeLayer(layer)
      //   this.waveLayer = null
      // }
    },
    // wind、wave使用了自动重绘，需要单独清除
    clearWindWave(layer) {
      let windList = windGroup.getLayers();
      let waveList = waveGroup.getLayers();
      if (layer.drawType === "point_flow" && waveList.length) {
        waveGroup.clearLayers();
      } else if (layer.drawType === "point_wind" && windList.length) {
        windGroup.clearLayers();
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
        this.deleteAllTy();
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
        this.flag = true;
        chooseArr.forEach((item) => {
          this.drawTy(this.tyList[item].id);
        });
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
        if (i == -1) {
          this.chooseAllFlag = false;
        }
        this.deleteTy(item.id);
        //点击之前是未选中状态时，则选中，并绘制该条台风
      } else {
        item.choose = true;
        //如果所有的都变为选中，则将全选置为true
        let i = this.tyList.findIndex((item) => {
          return item.choose == false;
        });
        if (i == -1) {
          this.chooseAllFlag = true;
        }
        this.flag = true;
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
          item.tyName = res.data.data.cycloneName;
        });
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
          weight: 6,
          opacity: 0,
        }).addTo(map);
        circle.id = id;
        circle.info = trackList[0];
        circle.on("mouseover", (e) => {
          // console.log(e, "-------------------");
          let content = this.getTyContent(e.target.info);
          circle.bindCustomPopup(content).openPopup();
        });
        circle.on("mouseout", (e) => {
          circle.closePopup();
        });
        this.tyDeletArr.push(circle);

        let i = 0;
        let that = this;
        function test() {
          if (i < trackList.length - 1) {
            if (that.flag) {
              let timer = setTimeout(() => {
                let latlngs = [
                  [trackList[i].lat, trackList[i].lon],
                  [trackList[i + 1].lat, trackList[i + 1].lon],
                ];
                let polyline = L.polyline(latlngs, { color: "#666666" }).addTo(
                  map
                );
                polyline.id = id;
                polyline.bringToBack();
                that.tyDeletArr.push(polyline);
                let circle = L.circleMarker(
                  [trackList[i + 1].lat, trackList[i + 1].lon],
                  {
                    // id:id,
                    radius: 6,
                    fillOpacity: 1,
                    fillColor: trackList[i + 1].color,
                    weight: 6,
                    opacity: 0,
                  }
                ).addTo(map);
                circle.id = id;
                circle.info = trackList[i + 1];
                circle.on("click", (e) => {
                  // console.log(e, "-------------------");
                  let content = that.getTyContent(e.target.info);
                  circle.bindCustomPopup(content).openPopup();
                });
                circle.on("mouseout", (e) => {
                  circle.closePopup();
                });
                // circle.bringToFront()
                that.tyDeletArr.push(circle);
                i++;
                test();
              }, 50);
            }
          } else {
            // clearTimeout(timer);
            i = 0;
          }
        }
        test();
      });
    },

    //根据id清除台风
    deleteTy(id) {
      this.flag = false;
      console.log(this.tyDeletArr);
      setTimeout(() => {
        this.tyDeletArr.forEach((item, index) => {
          if (item.id == id) {
            map.removeLayer(item);
            // this.tyDeletArr.splice(index,1)
          }
        });
        for (let i = 0; i < this.tyDeletArr.length; i++) {
          if (this.tyDeletArr[i].id == id) {
            this.tyDeletArr.splice(i, 1);
            i--;
          }
        }
      }, 100);
      console.log(this.tyDeletArr);
    },

    //删除全部台风
    deleteAllTy() {
      this.flag = false;
      setTimeout(() => {
        this.tyDeletArr.forEach((item) => {
          map.removeLayer(item);
        });
        this.tyDeletArr = [];
      }, 100);
    },

    getTyContent(info) {
      return (
        `<div id="ty_infobox">
      <div class="info_title">` +
        info.tyName +
        `</div>
      <div class="info_content">
        <div>时间: ` +
        info.dayTime.replace("T", " ") +
        `</div>
        <div>纬度: ` +
        info.lat +
        `</div>
        <div>经度: ` +
        info.lon +
        `</div>
        <div>中心气压: ` +
        info.centerPressure +
        `</div>
        <div>最大速度: ` +
        info.centerMaxSpeed +
        `</div>
      </div>
    </div>`
      );
    },

    // 获取并添加卫星云图
    async getAndDrawFyType(type) {
      let time =
        this.time > 10 ? this.time + ":00:00" : "0" + this.time + ":00:00";
      // let bounds = L.latLngBounds(
      //   L.latLng(-54.96, 49.74),
      //   L.latLng(54.96, 159.66)
      // );

      // let imageLayer = L.imageOverlay(globalConfig.baseURL + '/api/fypacket/show_image?areaType=0&dataType=' + type + '&dateTime=' + this.day + ' ' + time, bounds);
      // imageLayer.id = type;
      // fyTypeGroup.addLayer(imageLayer)

      // let lastLayer = fyTypeGroup.getLayers()
      // // 删除前一个云图
      // if(lastLayer.length > 1) {
      //   fyTypeGroup.removeLayer(lastLayer[0])
      // }

      // window.map.addLayer(fyTypeGroup)

      try {
        let fyImage = await this.$getbuffer(
          "/api/fypacket/show_image",
          {
            areaType: 0,
            dataType: type,
            dateTime: this.day + " " + time,
          },
          { responseType: "arraybuffer" }
        );

        const img = this.toImage(fyImage);
        // let bounds = L.latLngBounds(L.latLng(-10, 96.06), L.latLng(48.3, 169.96));
        let bounds = L.latLngBounds(L.latLng(-54.96, 49.74), L.latLng(54.96, 159.66));
        if (img && img !== "data:image/png;base64,") {
          // let imageLayer = L.imageOverlay(img, bounds,{opacity:0.3});
          let imageLayer = L.imageOverlay(img, bounds);
          imageLayer.id = type;
          fyTypeGroup.addLayer(imageLayer);

          let lastLayer = fyTypeGroup.getLayers();
          // 删除前一个云图
          if (lastLayer.length > 1) {
            fyTypeGroup.removeLayer(lastLayer[0]);
          }

          window.map.addLayer(fyTypeGroup);
        } else {
          this.$message.warning("此时刻暂无" + type + "数据");
        }
      } catch (error) {
        this.$message.error("获取" + type + "数据失败");
      }
    },

    // 刷新时间
    reloadTime() {
      this.setReloadTime();
    },

    //绘制风场粒子动画
    drawWindAnimate() {
      windParticleLayer = L.velocityLayer({
        displayValues: true,
        displayOptions: {
          velocityType: "Global Wind",
          displayPosition: "bottomleft",
          displayEmptyString: "No wind data",
        },
        data: this.windData,
        maxVelocity: 15,
        // particleMultiplier: 1 / 100,
        // velocityScale:0.002,
        // colorScale: ["#fff"],
        // lineWidth: 2,
      });
      map.addLayer(windParticleLayer);
    },

    //移除风场粒子动画
    removeWindAnimate() {
      console.log("-------------------------");
      if (map.hasLayer(windParticleLayer)) {
        map.removeLayer(windParticleLayer);
      }
    },

    //数组排序
    sortArr(a, b) {
      if (a[0] == b[0]) {
        return a[1] - b[1];
      }
    },

    //绘制海浪粒子动画
    drawWaveAnimate() {
      waveParticleLayer = L.velocityLayer({
        displayValues: true,
        displayOptions: {
          velocityType: "Global Wind",
          displayPosition: "bottomleft",
          displayEmptyString: "No wind data",
        },
        data: this.waveData,
        maxVelocity: 15,
        velocityScale: 0.003,
        colorScale: ["#fff"],
        lineWidth: 7,
      });
      map.addLayer(waveParticleLayer);
    },

    removeWaveAnimate() {
      if (map.hasLayer(waveParticleLayer)) {
        map.removeLayer(waveParticleLayer);
      }
    },
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
.el_switch {
  margin-right: 10px;
  margin-left: 10px;
  .el-switch__label {
    color: #fff;
  }
  .el-switch__label.is-active {
    color: #981a00;
  }
}
</style>
