<template>
  <div
    id="algorith_manager"
    class="algorithm_manager"
    v-show="algorithmShow"
    v-loading="loading"
  >
    <div class="manager_title">
      <span>评估参数配置</span>
      <img
        src="@/assets/images/legendbar/close.png"
        @click.stop="closeManager"
      />
    </div>
    <div class="manager_operation" v-if="showInfo">
      <div>
        <span>评估名称:{{ formData.assessName }}</span>
        <span>评估类型: {{ formData.algorithm_Type }}</span>
        <span>评估时间: {{ formData.assesstime }}</span>
      </div>
    </div>
    <div class="manager_operation" v-if="!showInfo">
      <el-input
        class="manager_input"
        placeholder="请输入评估名称"
        v-model="formData.assessName"
      ></el-input>
      <select
        class="manager_select"
        placeholder="请选择评估模型"
        v-model="formData.algorithm_Type"
      >
        <option
          v-for="item in alorithOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></option>
      </select>
      <select
        class="manager_select"
        placeholder="请选择起报时间"
        v-model="formData.time"
        style="margin-left: 15px"
      >
        <option
          v-for="item in ['02', '08', '14', '20']"
          :key="item"
          :label="item"
          :value="item"
        ></option>
      </select>
      <el-button class="operation_add" @click="submit">开始评估</el-button>
    </div>
    <div class="manager_table">
      <div class="tree_wrapper">
        <div id="tree" class="tree" ref="tree"></div>
      </div>
      <div class="factor_wrapper" v-if="activeNodeIndex[1] > -1">
        <div class="factor_title">{{ this.title }}</div>
        <div class="factor_content_wrapper">
          <ul class="factor_content_title">
            <li class="weather">天气要素</li>
            <li class="ratio">权重</li>
            <li class="option">参数</li>
            <li class="condition">条件因子</li>
          </ul>
          <div class="factor_content">
            <ul
              class="factor_content_items"
              v-for="(item, index) in mockData.children[activeNodeIndex[0]]
                .children[activeNodeIndex[1]].weatherFactor"
              :key="index"
            >
              <li
                @click="item.checked = !item.checked"
                class="weather"
                :class="{ active: item.checked }"
              >
                {{ item.parameterName }}
              </li>
              <!-- 权重 -->
              <li class="ratio">
                <input type="text" v-model="item.value" :disabled="showInfo" />
              </li>
              <!-- 气象参数 -->
              <li class="option">
                <select
                  class="options_select"
                  v-model="item.parameterStepValue"
                  :disabled="showInfo"
                >
                  <option
                    v-for="(
                      itemparameterStep, indexparameterStep
                    ) in item.parameterStep.split(',')"
                    :key="indexparameterStep"
                    :label="itemparameterStep"
                    :value="itemparameterStep"
                  ></option>
                </select>
              </li>
              <!-- 条件因子默认选择项 -->
              <li class="option">
                <select
                  class="options_select"
                  v-model="item.activeCondition"
                  :disabled="showInfo"
                >
                  <option
                    v-for="(itemcondition, indexcondition) in item.condition"
                    :key="`condition${indexcondition}`"
                    :label="itemcondition.remark"
                    :value="itemcondition.remark"
                  ></option>
                </select>
              </li>
              <!-- 条件因子 -->
              <li class="condition">
                <!-- 上 -->
                <div class="condition_top">
                  <div class="item">很好</div>
                  <div class="item">
                    <select
                      v-model="
                        item.condition[item.activeConditionIndex].expression
                      "
                      :disabled="showInfo"
                    >
                      <option
                        v-for="(item, index) in ['>', '<', '<=', '>=']"
                        :key="index"
                        :label="item"
                        :value="item"
                      ></option>
                    </select>
                  </div>
                  <div class="item">
                    <input
                      type="text"
                      v-model="
                        item.condition[item.activeConditionIndex].parameter1
                      "
                      :disabled="showInfo"
                    />
                  </div>

                  <div class="item">好</div>
                  <div class="item">
                    <select
                      v-model="
                        item.condition[item.activeConditionIndex].expression
                      "
                      :disabled="showInfo"
                    >
                      <option
                        v-for="(item, index) in ['>', '<', '<=', '>=']"
                        :key="index"
                        :label="item"
                        :value="item"
                      ></option>
                    </select>
                  </div>
                  <div class="item">
                    <input
                      type="text"
                      v-model="
                        item.condition[item.activeConditionIndex].parameter2
                      "
                      :disabled="showInfo"
                    />
                  </div>

                  <div class="item">中</div>
                  <div class="item">
                    <select
                      v-model="
                        item.condition[item.activeConditionIndex].expression
                      "
                      :disabled="showInfo"
                    >
                      <option
                        v-for="(item, index) in ['>', '<', '<=', '>=']"
                        :key="index"
                        :label="item"
                        :value="item"
                      ></option>
                    </select>
                  </div>

                  <div class="item">
                    <input
                      type="text"
                      v-model="
                        item.condition[item.activeConditionIndex].parameter3
                      "
                      :disabled="showInfo"
                    />
                  </div>
                  <div class="item">差</div>
                  <div class="item">
                    <select
                      v-model="
                        item.condition[item.activeConditionIndex].expression
                      "
                      :disabled="showInfo"
                    >
                      <option
                        v-for="(item, index) in ['>', '<', '<=', '>=']"
                        :key="index"
                        :label="item"
                        :value="item"
                      ></option>
                    </select>
                  </div>
                  <div class="item">
                    <input
                      type="text"
                      v-model="
                        item.condition[item.activeConditionIndex].parameter4
                      "
                      :disabled="showInfo"
                    />
                  </div>
                  <div class="item">很差</div>
                  <div class="item item-Company">{{ item.units }}</div>
                </div>
                <!-- 下 -->
                <div class="condition_down">
                  <div class="item"></div>
                  <div class="item"></div>
                  <div class="item">
                    <input
                      type="text"
                      v-model="
                        item.condition[item.activeConditionIndex].coefficient1
                      "
                      :disabled="showInfo"
                    />
                  </div>
                  <div class="item"></div>
                  <div class="item"></div>
                  <div class="item">
                    <input
                      type="text"
                      v-model="
                        item.condition[item.activeConditionIndex].coefficient2
                      "
                      :disabled="showInfo"
                    />
                  </div>
                  <div class="item"></div>
                  <div class="item"></div>
                  <div class="item">
                    <input
                      type="text"
                      v-model="
                        item.condition[item.activeConditionIndex].coefficient3
                      "
                      :disabled="showInfo"
                    />
                  </div>
                  <div class="item"></div>
                  <div class="item"></div>
                  <div class="item">
                    <input
                      type="text"
                      v-model="
                        item.condition[item.activeConditionIndex].coefficient4
                      "
                      :disabled="showInfo"
                    />
                  </div>
                  <div class="item"></div>
                  <div class="item"></div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="factor_wrapper" v-else></div>
    </div>

    <el-dialog
      title="修改船舰参数"
      :visible.sync="editNodeName"
      width="350px"
      center
      append-to-body
    >
      <el-form ref="form" :model="editNodeName" label-width="80px">
        <el-form-item label="装备类型" v-if="!(activeNodeIndex[1] === -1)">
          <el-input v-model="editNodeInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="装备名称" v-if="!(activeNodeIndex[1] === -1)">
          <el-input v-model="editNodeInfo.label"></el-input>
        </el-form-item>
        <el-form-item label="权重">
          <el-input v-model="editNodeInfo.WeightRatio"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="editNodeName = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="confirmNodeName"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { colors, defaultConfig } from "./g6-tree-data.js";
export default {
  components: {},
  data() {
    return {
      loading: false,
      routeInfo: {},
      title: null,
      // 编辑节点名称
      editNodeName: false,
      formData: {
        algorithm_Type: "1",
        assessName: null,
        time: null,
        assesstime: null,
      },
      editNodeInfo: {
        name: null,
        WeightRatio: 0,
        label: "02",
      },
      algorithmShow: false,
      alorithOptions: [
        {
          value: "1",
          label: "评估模型1",
        },
        {
          value: "2",
          label: "评估模型2",
        },
        {
          value: "3",
          label: "评估模型3",
        },
      ],
      weatherFactoreOptionsList: [],
      mockData: {},
      treeChart: null,
      activeNodeIndex: [],
      showInfo: false,
    };
  },
  computed: {
    ...mapState({
      algorithmOptions: (state) => state.menuBar.algorithmOptions,
    }),
  },

  watch: {
    algorithmOptions: {
      handler(val) {
        val[0] ? (this.algorithmShow = true) : (this.algorithmShow = false);
        if (this.treeChart) {
          this.treeChart.destroy();
        }
        this.treeChart = null;
        this.routeInfo = val[1];
        // 新增评估
        if (val[0] === 1) {
          this.getFactorOptions();
          this.loadTaskData(val[1]);
        }
        // 查看评估参数
        if (val[0] === 2) {
          console.log(`查看配置参数`, val);
          this.showInfo = true;
          this.getAlorithInfo(val[1]);
        }
      },
      deep: true,
    },
  },

  methods: {
    ...mapMutations({
      setAlgorithm: "menuBar/setAlgorithm",
    }),
    // 修改节点名称
    confirmNodeName() {
      console.log(this.mockData, `shushu`, this.activeNodeIndex);
      if (this.activeNodeIndex[1] === -1) {
        this.editNodeName = false;
        console.log(this.mockData.children[this.activeNodeIndex[0]]);
        this.mockData.children[this.activeNodeIndex[0]] = this.editNodeInfo;
      }
      if (this.activeNodeIndex[1] > -1) {
        this.editNodeName = false;
        console.log(
          `编辑子级子节点`,
          this.mockData.children[this.activeNodeIndex[0]].children[
            this.activeNodeIndex[1]
          ]
        );
        this.mockData.children[this.activeNodeIndex[0]].children[
          this.activeNodeIndex[1]
        ] = this.editNodeInfo;
      }
      this.activeNodeIndex = [];
      this.treeChart.changeData(this.mockData);
    },
    // 关闭评估窗口
    closeManager() {
      this.algorithmShow = false;
      this.setAlgorithm([0, {}]);
      this.title = null;
      this.activeNodeIndex = [];
      this.editNodeInfo = {
        name: null,
        WeightRatio: 0,
        label: "02",
      };
      this.formData = {
        algorithm_Type: "1",
        assessName: null,
        time: null,
        assesstime: null,
      };
      this.editNodeName = false;
      this.showInfo = false;
    },
    // 获取评估配置参数
    getAlorithInfo(item) {
      console.log(item.id, `评估id`);
      this.$get(`/api/assessment`, {
        courseId: item.courseId,
        id: item.id,
      }).then((res) => {
        console.log(`树结果`, res.data.data);
        if (res.status === 200) {
          const data = res.data.data[0];
          console.log(data.algorithm_type, `data`);
          // this.infoTransTree(data);
          this.formData.algorithm_Type = data.algorithmType;
          this.formData.assessName = data.assessName;
          this.formData.assesstime = data.assesstime;
          console.log(this.formData, `this.formData`);
          const treeObj = JSON.parse(data.treeDeploy);
          this.mockData = treeObj;
          this.initG6();
        }
      });
    },
    // 根据配置信息转为树结构
    // infoTransTree(data) {
    //   console.log(data, `根据这个数据转为树`);
    //   //     id: '1',
    //   // name: '编队',
    //   // count: 123456,
    //   // label: '编队1', // 编队
    //   // status: 'B',
    //   // WeightRatio: '',
    //   // level: 0,
    //   // control: '',
    //   // variableUp: false,
    //   let coefficientArr = data.treeCoefficient.split(",");
    //   let parameterArr = data.treeParameter.split(",");
    //   let deployArr = data.treeDeploy.split(",");
    //   let expressionArr = data.treeExpression.split(",");
    //   let structureArr = data.treeStructure.split(",");
    //   let valueArr = data.treeValue.split(",");
    //   let nameArr = data.treeName.split(",");
    //   console.log(
    //     coefficientArr,
    //     parameterArr,
    //     deployArr,
    //     expressionArr,
    //     structureArr,
    //     valueArr,
    //     nameArr,
    //     `coefficientArr`
    //   );
    //   let treeObj = {};
    //   structureArr.forEach((e, i) => {
    //     if (e === "0") {
    //       let obj = {};
    //       obj.id = "1";
    //       obj.name = deployArr[i].split("_")[0];
    //       obj.label = deployArr[i].split("_")[1];
    //       obj.count = 123456;
    //       obj.status = "B";
    //       obj.WeightRatio = "";
    //       obj.level = 0;
    //       (obj.control = ""), (obj.variableUp = false);
    //       obj.children = [];
    //       treeObj = obj;
    //     }
    //     // 判断第二层节点范围
    //     if (e === "1") {
    //       let objTwo = {};
    //       objTwo.id = `1${i}`;
    //       objTwo.name = deployArr[i].split("_")[0];
    //       objTwo.label = deployArr[i].split("_")[1];
    //       objTwo.count = 123456;
    //       objTwo.status = "B";
    //       objTwo.WeightRatio = valueArr[i].split("_");
    //       objTwo.level = 1;
    //       (objTwo.control = ""), (objTwo.variableUp = false);
    //       objTwo.children = [];
    //       console.log(objTwo, `objTwo`);
    //       treeObj.children.push(objTwo);
    //     }
    //     if (e === "2") {
    //       // 判断前面有几个一节点
    //       console.log(i, `222222222222222222222222222222222222222222222222`);
    //       console.log(structureArr.splice(i), `截取截取截取截取`);
    //     }
    //   });

    //   this.mockData = treeObj;
    //   console.log(this.mockData, `mockDatamockData`);
    //   this.initG6();
    // },
    // 初始化树结构
    initG6() {
      console.log("初始化g6");
      console.log(this.treeChart, `treeChart`);
      if (this.treeChart) {
        this.treeChart.destroy();
      }
      // 自定义节点、边
      const registerFn = () => {
        /**
         当内置节点不满足需求
         可以通过 G6.registerNode(nodeName, options, extendedNodeName) 方法
         自定义节点
         */
        this.$G6.registerNode(
          "flow-rect",
          {
            shapeType: "flow-rect",
            draw(cfg, group) {
              const {
                name = "", // 编队名字
                WeightRatio, // 权重比
                level, // 层级
                label,
                collapsed,
                status,
                rate,
                control,
              } = cfg;
              const rectConfigActive = {
                width: 202,
                height: 60,
                lineWidth: 2,
                fontSize: 12,
                fill: "#fff5f1",
                radius: 4,
                stroke: "#fc9d85",
                opacity: 0.8,
              }; // 树 矩形样式 激活样式
              const rectConfig = {
                width: 202,
                height: 60,
                lineWidth: 2,
                fontSize: 12,
                fill: "#ffffff",
                radius: 4,
                stroke: "#ccc",
                opacity: 1,
                cursor: "pointer",
              }; // 树 矩形样式
              const nodeOrigin = {
                x: -rectConfig.width / 2,
                y: -rectConfig.height / 2,
              };
              const textConfig = {
                textAlign: "left",
                textBaseline: "bottom",
              };

              const rect = group.addShape("rect", {
                attrs: {
                  x: nodeOrigin.x,
                  y: nodeOrigin.y,
                  ...rectConfig,
                },
                name: "rect-shape",
              }); // 树 外边框样式加到流程图中
              const rectBBox = rect.getBBox();
              // 节点类型
              group.addShape("text", {
                attrs: {
                  ...textConfig,
                  x: 12 + nodeOrigin.x,
                  y: 20 + nodeOrigin.y,
                  text: name.length > 28 ? name.substr(0, 28) + "..." : name,
                  fontSize: 12,
                  opacity: 0.85,
                  fill: "#d1d1d1",
                },
                name: "name-shape",
              }); // 节点类型

              const labelName = group.addShape("text", {
                attrs: {
                  ...textConfig,
                  x: 12 + nodeOrigin.x,
                  y: rectBBox.maxY - 12,
                  text: label,
                  fontSize: 16,
                  fill: "#000",
                  opacity: 0.85,
                  cursor: "pointer",
                },
                name: "collapse-label",
              }); // 节点名称

              const Ratio = group.addShape("text", {
                attrs: {
                  ...textConfig,
                  x: rectBBox.maxX - 8,
                  y: rectBBox.maxY - 12,
                  text: WeightRatio,
                  fontSize: 12,
                  textAlign: "right",
                  fill: colors[status],
                },
              }); // 权重比内容
              const circle = group.addShape("marker", {
                attrs: {
                  ...textConfig,
                  x: Ratio.getBBox().minX - 9,
                  y: rectBBox.maxY - 12 - 7,
                  symbol: "circle",
                  r: 4,
                  fill: level > 0 ? colors[status] : "#ffffff",
                },
              }); //  权重占比边圆点
              const controlButton = group.addShape("text", {
                attrs: {
                  ...textConfig,
                  x: rectBBox.maxX - 15,
                  y: rectBBox.maxY - 40,
                  text: control,
                  fontSize: 16,
                  textAlign: "right",
                  fill: colors[status],
                  cursor: "pointer",
                },
                name: "collapse-control",
                modelId: cfg.id,
              }); // 节点控制增删按钮
              const bottomBackRect = group.addShape("rect", {
                attrs: {
                  x: nodeOrigin.x,
                  y: rectBBox.maxY - 4,
                  width: rectConfig.width,
                  height: 4,
                  radius: [0, 0, rectConfig.radius, rectConfig.radius],
                  fill: "#E0DFE3",
                },
              }); // 底部矩形条

              const bottomRect = group.addShape("rect", {
                attrs: {
                  x: nodeOrigin.x,
                  y: rectBBox.maxY - 4,
                  width: WeightRatio * rectBBox.width,
                  height: 4,
                  radius: [0, 0, 0, rectConfig.radius],
                  fill: colors[status],
                },
              }); // 底部矩形条 随权重变化的有色矩形条

              if (cfg.children && cfg.children.length) {
                group.addShape("rect", {
                  attrs: {
                    x: rectConfig.width / 2 - 8,
                    y: -8,
                    width: 16,
                    height: 16,
                    stroke: "rgba(0, 0, 0, 0.25)",
                    cursor: "pointer",
                    fill: "#fff",
                  },
                  name: "collapse-back",
                  modelId: cfg.id,
                }); //  判断是否展开 添加 加减号边框
                group.addShape("text", {
                  attrs: {
                    x: rectConfig.width / 2,
                    y: -1,
                    textAlign: "center",
                    textBaseline: "middle",
                    text: collapsed ? "+" : "-",
                    fontSize: 16,
                    cursor: "pointer",
                    fill: "rgba(0, 0, 0, 0.25)",
                  },
                  name: "collapse-text",
                  modelId: cfg.id,
                });
              } //  判断是否展开 添加 加减号内容

              this.drawLinkPoints(cfg, group);
              return rect;
            },
            update(cfg, item) {
              const group = item.getContainer();
              this.updateLinkPoints(cfg, group);
            },
            setState(name, value, item) {
              if (name === "collapse") {
                const group = item.getContainer();
                const collapseText = group.find(
                  (e) => e.get("name") === "collapse-text"
                );
                if (collapseText) {
                  if (!value) {
                    collapseText.attr({
                      text: "-",
                    });
                  } else {
                    collapseText.attr({
                      text: "+",
                    });
                  }
                }
              }
            },
            getAnchorPoints() {
              return [
                [0, 0.5],
                [1, 0.5],
              ];
            },
          },
          "rect"
        );
        /**
         当内置的边不能满足需求
         可以通过 registerEdge(edgeName, options, extendedEdgeName) 方法
         自定义的边。
        */
        this.$G6.registerEdge(
          "flow-cubic",
          {
            getControlPoints(cfg) {
              let controlPoints = cfg.controlPoints; // 指定controlPoints 布局连线的控制点
              if (!controlPoints || !controlPoints.length) {
                const { startPoint, endPoint, sourceNode, targetNode } = cfg;
                const {
                  x: startX,
                  y: startY,
                  coefficientX,
                  coefficientY,
                } = sourceNode ? sourceNode.getModel() : startPoint;
                const { x: endX, y: endY } = targetNode
                  ? targetNode.getModel()
                  : endPoint;
                let curveStart = (endX - startX) * coefficientX;
                let curveEnd = (endY - startY) * coefficientY;
                curveStart = curveStart > 40 ? 40 : curveStart;
                curveEnd = curveEnd < -30 ? curveEnd : -30;
                controlPoints = [
                  { x: startPoint.x + curveStart, y: startPoint.y },
                  { x: endPoint.x + curveEnd, y: endPoint.y },
                ];
              }
              return controlPoints;
            },
            getPath(points) {
              const path = [];
              path.push(["M", points[0].x, points[0].y]);
              path.push([
                "C",
                points[1].x,
                points[1].y,
                points[2].x,
                points[2].y,
                points[3].x,
                points[3].y,
              ]);
              return path;
            },
          },
          "single-line"
        );
      };

      registerFn(); // 执行自定义点和边设置函数
      console.log("自定义节点和边方法执行完毕--------------------------");
      const props = {
        data: this.mockData,
        config: {
          padding: [20, 50],
          defaultLevel: 3,
          defaultZoom: 0.8,
          modes: {
            default: ["zoom-canvas", "drag-canvas"],
          },
        },
      };
      const { data } = props;
      console.log(data, this.treeChart, `---取值`);

      const initGraph = (data) => {
        console.log(data, `----初始化图表`);
        if (!data) {
          return;
        } // 图表数据不存在则停止初始化
        console.log(`----开始初始化图表`);
        const { config } = props;
        console.log(config, "props中取得config");
        this.treeChart = new this.$G6.TreeGraph({
          container: document.getElementById("tree"),
          width: 500,
          height: 500,
          ...defaultConfig,
          ...config,
          nodeStateStyles: {
            click: {
              stroke: "#000000",
              lineWidth: 10,
              fill: "#fff5f1",
            },
          },
        });
        console.log(`TreeGraph设置`, this.treeChart);
        this.treeChart.data(data);
        console.log(this.treeChart, `graphdata`);
        this.treeChart.render();
        console.log(this.treeChart.render, `graphrender`);
        this.treeChart.zoom(config.defaultZoom || 1);
        const handleCollapse = (e) => {
          const target = e.target;
          const id = target.get("modelId");
          console.log(id, `modelIdmodelIdmodelId`);
          const item = this.treeChart.findById(id);
          const nodeModel = item.getModel();
          nodeModel.collapsed = !nodeModel.collapsed;
          this.treeChart.layout();
          this.treeChart.setItemState(item, "collapse", nodeModel.collapsed);
        };
        const addNode = (e) => {
          if (this.showInfo) {
            return;
          }
          console.log(
            `this.weatherFactoreOptionsList`,
            this.weatherFactoreOptionsList
          );
          const children = {
            control: "-",
            id: "",
            name: "装备",
            count: 123456,
            label: "新增装备",
            status: "G",
            level: 2,
            parentId: null,
            WeightRatio: 0.2,
            variableUp: false,
            weatherFactor: JSON.parse(
              JSON.stringify(this.weatherFactoreOptionsList)
            ),
          };
          console.log(children, `childrenchildrenchildrenchildrenchildren`);
          this.mockData.children.forEach((a, b) => {
            console.log(a.id, e.id);
            if (a.id === e.id) {
              children.parentId = e.id;
              console.log(`选中的节点 添加`);
              this.mockData.children[b].children.push(children);
            }
          });
          this.treeChart.changeData(this.mockData);
          console.log(this.mockData, `this.mockData添加节点`);
        };
        const deleteNode = (e) => {
          if (this.showInfo) {
            return;
          }
          this.$confirm(`确认删除${e.label}节点么`, {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.mockData.children.forEach((a, b) => {
                if (a.id === e.parentId) {
                  a.children.forEach((c, d) => {
                    if (c.label === e.label) {
                      this.mockData.children[b].children.splice(d, 1);
                    }
                  });
                }
              });
              this.treeChart.changeData(this.mockData);
              this.$message({
                message: "删除成功",
                type: "success",
              });
            })
            .catch(() => {
              this.$message({
                message: "取消删除",
                type: "info",
              });
            });
        };
        const editNodeName = (e) => {
          if (this.showInfo) {
            return;
          }
          if (e.level === 0) {
            return;
          }
          this.activeNodeIndex = [];
          // 当前激活节点信息
          console.log(e.level, `编辑的节点`);
          if (e.level === 2) {
            console.log("编辑三级节点");
            this.mockData.children.forEach((a, b) => {
              if (a.id === e.parentId) {
                a.children.forEach((c, d) => {
                  if (c.label === e.label) {
                    console.log([b, d], `编辑三级节点信息`);
                    this.activeNodeIndex = [b, d];
                    console.log(
                      this.mockData.children[this.activeNodeIndex[0]].children[
                        this.activeNodeIndex[1]
                      ].weatherFactor,
                      `activeNodeIndexactiveNodeIndexactiveNodeIndex`
                    );
                  }
                });
              }
            });
          }
          if (e.level === 1) {
            console.log("编辑二级节点");
            this.mockData.children.forEach((a, b) => {
              if (a.id === e.id) {
                console.log([b, -1], `编辑二级节点信息`);
                this.activeNodeIndex = [b, -1];
              }
            });
          }
          this.editNodeInfo = e;
          this.editNodeName = true;
        };
        const activeWeatherFactor = (e) => {
          let parentName = null;
          let name = null;
          if (e.level === 2) {
            this.mockData.children.forEach((a, b) => {
              if (a.id === e.parentId) {
                parentName = a.label;
                a.children.forEach((c, d) => {
                  if (c.label === e.label) {
                    name = c.label;
                    this.activeNodeIndex = [b, d];
                  }
                });
              }
              this.title = `${parentName} - ${name} - 气象要素`;
            });
            console.log(
              this.mockData.children[this.activeNodeIndex[0]].children[
                this.activeNodeIndex[1]
              ],
              `数据`
            );
          }
        };
        this.treeChart.on("collapse-text:click", (e) => {
          handleCollapse(e);
        });
        this.treeChart.on("collapse-back:click", (e) => {
          handleCollapse(e);
        });
        // 增删减节点控制
        this.treeChart.on("collapse-control:click", (evt) => {
          const level = evt.item._cfg.model.level;
          if (level === 1) {
            console.log("添加节点");
            addNode(evt.item._cfg.model);
          }
          if (level === 2) {
            console.log("删除节点");
            deleteNode(evt.item._cfg.model);
          }
        });
        this.treeChart.on("collapse-label:click", (evt) => {
          editNodeName(evt.item._cfg.model);
        });
        this.treeChart.on("rect-shape:click", (evt) => {
          activeWeatherFactor(evt.item._cfg.model);
        });
      };
      initGraph(data);
    },
    // 转换树结构
    compositionTreeStructure(detailInfo, taskInfo) {
      // 选择的任务编队类型 1 为船舰 0 为编队
      const type = taskInfo[0].type;
      console.log(type, `编队类型`);
      this.mockData = {}; // 重置树
      if (type === 1) {
        //  自由组队
        let treeObj = {};
        treeObj.id = "1";
        treeObj.name = "新建组队";
        treeObj.count = 123456;
        treeObj.label = "新建组队";
        treeObj.status = "B";
        treeObj.WeightRatio = "";
        treeObj.level = 0;
        treeObj.control = "";
        treeObj.variableUp = false;
        treeObj.children = detailInfo;
        this.mockData = treeObj;
        this.initG6();
        console.log(this.treeData);
      }
      if (type === 0) {
        const idArr = detailInfo.ships.split(",");
        console.log(idArr, `idArr`);
        let teamShipList = []; // 编队包含船舰
        this.$get(`/api/warship`)
          .then((res) => {
            if (res.data.data.rows) {
              res.data.data.rows.forEach((e, i) => {
                if (idArr.includes(String(e.id))) {
                  console.log(e.id, `包含的船`);
                  let obj = e;
                  obj.id = `1${i}`;
                  obj.name = "船只";
                  obj.count = 123456;
                  obj.label = e.warshipName;
                  obj.status = "R";
                  obj.WeightRatio = 0.2;
                  obj.level = 1;
                  obj.control = "+";
                  obj.variableUp = false;
                  obj.children = [];
                  teamShipList.push(obj);
                }
              });
            }
          })
          .then(() => {
            console.log(`teamShipList`, teamShipList);
            let treeObj = {};
            treeObj.id = "1";
            treeObj.name = "编队";
            treeObj.count = 123456;
            treeObj.label = detailInfo.name;
            treeObj.status = "B";
            treeObj.WeightRatio = "";
            treeObj.level = 0;
            treeObj.control = "";
            treeObj.variableUp = false;
            treeObj.children = teamShipList;
            this.mockData = treeObj;
            console.log(this.mockData, `this.mockData`);
            this.initG6();
          });
        return;
      }
    },
    // 载入任务编队
    loadTaskData(item) {
      this.$get(`/api/plan/sfs`, {
        id: item.plan_Id,
      }).then((res) => {
        if (res.data.data) {
          this.taskInfo = res.data.data;
          // 选择的为船
          if (res.data.data[0].type === 1) {
            this.loadShipList();
            return;
          }
          // 选择的为编队
          if (res.data.data[0].type === 0) {
            this.loadTeamList();
            return;
          }
        }
      });
    },
    // 请求船舰列表
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
                obj.control = "+";
                obj.id = `1${b}`;
                obj.name = "船只";
                obj.count = 123456;
                obj.label = a.warshipName;
                obj.status = "R";
                obj.level = 1;
                obj.WeightRatio = 0.2;
                obj.children = [];
                this.shipList.push(a);
              }
            });
          });
          this.compositionTreeStructure(this.shipList, this.taskInfo);
        }
      });
    },
    // 请求编队列表
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
    // 载入条件因子
    loadCondition() {
      this.$get(`api/condition`, {
        pageSize: 1000,
      }).then((res) => {
        if (res.status === 200) {
          const list = res.data.data;
          res.data.data.rows.forEach((e, i) => {
            console.log(`e`, e);
            this.weatherFactoreOptionsList.forEach((a, b) => {
              if (a.id === e.parametersId) {
                let obj = {
                  ...e,
                  parameter1: e.parameter.split(",")[0],
                  parameter2: e.parameter.split(",")[1],
                  parameter3: e.parameter.split(",")[2],
                  parameter4: e.parameter.split(",")[3],
                  coefficient1: e.coefficient.split(",")[0],
                  coefficient2: e.coefficient.split(",")[1],
                  coefficient3: e.coefficient.split(",")[2],
                  coefficient4: e.coefficient.split(",")[3],
                };
                this.weatherFactoreOptionsList[b].condition.push(obj);
                if (!this.weatherFactoreOptionsList[b].activeCondition) {
                  this.weatherFactoreOptionsList[b].activeCondition = e.remark;
                }
              }
            });
          });
        }
      });
    },
    // 载入气象要素
    getFactorOptions() {
      this.$get(`api/parameters`, {
        isEvaluate: 1,
      })
        .then((res) => {
          if (res.data.data) {
            this.weatherFactoreOptionsList = res.data.data.map((e, i) => {
              return {
                ...e,
                value: 0, // 水文气象因素权重比值
                activeCondition: null,
                activeConditionIndex: 0,
                condition: [],
                checked: false,
                parameterStepValue: e.parameterStep.split(",")[0],
              };
            });
          }
        })
        .then(() => {
          this.loadCondition();
        });
    },
    submit() {
      console.log(
        this.formData,
        `algorithm_Typealgorithm_Typealgorithm_Typealgorithm_Typealgorithm_Type`,
        this.mockData
      );
      console.log(this.mockData, `deploy`);
      let treeArr = [
        {
          structure: 0,
          name: "-",
          value: "-",
          parameter: "-",
          coefficient: "-",
          expression: "-",
          deploy: `${this.mockData.name}_${this.mockData.label}`,
        },
      ];
      console.log(treeArr, `treeArr`);
      this.mockData.children.forEach((e, i) => {
        console.log(e, `二级`);
        let objTwo = {
          structure: 1,
          name: "-",
          value: e.WeightRatio,
          parameter: "-",
          coefficient: "-",
          expression: "-",
          deploy: `${e.name}_${e.label}`,
        };
        treeArr.push(objTwo);
        if (e.children) {
          e.children.forEach((a, b) => {
            console.log(a, `三级`);
            let objTwo = {
              structure: 2,
              name: "-",
              value: a.WeightRatio,
              parameter: "-",
              coefficient: "-",
              expression: "-",
              deploy: `${a.name}_${a.label}`,
            };
            treeArr.push(objTwo);
            a.weatherFactor.forEach((c, d) => {
              console.log(c, `气象因子`);
              if (c.checked) {
                let objThree = {
                  structure: 3,
                  name: `${c.id}_${c.parameterStepValue}`,
                  value: c.value,
                  parameter: `${
                    c.condition[c.activeConditionIndex].parameter1
                  }_${c.condition[c.activeConditionIndex].parameter2}_${
                    c.condition[c.activeConditionIndex].parameter3
                  }_${c.condition[c.activeConditionIndex].parameter4}`,
                  coefficient: `${
                    c.condition[c.activeConditionIndex].coefficient1
                  }_${c.condition[c.activeConditionIndex].coefficient1}_${
                    c.condition[c.activeConditionIndex].coefficient2
                  }_${c.condition[c.activeConditionIndex].coefficient3}`,
                  expression: c.condition[c.activeConditionIndex].expression,
                  deploy: `weather`,
                };
                treeArr.push(objThree);
              }
            });
          });
        }
      });
      console.log(treeArr, `treeArr`);
      let treeName = [];
      let treeStructure = [];
      let treeValue = [];
      let treeParameter = [];
      let treeCoefficient = [];
      let treeExpression = [];
      let hydrometeor = [];
      let treeDeploy = [];
      treeArr.forEach((e, i) => {
        treeName.push(e.name);
        treeStructure.push(e.structure);
        treeValue.push(e.value);
        treeParameter.push(e.parameter);
        treeCoefficient.push(e.coefficient);
        treeExpression.push(e.expression);
        treeDeploy.push(e.deploy);
        if (e.structure === 3) {
          let objHy = {
            typeId: e.name.split("_")[0],
            level: e.name.split("_")[1],
          };
          hydrometeor.push(objHy);
        }
      });
      console.log(
        treeName,
        treeStructure,
        treeValue,
        treeParameter,
        treeCoefficient,
        treeExpression,
        hydrometeor,
        treeDeploy
      );
      let params = {
        courseId: this.routeInfo.id,
        planId: this.routeInfo.plan_Id,
        hydrometeor: JSON.stringify(hydrometeor),
        treeName: treeName.join(","),
        treeStructure: treeStructure.join(","),
        treeValue: treeValue.join(","),
        algorithmType: this.formData.algorithm_Type,
        assessName: this.formData.assessName,
        treeCoefficient: treeCoefficient.join(","),
        treeExpression: treeExpression.join(","),
        treeParameter: treeParameter.join(","),
        // treeDeploy: treeDeploy.join(","),
        treeDeploy: JSON.stringify(this.mockData),
      };
      this.loading = true;
      this.$jsonPost(`/api/assessment/evaluate`, {
        ...params,
      })
        .then((res) => {
          console.log(res, `res`);
          if (res.data.message === "评估失败") {
            this.$messag({
              title: "error",
              message: "评估失败",
              type: "error",
            });
            return;
          }
          this.$notify({
            title: "评估成功",
            message: `评估用时${res.data.data}s`,
            type: "success",
            position: "bottom-right",
          });
        })
        .then(() => {
          this.closeManager();
          this.loading = false;
        })
        .catch((error) => {
          this.$messag({
            title: "error",
            message: "评估失败",
            type: "error",
          });
          this.closeManager();
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>