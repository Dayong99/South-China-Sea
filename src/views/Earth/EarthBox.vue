<template>
  <div id="earthBox">
    <!-- 地球 -->
    <earth ref="earth" />
    <!-- 时间播放轴 -->
    <time-bar v-show="timeShow"></time-bar>
    <!-- 工具条 -->
    <tool-bar></tool-bar>
    <!-- 标题logo -->
    <logo-global></logo-global>
    <!-- 要素时间信息 -->
    <!-- <parameter-heading></parameter-heading> -->
    <!-- 图例 -->
    <legend-bar></legend-bar>
    <!-- 气象要素菜单栏 -->
    <side-bar></side-bar>
    <!-- 菜单栏 -->
    <menu-bar></menu-bar>
    <!-- 船舰管理 -->
    <ship-manager></ship-manager>
    <!-- 编队管理 -->
    <team-manager></team-manager>
    <!-- 任务管理 -->
    <task-manager></task-manager>

    <!-- 系统配置 -->
    <!-- 色斑图配置 -->
    <legend-manager></legend-manager>
    <!-- 等值线配置 -->
    <line-manager></line-manager>
    <!-- 常用区域 -->
    <area-manager></area-manager>
    <!-- 海区划分 -->
    <sea-manager></sea-manager>
    <!-- 参数配置 -->
    <param-manager></param-manager>
    <!-- 数据项配置 -->
    <dataitem-manager></dataitem-manager>

    <!-- 数据管理 -->
    <!-- 数据源配置 -->
    <datasource-manager></datasource-manager>
    <!-- 数据源配置 -->
    <datasource-manager1></datasource-manager1>
    <!-- 数据源配置 -->
    <datasource-manager2></datasource-manager2>
    <!-- 台风数据 -->
    <typhoon-manager></typhoon-manager>

    <!-- 航线管理 -->
    <route-manager></route-manager>
    <!-- 算法管理 -->
    <algorithm-manager></algorithm-manager>
    <!-- 评估结果 -->
    <assessment-manager></assessment-manager>
    <!-- 船舰详情 -->
    <info-box></info-box>
  </div>
</template>

<script>
// 地球
import Earth from "@/views/Earth/Earth";
// 时间轴
import TimeBar from "@/components/timebar/TimeBar";
import ToolBar from "@/components/tool/ToolBar.vue";
import LogoGlobal from "@/components/tool/logoGlobal.vue";
import ParameterHeading from "@/components/tool/parameterHeading.vue";
import SideBar from "@/components/sidebar/SideBar.vue";
import LegendBar from "@/components/legendbar/legendBar.vue";
import MenuBar from "@/components/menu/MenuBar.vue";
import ShipManager from "@/components/menu/ShipManager/index.vue";
import TeamManager from "@/components/menu/TeamManager/index.vue";
import TaskManager from "@/components/menu/TaskManagement/edit.vue";
import LegendManager from "@/components/menu/SystemManager/legendManager/index.vue";
import LineManager from "@/components/menu/SystemManager/lineManager/index.vue";
import AreaManager from "@/components/menu/SystemManager/areaManager/index.vue";
import SeaManager from "@/components/menu/SystemManager/seaManager/index.vue";
import ParamManager from "@/components/menu/SystemManager/paramManager/index.vue";
import DataitemManager from "@/components/menu/SystemManager/dataItemManager/index.vue";
import DatasourceManager from "@/components/menu/DataManager/dataSourceManager/index.vue";
import DatasourceManager1 from "@/components/menu/DataManager/dataSourceManager1/index.vue";
import DatasourceManager2 from "@/components/menu/DataManager/dataSourceManager2/index.vue";
import TyphoonManager from "@/components/menu/DataManager/typhoonManager/index.vue";

import InfoBox from "@/components/shipInfo/InfoBox.vue";

<<<<<<< HEAD
import routeManager from "@/components/menu/routeManager/edit.vue";
import algorithmManager from "@/components/menu/algorithmManager/edit.vue";
=======
import routeManager from '@/components/menu/routeManager/edit.vue'
import algorithmManager from '@/components/menu/algorithmManager/edit.vue'
import assessmentManager from '@/components/menu/assessmentManager/index.vue'
>>>>>>> 011cea5751b9be41e580e3a5389ce10bee17d096
import eventBus from "@/utils/eventBus.js";

export default {
  name: "App",
  components: {
    Earth: Earth,
    TimeBar: TimeBar,
    ToolBar: ToolBar,
    LogoGlobal: LogoGlobal,
    ParameterHeading: ParameterHeading,
    SideBar: SideBar,
    LegendBar: LegendBar,
    MenuBar: MenuBar,
    ShipManager: ShipManager,
    TeamManager: TeamManager,
    TaskManager: TaskManager,
    routeManager: routeManager,
    algorithmManager: algorithmManager,
    LegendManager: LegendManager,
    LineManager: LineManager,
    AreaManager: AreaManager,
    SeaManager: SeaManager,
    ParamManager: ParamManager,
    DataitemManager: DataitemManager,
    routeManager: routeManager,
<<<<<<< HEAD
    DatasourceManager: DatasourceManager,
    DatasourceManager1: DatasourceManager1,
    DatasourceManager2: DatasourceManager2,
    TyphoonManager:TyphoonManager,
    InfoBox: InfoBox,
=======
    DatasourceManager:DatasourceManager,
    DatasourceManager1:DatasourceManager1,
    DatasourceManager2:DatasourceManager2,
    InfoBox:InfoBox,
    assessmentManager: assessmentManager
>>>>>>> 011cea5751b9be41e580e3a5389ce10bee17d096
  },
  data() {
    return {
      timeShow: true,
    };
  },
  watch: {},
  mounted() {},
  methods: {},
};
</script>

<style lang="css">
html,
body,
#earthBox {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  position: relative;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  -khtml-user-select: none;
  user-select: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
