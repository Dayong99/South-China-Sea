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
    <vue2-org-tree
      :data="data"
      :horizontal="true"
      :label-class-name="labelClassName"
      @on-node-click="NodeClick"
      @on-node-mouseover="onMouseover"
      @on-node-mouseout="onMouseout"
    />
  </el-dialog>
</template>
<script>
import { mapState, mapMutations } from "vuex";
export default {
  components: {},
  data() {
    return {
      labelClassName: "bg-color-orange",
      data: {
        id: 0,
        label: "XXX科技有限公司",
        children: [
          {
            id: 2,
            label: "产品研发部",
            children: [
              {
                id: 5,
                label: "研发-前端",
              },
              {
                id: 6,
                label: "研发-后端",
              },
              {
                id: 9,
                label: "UI设计",
              },
              {
                id: 10,
                label: "产品经理",
                children: [
                  {
                    id: 7,
                    label: "销售一部",
                  },
                  {
                    id: 8,
                    label: "销售二部",
                  },
                ],
              },
            ],
          },
          {
            id: 3,
            label: "销售部",
            children: [
              {
                id: 7,
                label: "销售一部",
              },
              {
                id: 8,
                label: "销售二部",
              },
            ],
          },
          {
            id: 4,
            label: "财务部",
          },
          {
            id: 9,
            label: "HR人事",
          },
        ]
      },
      algorithmShow: false,
      routeInfo: {},
      title: "任务配置算法参数",
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
        console.log('算法')
        val[0] ? (this.algorithmShow = true) : (this.algorithmShow = false);
        this.routeInfo = val[1];
        this.loadTaskData(val[1]);
        // this.getFactorOptions();
      },
    },
  },
  methods: {
    ...mapMutations({
      setAlgorithm: "menuBar/setAlgorithm",
    }),
    NodeClick(e, data) {
      console.log(e, `点击节点`);
      console.log(data, `点击节点数据`);
    },
    onMouseover(e, data) {
      console.log(e, `移入节点`);
      console.log(data, `移入节点数据`);
    },
    onMouseout(e, data) {
      console.log(e, `移出节点`);
      console.log(data, `移出节点`);
      this.data = {
        id: 0,
        label: "XXX科技有限公司",
        children: [
          {
            id: 2,
            label: "产品研发部",
            children: [
              {
                id: 5,
                label: "研发-前端",
              },
              {
                id: 6,
                label: "研发-后端",
              },
              {
                id: 9,
                label: "UI设计",
              },
              {
                id: 10,
                label: "产品经理",
                children: [
                  {
                    id: 7,
                    label: "销售一部",
                  },
                  {
                    id: 8,
                    label: "销售二部",
                  },
                ],
              },
            ],
          },
          {
            id: 3,
            label: "销售部",
            children: [
              {
                id: 7,
                label: "销售一部",
              },
              {
                id: 8,
                label: "销售二部",
              },
            ],
          },
          {
            id: 4,
            label: "财务部",
          },
          {
            id: 9,
            label: "HR人事",
          },
        ],
      };
    },

    loadTaskData(item) {
      console.log(item,`载入任务`)
      // this.$get(`/api/plan/sfs`, {
      //   id: item.plan_Id,
      // }).then((res) => {
      //   if (res.data.data) {
      //     this.taskInfo = res.data.data;
      //     if (res.data.data[0].type === 1) {
      //       console.log(`船`)
      //       this.loadShipList();
      //       return;
      //     }
      //     if (res.data.data[0].type === 0) {
      //       console.log(`编队`)
      //       this.loadTeamList();
      //       return;
      //     }
      //   }
      // });
    },

    closeManager() {},
  },
};
</script>



<style lang="scss">
.bg-color-orange {
  color: #fff;
  background-color: orange;
  cursor: pointer;
}
</style>