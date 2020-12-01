<template>
  <div id="menuBar" class="menuBar">
    <div class="search">
      <div
        :class="{ search_bgcolor: searchFlag, search_icon: true }"
        @click.stop="changeSearch"
      >
        <img :src="searchIcon" />
      </div>
      <div class="search_input">
        <div class="input_left">
          <img src="@/assets/images/menu/search.png" />
        </div>
        <div class="input_content">
          <el-input
            v-model="searchValue"
            placeholder="请输入位置（lat, lng）"
            clearable
            class="search_content"
            @keyup.enter.native="location"
          ></el-input>
        </div>
        <div class="input_right">
          <img src="@/assets/images/menu/heart.png" />
        </div>
      </div>
    </div>
    <div class="menu_list" v-show="searchFlag">
      <ul class="list_ul">
        <li v-for="(item, index) in menuList" :key="index" class="list_ul_li">
          <div class="title_box">
            <img :src="item.icon" />
            <div class="title">
              <span
                @click.stop="openTask(index)"
                :class="{ title_bg: item.flag }"
                >{{ item.name }}</span
              >
              <img
                src="@/assets/images/menu/add.png"
                v-if="index == 2"
                @click.stop="addTask(index)"
              />
            </div>
            <img
              :src="iconList[0]"
              v-if="index == 2"
              class="down"
              @click.stop="openTask(index)"
            />
            <img
              :src="iconList[1]"
              v-if="index == 3"
              class="down"
              @click.stop="openTask(index)"
            />
            <img
              :src="iconList[2]"
              v-if="index == 4"
              class="down"
              @click.stop="openTask(index)"
            />
          </div>

          <!-- 任务管理 -->
          <ul class="list_task_ul" v-show="item.flag && flagList[0]">
            <li v-for="(item, index) in taskList" :key="index">
              <div class="task_list">
                <div class="task_name" @click="switchTask(item, index)">
                  <div class="task_dot" :class="{ active: item.checked }"></div>
                  <span class="task_desc">{{ item.name }}</span>
                </div>
                <div class="task_operation" style="margin-left: 0">
                  <el-button
                    icon="el-icon-edit-outline"
                    class="table_column_icon green"
                    type="text"
                    @click="editTaskItem(item)"
                  ></el-button>
                  <el-button
                    icon="el-icon-delete"
                    class="table_column_icon red"
                    type="text"
                    @click="deleteTaskItem(item)"
                  ></el-button>
                  <el-button
                    icon="el-icon-plus"
                    class="table_column_icon blueDeep"
                    type="text"
                    @click="addTaskItem(item, index)"
                  ></el-button>
                </div>
              </div>
              <div class="task_content_wrapper" v-if="item.checked">
                <div
                  class="task_content"
                  v-for="(itemRoute, indexRoute) in routeList"
                  :key="`route${indexRoute}`"
                >
                  <div class="task_content_desc">
                    <div class="task_content_name">
                      {{ itemRoute.lineName }}
                    </div>
                    <div class="control_wrapper">
                      <img
                        src="@/assets/images/menu/edit.svg"
                        @click="algorithm(itemRoute, indexRoute)"
                      />
                      <img
                        src="@/assets/images/menu/bin.svg"
                        @click="deleteRoute(itemRoute, indexRoute)"
                      />
                      <img
                        src="@/assets/images/menu/tree.svg"
                        @click="algorithm(itemRoute, indexRoute)"
                      />
                      <img
                        src="@/assets/images/menu/view.svg"
                        @click="routeAlgorithmInfo(itemRoute, indexRoute)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>

          <!-- 系统设置 -->
          <ul class="list_system_ul" v-show="item.flag && flagList[1]">
            <li v-for="(item, index) in systemList" :key="index">
              <div class="task_list">
                <div class="task_name" @click="openSystem(index)">
                  <span>{{ item.name }}</span>
                </div>
                <div class="task_operation">
                  <el-button
                    icon="el-icon-s-operation"
                    class="table_column_icon purple"
                    type="text"
                    @click="openSystem(index)"
                  ></el-button>
                </div>
              </div>
            </li>
          </ul>

          <!-- 数据管理 -->
          <ul class="list_system_ul" v-show="item.flag && flagList[2]">
            <li v-for="(item, index) in dataList" :key="index">
              <div class="task_list">
                <div class="task_name" @click="openData(index)">
                  <span>{{ item.name }}</span>
                </div>
                <div class="task_operation">
                  <el-button
                    icon="el-icon-s-operation"
                    class="table_column_icon purple"
                    type="text"
                    @click="openData(index)"
                  ></el-button>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      // 任务航线列表
      routeList: [],
      // 搜索框
      searchFlag: false,
      searchIcon: require("@/assets/images/menu/unselect.png"),
      searchValue: "",

      downIcon: require("@/assets/images/menu/down.png"),
      upIcon: require("@/assets/images/menu/up.png"),
      iconList: [
        require("@/assets/images/menu/down.png"),
        require("@/assets/images/menu/down.png"),
        require("@/assets/images/menu/down.png"),
      ],
      flagList: [false, false, false],

      // 任务管理展开
      nowMenuList: [],

      // 系统配置展开
      taskList: [
        {
          name: "1",
          checked: true,
        },
      ],
    };
  },
  computed: {
    ...mapState({
      menuList: (state) => state.menuBar.menuList,
      systemList: (state) => state.menuBar.systemList,
      dataList: (state) => state.menuBar.dataList,
      TaskManagerOptions: (state) => state.menuBar.TaskManagerOptions,
      routeDialogOptions: (s) => s.menuBar.routeDialogOptions,
      algorithmOptions: (s) => s.menuBar.algorithmOptions,
    }),
  },
  watch: {
    menuList: {
      handler(newval, oldval) {
        let i = newval.findIndex((item) => {
          return item.flag == true;
        });
      },
      deep: true,
    },
    flagList(newval, oldval) {
      this.iconList = new Array(3).fill(this.downIcon);
      let index = this.flagList.indexOf(true);
      if (index !== -1) {
        this.iconList[index] = this.upIcon;
      }
    },
    // 任务变化
    TaskManagerOptions() {
      this.loadTaskList();
    },
    // 航线变化
    routeDialogOptions() {
      console.log("更新航线信息");
    },
  },
  mounted() {
    this.loadTaskList();
  },
  methods: {
    ...mapMutations({
      setAlgorithm: "menuBar/setAlgorithm",
      setMenuList: "menuBar/setMenuList",
      setTaskManagerOptions: "menuBar/setTaskManagerOptions",
      setSystem: "menuBar/setSystem",
      setData: "menuBar/setData",
      setRouteDialogOptions: "menuBar/setRouteDialogOptions",
      setRouteAlgorithmInfo: "menuBar/setRouteAlgorithmInfo",
    }),
    routeAlgorithmInfo(item, index) {
      this.setRouteAlgorithmInfo([1, item]);
    },
    deleteRoute(item, index) {
      console.log(item, index, `delete`);
      this.$delete(`/api/course`, {
        id: item.id,
      })
        .then(() => {
          this.$message({
            message: "航线删除成功",
            type: "success",
          });
        })
        .then(() => {
          this.loadRouteList(plan_Id);
        });
    },
    algorithm(item, index) {
      this.setAlgorithm([1, item]);
    },
    loadRouteList(id) {
      this.$get(`/api/course`, {
        plan_Id: id,
      })
        .then((res) => {
          if (res.data.data) {
            // checked
            console.log(res.data.data, `res.data.data`);
            this.routeList = res.data.data.rows.map((e, i) => {
              return {
                ...e,
                checked: false,
              };
            });
            console.log(this.routeList, `this.routeList`);
          }
        })
        .catch(() => {
          this.$message({
            message: "航线列表加载失败",
            type: "error",
          });
        });
    },
    // 添加航线
    addTaskItem(item, index) {
      console.log(item, index, `item`);
      this.setRouteDialogOptions([1, item]);
    },
    switchTask(item, index) {
      if (item.checked) {
        this.taskList[index].checked = false;
      } else {
        this.taskList = this.taskList.map((e, i) => {
          let obj = e;
          obj.checked = false;
          return obj;
        });
        this.loadRouteList(item.id);
        this.taskList[index].checked = true;
      }
    },
    editTaskItem(item) {
      this.setTaskManagerOptions([2, item]);
    },
    deleteTaskItem(item) {
      console.log(item, `item`);
      this.$confirm("确认删除该任务么")
        .then(() => {
          this.$delete(`/api/plan`, {
            id: item.id,
          })
            .then(() => {
              this.$message({
                message: "任务删除成功",
                type: "success",
              });
            })
            .then(() => {
              this.loadTaskList();
            })
            .catch(() => {
              this.$message({
                message: "任务删除失败",
                type: "error",
              });
            });
        })
        .catch((_) => {
          this.$message({
            message: "取消删除",
            type: "information",
          });
        });
    },
    // 任务列表
    loadTaskList() {
      let params = {
        pageSize: 1000000,
      };
      this.$get(`/api/plan`, {
        ...params,
      }).then((res) => {
        console.log(res, `loadTaskList`);
        if (res.data.data) {
          this.taskList = res.data.data.rows.map((e, i) => {
            return {
              ...e,
              checked: false,
            };
          });
        }
      });
    },
    // 定位
    location() {
      let i = this.searchValue.indexOf(",");
      let j = this.searchValue.indexOf("，");
      if (i != -1 || j != -1) {
        let latlon = null;
        if (i != -1) {
          latlon = this.searchValue.split(",");
          window.map.flyTo(L.latLng(latlon[0], latlon[1]));
        } else if (j != -1) {
          latlon = this.searchValue.split("，");
          window.map.flyTo(L.latLng(latlon[0], latlon[1]));
        }
      } else {
        this.$message.warning("位置格式不正确");
      }
    },
    //------------start搜索框--------------
    // 改变搜索图标，并显示菜单栏
    changeSearch() {
      this.searchFlag = !this.searchFlag;
      if (this.searchFlag) {
        this.searchIcon = require("@/assets/images/menu/select.png");
      } else {
        this.searchIcon = require("@/assets/images/menu/unselect.png");
        this.menuList.forEach((item) => {
          item.flag = false;
        });
        this.setMenuList(this.menuList);
        this.iconList = new Array(3).fill(this.downIcon);
        this.flagList = new Array(3).fill(false);
      }
    },
    //------------end搜索框--------------

    //------------start任务管理--------------
    // 添加任务
    addTask(index) {
      this.setTaskManagerOptions([1, {}]);
    },
    // 打开任务管理
    openTask(index) {
      // 重置
      this.menuList.forEach((item) => {
        item.flag = false;
      });

      // 任务管理需要可以多次切换
      if (index == 2 || index == 3 || index == 4) {
        this.menuList[index].flag = !this.flagList[index - 2];
        this.flagList = new Array(3).fill(false);
        if (this.menuList[index].flag) {
          this.flagList[index - 2] = true;
        }
      } else {
        this.menuList[index].flag = true;
        this.iconList = new Array(3).fill(this.downIcon);
        this.flagList = new Array(3).fill(false);
      }
      this.setMenuList(this.menuList);
    },
    //------------end任务管理--------------

    // 系统配置
    openSystem(index) {
      this.setSystem({ index: index, val: true });
    },

    // 数据管理
    openData(index) {
      this.setData({ index: index, val: true });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>