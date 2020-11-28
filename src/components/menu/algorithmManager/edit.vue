<template>
  <el-dialog
    :title="title"
    width="1000px"
    top="80px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="algorithmShow"
    append-to-body
    @close="closeManager"
  >
    <div class="dialog_wrapper">
      <div class="tree_wrapper">
        <div class="chart" id="chart" ref="chart"></div>
      </div>

      <div class="factor_wrapper" v-if="activeFactorTitle">
        <div class="factor_title">
          {{ factorTitleList[activeFactorTitle] }}-{{ factorTitle }}
        </div>
        <div class="factor_param" v-if="activeFactorTitle === 2">
          <div
            class="factore_item"
            v-for="(item, index) in weatherFactoreOptionsList"
            :key="`weatherFactoreOptionsList${index}`"
          >
            <div class="select_desc">{{ item.parameterName }}</div>
            <div class="number_wrapper">
              <input type="text" :value="item.value" />
            </div>
            <div class="select_options">
              <div
                class="select_options_item"
                :class="{ active: item.checked[indexOptions] }"
                v-for="(itemOptions, indexOptions) in item.parameterStep.split(
                  ','
                )"
                :key="`indexOptions${indexOptions}`"
                @click="factorClick(item, index, itemOptions, indexOptions)"
              >
                {{ itemOptions }}
              </div>
            </div>
          </div>
          <div
            class="factore_item"
            v-for="(item, index) in twoFactoreOptionsList"
            :key="`twoFactoreOptionsList${index}`"
          >
            <div class="select_desc">{{ item.parameterName }}</div>
            <div class="number_wrapper">
              <input type="text" :value="item.value" />
            </div>
            <div class="select_options"></div>
          </div>
        </div>
        <div class="factor_param" v-if="activeFactorTitle === 1">
          <div
            class="factore_item"
            v-for="(item, index) in twoFactoreOptionsList"
            :key="`twoFactoreOptionsList${index}`"
          >
            <div class="select_desc">{{ item.parameterName }}</div>
            <div class="number_wrapper">
              <input type="text" :value="item.value" />
            </div>
            <div class="select_options"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="button_wrapper">
      <el-button type="primary" size="mini" @click="submit">开始评估</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import "@/utils/leaflet.ChineseTmsProviders.js";
export default {
  components: {},
  data() {
    return {
      routeInfo: {},
      shipList: [],
      teamList: [],
      taskInfo: {},
      treeData: {},
      num: 1.5,
      algorithmShow: false,
      title: "任务配置算法参数",
      value: "",
      factorTitle: "参数",
      twoFactoreOptionsList: [
        {
          parameterName: "评估权重",
          checked: [false, false, false],
          value: 0,
        },
      ],
      weatherFactoreOptionsList: [],
      factorTitle: "",
      factorTitleList: ["一级子节点参数", "二级子节点参数", "三级子节点参数"],
      activeFactorTitle: 0,
    };
  },
  computed: {
    ...mapState({
      algorithmOptions: (state) => state.menuBar.algorithmOptions,
    }),
  },
  watch: {
    algorithmOptions: {
      handler: function (val) {
        val[0] ? (this.algorithmShow = true) : (this.algorithmShow = false);
        this.routeInfo = val[1];
        this.loadTaskData(val[1]);
        this.getFactorOptions();
      },
    },
  },
  methods: {
    ...mapMutations({
      setAlgorithm: "menuBar/setAlgorithm",
    }),
    loadTaskData(item) {
      this.$get(`/api/plan/sfs`, {
        id: item.plan_Id,
      }).then((res) => {
        if (res.data.data) {
          this.taskInfo = res.data.data;
          if (res.data.data[0].type === 1) {
            this.loadShipList();
            return;
          }
          if (res.data.data[0].type === 0) {
            this.loadTeamList();
            return;
          }
        }
      });
    },
    loadTeamList() {
      this.$get(`/api/formation`).then((res) => {
        if (res.data.data) {
          this.teamList = [];
          // 取出当前任务选择的编队详细信息
          this.taskInfo.forEach((e, i) => {
            res.data.data.rows.forEach((a, b) => {
              if (a.id === e.sfId) {
                this.teamList = a;
              }
            });
          });
          this.compositionTreeStructure(this.teamList, this.taskInfo);
        }
      });
    },
    loadShipList() {
      this.$get(`/api/warship`).then((res) => {
        if (res.data.data) {
          this.shipList = [];
          this.allShipList = res.data.data;
          // 取出当前任务选择的自由编队的船舰详细信息
          this.taskInfo.forEach((e, i) => {
            res.data.data.rows.forEach((a, b) => {
              if (a.id === e.sfId) {
                let obj = a;
                obj.name = a.warshipName;
                obj.level = 1;
                obj.value = 0;
                obj.children = [];
                this.shipList.push(a);
              }
            });
          });
          this.compositionTreeStructure(this.shipList, this.taskInfo);
        }
      });
    },
    compositionTreeStructure(detailInfo, taskInfo) {
      // 选择的任务编队类型 1 为船舰 0 为编队
      const type = taskInfo[0].type;
      this.treeData = {};
      if (type === 0) {
        const idArr = detailInfo.ships.split(",");
        let teamShipList = []; // 编队包含船舰
        // this.treeData.name = detailInfo.name; // 编队名称
        this.$get(`/api/warship`)
          .then((res) => {
            if (res.data.data.rows) {
              res.data.data.rows.forEach((e, i) => {
                if (idArr.includes(String(e.id))) {
                  let obj = e;
                  obj.name = e.warshipName;
                  obj.level = 1;
                  obj.value = 0;
                  obj.children = [];
                  teamShipList.push(obj);
                }
              });
            }
          })
          .then(() => {
            let treeObj = {};
            treeObj.name = detailInfo.name;
            treeObj.level = 0;
            treeObj.children = teamShipList;
            this.treeData = treeObj;
          })
          .then(() => {
            this.$nextTick(() => {
              this.initCharts();
            });
          });
        return;
      }
      if (type === 1) {
        let treeObj = {};
        treeObj.name = "自由组队";
        treeObj.level = 0;
        treeObj.children = detailInfo;
        this.treeData = treeObj;
        this.$nextTick(() => {
          this.initCharts();
        });
      }
    },
    factorClick(item, index, itemOptions, indexOptions) {
      let checked = this.weatherFactoreOptionsList[index].checked[indexOptions]
        ? false
        : true;
      let arr = [false, false, false];
      arr[indexOptions] = checked;
      this.weatherFactoreOptionsList[index].checked = arr;
      this.$forceUpdate();
    },
    getFactorOptions() {
      this.$get(`api/parameters`, {
        isEvaluate: 1,
      }).then((res) => {
        if (res.data.data) {
          this.weatherFactoreOptionsList = res.data.data.map((e, i) => {
            return {
              ...e,
              checked: [false, false, false],
              value: 0,
            };
          });
        }
      });
    },
    reset() {
      this.routeInfo= {}
      this.shipList= []
      this.teamList= []
      this.taskInfo= {}
      this.treeData= {}
    },
    closeManager() {
      this.treeData = {};
      this.algorithmShow = false;
      this.setAlgorithm([0, {}]);
    },
    submit() {
      // 取树结构数据
      let treeArr = [
        {
          structure: 0,
          name: "-",
          value: "-",
        },
      ];
      this.treeData.children.forEach((e, i) => {
        let objTwo = {
          structure: 1,
          name: "-",
          value: 0.1,
        };
        treeArr.push(objTwo);
        if (e.children) {
          // 第二级
          e.children.forEach((a, b) => {
            // 第三级
            let objTwo = {
              structure: 2,
              name: "-",
              value: 0.1,
            };
            treeArr.push(objTwo);
            this.weatherFactoreOptionsList.forEach((c, d) => {
              c.checked.forEach((f, g) => {
                // 第四级
                if (f) {
                  let objThree = {
                    structure: 3,
                    name: `${c.id}_${c.parameterStep.split(",")[g]}`,
                    value: 0.1,
                  };
                  treeArr.push(objThree);
                }
              });
            });
          });
        }
      });
      let treeName = [];
      let treeStructure = [];
      let treeValue = [];
      let hydrometeor = [];
      treeArr.forEach((e, i) => {
        treeName.push(e.name);
        treeStructure.push(e.structure);
        treeValue.push(e.value);
        if (e.structure === 3) {
          let objHy = {
            typeId: e.name.split("_")[0],
            level: e.name.split("_")[1],
          };
          hydrometeor.push(objHy);
        }
      });

      let params = {
        courseId: this.routeInfo.id,
        planId: this.routeInfo.plan_Id,
        hydrometeor: JSON.stringify(hydrometeor),
        treeName: treeName.join(","),
        treeStructure: treeStructure.join(","),
        treeValue: treeValue.join(","),
      };
      this.$jsonPost(`/api/assessment/evaluate`, {
        ...params,
      }).then(() => {
        this.$message({
          message: "评估成功",
          type: "success",
        });
      }).then(() => {
        this.closeManager()
      }).catch(() => {
        this.$message({
          message: "评估失败",
          type: "error",
        });
      });
    },
    initCharts() {
      const chart = this.$refs.chart;
      const eChart = this.$echarts.init(chart);
      document.oncontextmenu = function () {
        return false;
      };
      eChart.off("click"); 
      eChart.on("click", LeftClick);
      eChart.off("contextmenu"); 
      eChart.on("contextmenu", RightClick);
      const data = this.treeData;
      this.$echarts.util.each(data.children, function (datum, index) {
        datum.label = {
          color: "red",
          fontSize: "16",
        };
        datum.itemStyle = {
          normal: {
            color: "#000fff",
            fontSize: "16",
            lineStyle: {
              color: "#123456",
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
            left: "15%",
            bottom: "1%",
            right: "20%",
            symbolSize: 7,
            label: {
              position: "left",
              verticalAlign: "middle",
              align: "right",
              fontSize: 14,
            },
            force: {
              layoutAnimation: false,
            },
            leaves: {
              label: {
                position: "right",
                verticalAlign: "middle",
                align: "left",
              },
            },
            expandAndCollapse: false,
            animationDuration: 0,
            animationDurationUpdate: 0,
          },
        ],
      };
      eChart.clear();
      eChart.setOption(option);
      const that = this;
      function RightClick(param) {
        let index = Number;
        that.treeData.children.forEach((e, i) => {
          if (e.id === param.data.id) {
            index = i;
          }
        });
        that.activeFactorTitle = param.data.level;
        that.factorTitle = param.name;
        const obj = {
          name: "设备",
          value: 5,
          level: 2,
        };
        that.treeData.children[index].children.push(obj);
        eChart.clear();
        eChart.setOption(option);
      }
      function LeftClick(param) {
        that.activeFactorTitle = param.data.level;
        that.factorTitle = param.name;
      }
    }
  }
};
</script>



<style lang="scss" scoped>
.dialog_wrapper {
  width: 1250px;
  height: 500px;
  display: flex;
  padding-left: 10px;
  .tree_wrapper {
    width: 600px;
    #chart {
      width: 600px;
      height: 500px;
    }
  }
  .factor_wrapper {
    margin-top: 100px;
    width: 350px;
    height: 300px;
    line-height: 20px;
    .factor_title {
      font-weight: 700;
      padding-left: 8px;
    }
    .select_desc {
      width: 150px;
    }
    .number_wrapper {
      width: 60px;
      height: 200px;
      input {
        width: 40px;
        outline: none;
        border: none;
        border: 1px solid #ccc;
        border-radius: 5px;
      }
    }
    .factor_param {
      width: 350px;
      height: 200px;
      padding: 2px 5px 5px 5px;
      border-radius: 5px;

      .factore_item {
        flex: 1;
        justify-content: space-between;
        padding: 5px;
        height: 35px;
        display: flex;
        .select_options {
          display: flex;
          width: 130px;
          .select_options_item {
            cursor: pointer;
            line-height: 22px;
            flex: 1;
            width: 40px;
            margin-left: 4px;
            text-align: center;
            border-radius: 5px;
          }
          .active {
            color: #ffffff;
            background: #981a00;
          }
        }
      }
    }
  }
}
.button_wrapper {
  position: absolute;
  bottom: 25px;
  right: 50px;
}
</style>