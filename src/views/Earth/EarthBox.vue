<template>
  <div id="earthBox">
    <!-- 地球 -->
    <earth ref="earth"/>
    <!-- 时间播放轴 -->
    <time-bar v-show="timeShow"></time-bar>
    <!-- 工具条 -->
    <tool-bar></tool-bar>
    <!-- 标题logo -->
    <logo-global></logo-global>
    <!-- 要素时间信息 -->
    <!-- <parameter-heading></parameter-heading> -->
    <!-- 气象要素菜单栏 -->
    <side-bar></side-bar>
    <!-- 图例 -->
    <legend-bar></legend-bar>
    <!-- 菜单栏 -->
    <menu-bar></menu-bar>
    <!-- 船舰管理 -->
    <ship-manager></ship-manager>
    <!-- 编队管理 -->
    <team-manager></team-manager>
    <!-- 任务管理 -->
    <task-manager></task-manager>
    <!-- 航线管理 -->
    <route-manager></route-manager>
  </div>
</template>

<script>
// 地球
import Earth from "@/views/Earth/Earth";
// 时间轴
import TimeBar from "@/components/timebar/TimeBar";
import ToolBar from '@/components/tool/ToolBar.vue';
import LogoGlobal from '@/components/tool/logoGlobal.vue'
import ParameterHeading from '@/components/tool/parameterHeading.vue'
import SideBar from '@/components/sidebar/SideBar.vue';
import LegendBar from '@/components/legendbar/legendBar.vue'
import MenuBar from '@/components/menu/MenuBar.vue'
import ShipManager from '@/components/menu/ShipManager/index.vue';
import TeamManager from '@/components/menu/TeamManager/index.vue'
import TaskManager from '@/components/menu/TaskManagement/edit.vue'
import routeManager from '@/components/menu/routeManager/edit.vue'
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
    routeManager: routeManager
  },
  data() {
    return {
      timeShow: true,
    };
  },
  watch: {
  },
  mounted() {
  },
  methods: {
  }
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
