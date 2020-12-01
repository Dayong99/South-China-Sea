<template>
  <div id="algorith_manager" class="algorithm_manager" v-show="algorithmShow">
    <div class="manager_title">
      <span>算法参数配置</span>
      <img
        src="@/assets/images/legendbar/close.png"
        @click.stop="closeManager"
      />
    </div>
    <div class="manager_operation">
      <el-input placeholder="请输入内容" v-model="alor_type"> </el-input>
      <el-button class="operation_add" @click="submit">开始评估</el-button>
    </div>
    <div class="manager_table">
      <div class="tree_wrapper">
        <div id="tree">树</div>
      </div>
      <div class="factor_wrapper" v-if="activeFactorTitle">
        <div class="factor_title" v-if="activeFactorTitle === 2">
          {{ factorTitleList[activeFactorTitle] }}-{{ factorTitle }}
        </div>
        <div class="factor_param" v-if="activeFactorTitle === 2">
          <div
            class="factore_item"
            v-for="(item, index) in treeData.children[activeWeather.index]
              .children[activeWeather.childIndex].weatherFactor"
            :key="`weatherFactoreOptionsList${index}`"
          >
            <div class="select_desc">{{ item.parameterName }}</div>
            <div class="number_wrapper">
              <input type="text" v-model="item.value" />
            </div>
            <div class="number_wrapper">
              <input type="text" v-model="item.type" />
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
        </div>
      </div>

      <el-dialog
        title="添加船舰影响因素"
        :visible.sync="addThirdNode"
        width="350px"
        center
        append-to-body
      >
        <el-form ref="form" :model="addThirdform" label-width="80px">
          <el-form-item label="因素名称">
            <el-input v-model="addThirdform.name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="addThirdNode = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="addThirdNodeConfirm"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  components: {},
  data() {
    return {
      alor_type: 0,
      inputStyle: {
        width: "30px",
        height: "20px",
        outline: "none",
      },
      addThirdform: {
        name: null,
      },
      activeSecondNode: null,
      addThirdNode: false,
      algorithmShow: false,
      routeInfo: {},
      shipList: [],
      taskInfo: {},
      teamList: [],
      factorTitle: "",
      labelClassName: "bg-color-orange",
      treeData: {
        label: "一级节点",
        level: 0,
        children: [
          {
            label: "二级节点-01",
            level: 2,
          },
          {
            label: "二级节点-02",
            level: 1,
          },
        ],
      },
      activeWeather: {},
      weatherFactoreOptionsList: [],
      activeFactorTitle: 0,
      factorTitleList: ["一级子节点参数", "二级子节点参数", "三级子节点参数"],
      twoFactoreOptionsList: [
        {
          parameterName: "评估权重",
          checked: [false, false, false],
          value: 0,
        },
      ],
    };
  },
  computed: {
    ...mapState({
      algorithmOptions: (state) => state.menuBar.algorithmOptions,
    }),
  },
  watch: {
    // 监听menuList，控制详细面板的显隐
    algorithmOptions: {
      handler(val) {
        val[0] ? (this.algorithmShow = true) : (this.algorithmShow = false);
        this.routeInfo = val[1];
        this.loadTaskData(val[1]);
        this.getFactorOptions();
        // G6树
        this.initG6();
      },
      deep: true,
    },
  },

  methods: {
    ...mapMutations({
      setAlgorithm: "menuBar/setAlgorithm",
    }),
    initG6() {
      const data = {
        // 点集
        nodes: [
          {
            id: "node0", // 元素的 id
            class: "c0", // 元素的图形
            label: "开始", // 标签文字
            labelCfg: {
              //文字配置
              style: {
                fill: "red",
              },
            },
            // x: 100,      // Number，可选，节点位置的 x 值
            // y: 200,       // Number，可选，节点位置的 y 值
          },
          {
            id: "node1", // String，该节点存在则必须，节点的唯一标识
            class: "c1",
            label: "节点1", // 节点文本
            color: "#000",
            labelCfg: {
              position: "bottom",
            },
          },
          {
            id: "node2", // String，该节点存在则必须，节点的唯一标识
            class: "c2",
            label: "节点2", // 节点文本
          },
          {
            id: "node3",
            img:
              "https://yyb.gtimg.com/aiplat/page/product/visionimgidy/img/demo6-16a47e5d31.jpg?max_age=31536000",
            shape: "image",
            size: 50,
            labelCfg: {
              position: "bottom",
            },
          },
          {
            id: "node4", // String，该节点存在则必须，节点的唯一标识
            class: "c3",
            label: "目标点", // 节点文本
            anchorPoints: [
              [0.5, 0.5],
              [1, 0.5],
            ],
          },
          {
            id: "node0.1", // 元素的 id       // 元素的图形
            // label: 'node0.1',
            x: 200,
            y: 300,
            shape: "modelRect",
            size: [100, 40],
            label: "你好你好你好",
            preRect: {
              // 设置为false，则不显示
              show: false,
            },
            labelCfg: {
              //文字向左偏移量
              offset: 5, // 标签配置属性
              positions: "left", // 标签的属性，标签在元素中的位置
              style: {
                // 包裹标签样式属性的字段 style 与标签其他属性在数据结构上并行
                fontSize: 12, // 标签的样式属性，文字字体大小
              },
            },
            logoIcon: {
              //左侧
              show: true,
              width: 12,
              height: 12,
              offset: -10,
              img:
                "https://gw.alipayobjects.com/zos/basement_prod/c781088a-c635-452a-940c-0173663456d4.svg",
            },
            stateIcon: {
              //右侧
              show: false,
            },
          },
        ],
        // 边集
        edges: [
          {
            // 表示一条从 node1 节点连接到 node2 节点的边
            source: "node0", // String，必须，起始点 id
            target: "node4", // String，必须，目标点 id
          },
          {
            source: "node0",
            target: "node0.1",
          },
          {
            source: "node0.1",
            target: "node4",
          },
        ],
      };
      const nodes = data.nodes;
      const graph = new this.$G6.Graph({
        // 1.画图挂载容器id
        container: "mountNode",
        // 1.1容器宽高
        width: 800,
        height: 600,
        fitView: true,
        fitViewPadding: [20, 40, 50, 20],
        // 节点在默认状态下的样式配置（style）和其他配置
        defaultNode: {
          // 节点上的标签文本配置
          labelCfg: {
            // 节点上的标签文本样式配置
            style: {
              fill: "#000", // 节点标签文字颜色
              fontSize: 11,
            },
          },
        },
        //边默认的属性，包括边的一般属性和样式属性（style）。
        defaultEdge: {
          shape: "line",
          color: "#000",
          endArrow: true,
          startArrow: true,
          labelCfg: {
            autoRotate: true,
          },
          style: {
            //箭头
            endArrow: {
              path: "M 4,0 L -4,-4 L -4,4 Z",
              d: 4,
            },
          },
        },
      });
      // 读取 data 中的数据源到图上
      graph.data(data);
      // 渲染图
      graph.render();
      fitView: true; //设置是否将图适配到画布中；
      // fitViewPadding: [20, 40, 50, 20]//画布上四周的留白宽度。
    },
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
    factorClick(item, index, itemOptions, indexOptions) {
      console.log(
        this.treeData.children[this.activeWeather.index].children[
          this.activeWeather.childIndex
        ].weatherFactor[index],
        item,
        index,
        itemOptions,
        indexOptions,
        `factorClick`
      );
      let checked = this.treeData.children[this.activeWeather.index].children[
        this.activeWeather.childIndex
      ].weatherFactor[index].checked[indexOptions]
        ? false
        : true;
      let arr = [false, false, false];
      arr[indexOptions] = checked;
      this.treeData.children[this.activeWeather.index].children[
        this.activeWeather.childIndex
      ].weatherFactor[index].checked = arr;
      console.log(
        this.treeData.children[this.activeWeather.index].children[
          this.activeWeather.childIndex
        ].weatherFactor[index],
        `aaaaaa`
      );
      this.$forceUpdate();
    },
    addThirdNodeConfirm() {
      let index = Number;
      console.log(this.treeData, this.addThirdform);
      this.treeData.children.forEach((e, i) => {
        if (this.activeSecondNode.id === e.id) {
          index = i;
          return;
        }
      });
      console.log(
        this.weatherFactoreOptionsList,
        `this.weatherFactoreOptionsList 原型`
      );
      this.treeData.children[index].children.push({
        label: this.addThirdform.name,
        level: 2,
        value: 0,
        id: this.activeSecondNode.id,
        weatherFactor: JSON.parse(
          JSON.stringify(this.weatherFactoreOptionsList)
        ),
      });
      this.addThirdNode = false;
      this.addThirdform = {
        name: null,
      };
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
              type: 0,
            };
          });
        }
      });
    },
    closeManager() {
      this.algorithmShow = false;
      this.setAlgorithm([0, {}]);
      this.activeFactorTitle = 0;
    },
    NodeClick(e, data) {
      this.activeFactorTitle = data.level;
      this.factorTitle = data.label;
    },
    renderContent(h, data) {
      return (
        <span>
          <span onclick={() => this.info(data)}>{data.label} </span>
          <input
            v-model={data.value}
            style={this.inputStyle}
            type="text"
            v-show={data.level}
          />
          <span onclick={() => this.open(data)} v-show={data.level === 1}>
            ➕
          </span>
          <span onclick={() => this.open(data)} v-show={data.level === 2}>
            ➖
          </span>
        </span>
      );
    },
    open(data) {
      console.log(data, `data`);
      if (data.level === 0) {
        return;
      } // 一级节点
      if (data.level === 1) {
        this.addThirdNode = true;
        this.activeSecondNode = data;
      } // 二级节点
      if (data.level === 2) {
        this.$confirm(`确认删除${data.label}节点么`, {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.deleteTreeData(data);
        });
      } // 三级节点
    },
    info(data) {
      console.log(this.treeData, data, `info查看信息`);
      if (data.level === 2) {
        this.activeWeather = data;

        let index = Number;
        let childIndex = Number;
        this.treeData.children.forEach((e, i) => {
          if (data.id === e.id) {
            index = i;
            e.children.forEach((a, b) => {
              if (a.label === data.label) {
                childIndex = b;
              }
            });
          }
        });
        this.activeWeather = {
          ...this.activeWeather,
          index: index,
          childIndex: childIndex,
        };
        console.log(this.activeWeather, `this.activeWeather`);
        console.log(this.treeData, `treeData`);
      }
    },
    deleteTreeData(data) {
      let index = Number;
      let childIndex = Number;
      this.treeData.children.forEach((e, i) => {
        if (e.id === data.id) {
          index = i;
          e.children.forEach((a, b) => {
            if (a.label === data.label) {
              childIndex = b;
            }
          });
        }
      });
      this.treeData.children[index].children.splice(childIndex, 1);
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
                obj.label = a.warshipName;
                this.shipList.push(a);
              }
            });
          });
          this.compositionTreeStructure(this.shipList, this.taskInfo);
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
    compositionTreeStructure(detailInfo, taskInfo) {
      // 选择的任务编队类型 1 为船舰 0 为编队
      const type = taskInfo[0].type;
      this.treeData = {};
      if (type === 0) {
        const idArr = detailInfo.ships.split(",");
        let teamShipList = []; // 编队包含船舰
        this.$get(`/api/warship`)
          .then((res) => {
            if (res.data.data.rows) {
              res.data.data.rows.forEach((e, i) => {
                if (idArr.includes(String(e.id))) {
                  let obj = e;
                  obj.name = e.warshipName;
                  obj.label = e.warshipName;
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
            treeObj.label = detailInfo.name;
            treeObj.level = 0;
            treeObj.children = teamShipList;
            this.treeData = treeObj;
          });
        return;
      }
      if (type === 1) {
        let treeObj = {};
        treeObj.name = "自由组队";
        treeObj.level = 0;
        treeObj.label = "自由组队";
        treeObj.children = detailInfo;
        this.treeData = treeObj;
        console.log(this.treeData);
      }
    },
    submit() {
      // 取树结构数据
      let treeArr = [
        {
          structure: 0,
          name: "-",
          value: "-",
          type: "-",
        },
      ];
      this.treeData.children.forEach((e, i) => {
        console.log(e, `treeDatatreeDatatreeDatatreeDatatreeData`);
        let objTwo = {
          structure: 1,
          name: "-",
          value: e.value,
          type: "-",
        };
        treeArr.push(objTwo);
        if (e.children) {
          // 第二级
          e.children.forEach((a, b) => {
            // 第三级
            let objTwo = {
              structure: 2,
              name: "-",
              value: a.value,
              type: "-",
            };
            treeArr.push(objTwo);
            console.log(a, `二级`);
            a.weatherFactor.forEach((c, d) => {
              c.checked.forEach((f, g) => {
                // 第四级
                console.log(c, d, f, g, `weatherFactoreOptionsList`);
                if (f) {
                  let objThree = {
                    structure: 3,
                    name: `${c.id}_${c.parameterStep.split(",")[g]}`,
                    value: a.value,
                    type: "1",
                  };
                  treeArr.push(objThree);
                }
              });
            });
          });
        }
      });
      console.log(treeArr, `treeArr`);
      let treeName = [];
      let treeStructure = [];
      let treeValue = [];
      let hydrometeor = [];
      let treeType = [];
      treeArr.forEach((e, i) => {
        treeName.push(e.name);
        treeStructure.push(e.structure);
        treeValue.push(e.value);
        treeType.push(e.type);
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
        treeType: treeType.join(","),
        algorithm_Type: this.alor_type,
      };
      this.$jsonPost(`/api/assessment/evaluate`, {
        ...params,
      })
        .then(() => {
          this.$message({
            message: "评估成功",
            type: "success",
          });
        })
        .then(() => {
          this.closeManager();
        })
        .catch(() => {
          this.$message({
            message: "评估失败",
            type: "error",
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>