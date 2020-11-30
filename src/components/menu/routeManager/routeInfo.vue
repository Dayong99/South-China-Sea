<template>
  <div class="route_info">
    <transition
      enter-active-class="animated slideInUp"
      leave-active-class="animated slideOutDown"
    >
      <div class="routeInfo" ref="info" v-if="show">
        <div class="title_box">
          <div class="info_btn">
            <div class="img_box" @click="hidInfoBox">
              <img src="@/assets/images/routeInfo/btn.svg" class="btn_img" />
            </div>
            <el-switch
              v-model="routeInfoflag"
              active-text="区域"
              inactive-text="航线"
              :width="30"
            >
            </el-switch>
          </div>
          <ul>
            <li v-for="(item, index) in titleList" :key="index">
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>
        <div class="info_content">
          <ul class="ul1">
            <li v-for="(item, index) in dataList" :key="index" class="li1">
              <ul class="ul2">
                <li
                  v-for="(item1, index1) in item"
                  :key="index1"
                  class="li2"
                  :style="{
                    background:
                      index1 == 0
                        ? 'rgba(126, 24, 24, 0.5)'
                        : index1 % 2 != 0
                        ? 'rgba(255, 255, 255, 0.2)'
                        : '',
                  }"
                >
                  <div>{{ item1 }}</div>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </transition>
    <div class="img_box1" v-show="btnShow" @click="openInfoBox">
      <img src="@/assets/images/routeInfo/btn1.svg" class="btn_img1" />
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
      show: true,
      //   titleList: ["风险等级", "海浪", "风"],
      //   value: true,
      btnShow: false,
      //   dataList: [
      //     [
      //       {
      //         name: "时间",
      //         value: "2020-10-20",
      //       },
      //       {
      //         name: "风险等级",
      //         value: "1",
      //       },
      //       {
      //         name: "海浪",
      //         value: "23",
      //       },
      //       {
      //         name: "风",
      //         value: "5",
      //       },
      //     ],
      //     [
      //       {
      //         name: "时间",
      //         value: "2020-10-21",
      //       },
      //       {
      //         name: "风险等级",
      //         value: "1",
      //       },
      //       {
      //         name: "海浪",
      //         value: "23",
      //       },
      //       {
      //         name: "风",
      //         value: "5",
      //       },
      //     ],
      //     [
      //       {
      //         name: "时间",
      //         value: "2020-10-22",
      //       },
      //       {
      //         name: "风险等级",
      //         value: "1",
      //       },
      //       {
      //         name: "海浪",
      //         value: "23",
      //       },
      //       {
      //         name: "风",
      //         value: "5",
      //       },
      //     ],
      //     [
      //       {
      //         name: "时间",
      //         value: "2020-10-20",
      //       },
      //       {
      //         name: "风险等级",
      //         value: "1",
      //       },
      //       {
      //         name: "海浪",
      //         value: "23",
      //       },
      //       {
      //         name: "风",
      //         value: "5",
      //       },
      //     ],
      //     [
      //       {
      //         name: "时间",
      //         value: "2020-10-20",
      //       },
      //       {
      //         name: "风险等级",
      //         value: "1",
      //       },
      //       {
      //         name: "海浪",
      //         value: "23",
      //       },
      //       {
      //         name: "风",
      //         value: "5",
      //       },
      //     ],
      //     [
      //       {
      //         name: "时间",
      //         value: "2020-10-20",
      //       },
      //       {
      //         name: "风险等级",
      //         value: "1",
      //       },
      //       {
      //         name: "海浪",
      //         value: "23",
      //       },
      //       {
      //         name: "风",
      //         value: "5",
      //       },
      //     ],
      //     [
      //       {
      //         name: "时间",
      //         value: "2020-10-20",
      //       },
      //       {
      //         name: "风险等级",
      //         value: "1",
      //       },
      //       {
      //         name: "海浪",
      //         value: "23",
      //       },
      //       {
      //         name: "风",
      //         value: "5",
      //       },
      //     ],
      //     [
      //       {
      //         name: "时间",
      //         value: "2020-10-20",
      //       },
      //       {
      //         name: "风险等级",
      //         value: "1",
      //       },
      //       {
      //         name: "海浪",
      //         value: "23",
      //       },
      //       {
      //         name: "风",
      //         value: "5",
      //       },
      //     ],
      //     [
      //       {
      //         name: "时间",
      //         value: "2020-10-20",
      //       },
      //       {
      //         name: "风险等级",
      //         value: "1",
      //       },
      //       {
      //         name: "海浪",
      //         value: "23",
      //       },
      //       {
      //         name: "风",
      //         value: "5",
      //       },
      //     ],
      //     [
      //       {
      //         name: "时间",
      //         value: "2020-10-20",
      //       },
      //       {
      //         name: "风险等级",
      //         value: "1",
      //       },
      //       {
      //         name: "海浪",
      //         value: "23",
      //       },
      //       {
      //         name: "风",
      //         value: "5",
      //       },
      //     ],
      //     [
      //       {
      //         name: "时间",
      //         value: "2020-10-20",
      //       },
      //       {
      //         name: "风险等级",
      //         value: "1",
      //       },
      //       {
      //         name: "海浪",
      //         value: "23",
      //       },
      //       {
      //         name: "风",
      //         value: "5",
      //       },
      //     ],
      //     [
      //       {
      //         name: "时间",
      //         value: "2020-10-20",
      //       },
      //       {
      //         name: "风险等级",
      //         value: "1",
      //       },
      //       {
      //         name: "海浪",
      //         value: "23",
      //       },
      //       {
      //         name: "风",
      //         value: "5",
      //       },
      //     ],
      //     [
      //       {
      //         name: "时间",
      //         value: "2020-10-20",
      //       },
      //       {
      //         name: "风险等级",
      //         value: "1",
      //       },
      //       {
      //         name: "海浪",
      //         value: "23",
      //       },
      //       {
      //         name: "风",
      //         value: "5",
      //       },
      //     ],
      //     [
      //       {
      //         name: "时间",
      //         value: "2020-10-20",
      //       },
      //       {
      //         name: "风险等级",
      //         value: "1",
      //       },
      //       {
      //         name: "海浪",
      //         value: "23",
      //       },
      //       {
      //         name: "风",
      //         value: "5",
      //       },
      //     ],
      //   ],
    };
  },
  computed: {
    ...mapState({
      //   routeInfoflag: (state) => state.earth.routeInfoflag,
      titleList: (state) => state.routeInfo.titleList,
      dataList: (state) => state.routeInfo.dataList,
    }),
    routeInfoflag: {
      get(){
        return this.$store.state.earth.routeInfoflag;
      },
      set(value){
          this.setRouteInfoflag(value)
      },
    },
  },
  watch: {
  },
  created() {},
  mounted() {},
  methods: {
    ...mapMutations({
      setRouteInfoflag: "earth/setRouteInfoflag",
    }),
    hidInfoBox() {
      this.show = false;
      let flag = true;
      this.$refs.info.addEventListener("animationend", () => {
        if (flag) {
          console.log("动画完成");
          this.btnShow = true;
          flag = false;
        }
      });
    },
    openInfoBox() {
      this.btnShow = false;
      this.show = true;
    },
  },
};
</script>

<style lang="scss" scoped></style>
