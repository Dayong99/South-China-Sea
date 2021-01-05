<template>
  <div
    id="ship_manager"
    class="ship_manager"
    v-show="systemManagerShow"
    style="width: auto; height: auto"
    v-drag
    ref="dataliveBox"
  >
    <div class="manager_title">
      <span>实况数据</span>
      <img
        src="@/assets/images/legendbar/close.png"
        @click.stop="closeManager"
      />
    </div>
    <div class="manager_table" style="margin-top:20px;">
      <el-tabs v-model="tabName" type="border-card" @tab-click="handleClick">
        <el-tab-pane :key="'ground'" label="地面" name="ground">
          <ground ref="ground" :tabShow="flagArr[0]" />
        </el-tab-pane>
        <el-tab-pane :key="'ship'" label="船舶" name="ship">
          <ship :tabShow="flagArr[1]" />
        </el-tab-pane>
        <el-tab-pane :key="'buoy'" label="海洋浮标" name="buoy">
          <buoy :tabShow="flagArr[2]" />
        </el-tab-pane>
        <el-tab-pane :key="'station'" label="海洋站" name="station">
          <station :tabShow="flagArr[3]" />
        </el-tab-pane>
        <el-tab-pane :key="'tide'" label="潮汐" name="tide">
          <tide :tabShow="flagArr[4]" />
        </el-tab-pane>
        
      </el-tabs>
    </div>
  </div>
</template>

<script>
import Ground from "./tab/ground/index";
import Ship from "./tab/ship/index";
import Buoy from "./tab/buoy/index";
import Station from "./tab/station/index";
import Tide from "./tab/tide/index";

import { mapState, mapMutations } from "vuex";
export default {
  components: {
    Ground,
    Ship,
    Buoy,
    Station,
    Tide,
  },
  data() {
    return {
      // 详细面板显示隐藏
      systemManagerShow: false,

      tabName: "ground",
      flagArr: [true, false, false, false, false],
    };
  },
  mounted() {},
  computed: {
    ...mapState({
      menuList: (state) => state.menuBar.menuList,
      dataList: (state) => state.menuBar.dataList,
    }),
  },
  watch: {
    // 监听menuList，控制详细面板的显隐
    menuList: {
      handler(newval, oldval) {
        let i = newval.findIndex((item) => {
          return item.flag == true;
        });
        if (i !== 4) {
          this.systemManagerShow = false;
        }
      },
      deep: true,
    },
    dataList: {
      handler(newval, oldval) {
        if (newval[4].flag) {
          this.systemManagerShow = true;
        } else {
          this.systemManagerShow = false;
        }
      },
      deep: true,
    },
    systemManagerShow(val) {
      if (val) {
        this.tabName = "ground";
        this.flagArr = [true, false, false, false];
        this.$refs.dataliveBox.style.left = "50%";
        this.$refs.dataliveBox.style.top = "42%";
        this.$refs.dataliveBox.style.transform = "translate(-50%, -50%)";
        this.$refs.ground.fetch();
      }
    },
  },
  methods: {
    ...mapMutations({
      setMenuList: "menuBar/setMenuList",
    }),
    handleClick(tab) {
      this.flagArr = new Array(4).fill(false);
      if (tab.name === "ground") {
        this.flagArr[0] = true;
      } else if (tab.name === "ship") {
        this.flagArr[1] = true;
      } else if (tab.name === "buoy") {
        this.flagArr[2] = true;
      } else if (tab.name === "station") {
        this.flagArr[3] = true;
      } else if (tab.name === "tide") {
        this.flagArr[4] = true;
      } 
    },

    closeManager() {
      this.systemManagerShow = false;
      this.menuList[1].flag = false;
      this.setMenuList(this.menuList);
    },
  },
};
</script>

<style lang="scss" scoped>
.el-table .text-red {
  background: red !important;
}
.el-table .text-blue {
  color: blue !important;
}
</style>
