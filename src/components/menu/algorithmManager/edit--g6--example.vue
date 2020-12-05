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
      <el-input placeholder="请输入内容"> </el-input>
      <el-button class="operation_add">开始评估</el-button>
    </div>
    <div class="manager_table">
      <div class="tree_wrapper">
        <div id="tree">树</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { mockData,colors,props,defaultConfig, } from "./g6.js"
export default {
  components: {},
  data() {
    return {
      algorithmShow: false,
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
        this.initG6();
      },
      deep: true,
    },
  },

  methods: {
    ...mapMutations({
      setAlgorithm: "menuBar/setAlgorithm",
    }),
    // 关闭评估窗口
    closeManager() {
      this.algorithmShow = false;
      this.setAlgorithm([0, {}]);
    },
    initG6() {
      console.log("初始化g6");
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
        container: "tree",
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
    nodeEach(nodes) {
      nodes.forEach((node) => {
        if (!node.style) {
          node.style = {};
        }
        switch (node.class) {
          case "c0": {
            node.shape = "circle";
            node.size = 40; // class = 'c0' 时节点图形为 circle
            break;
          }
          case "c1": {
            node.shape = "rect"; // class = 'c1' 时节点图形为 rect
            node.size = [80, 40]; // class = 'c1' 时节点大小
            node.style = {
              stroke: "#00CC00",
              fill: "#00CC00",
              radius: 45,
            };
            break;
          }
          case "c2": {
            node.shape = "ellipse"; // class = 'c1' 时节点图形为 ellipse
            node.size = [80, 40]; // class = 'c2' 时节点大小
            break;
          }
          case "c3": {
            node.shape = "diamond"; // class = 'c1' 时节点图形为 ellipse
            node.size = [60, 60]; // class = 'c2' 时节点大小
            break;
          }
        }
      });
      console.log(`this.nodeEach`,nodes)
    },
  },
};
</script>

<style lang="scss" scoped>
</style>