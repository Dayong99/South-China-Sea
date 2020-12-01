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

          <ul class="list_task_ul" v-show="item.flag && flagList[0]">
            <li v-for="(item, index) in taskList" :key="index">
              <div class="task_list">
                <div class="task_name" @click="switchTask(item, index)">
                  <div class="task_dot" v-if="!item.checked">
                    <img src="@/assets/images/menu/taskTitle.png" />
                  </div>
                  <div class="task_dot" v-else>
                    <img src="@/assets/images/menu/taskTitleActive.png" />
                  </div>
                  <span class="task_desc" :class="{ active: item.checked }">{{
                    item.name
                  }}</span>
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

              <div
                class="task_content_wrapper"
                v-if="item.routeList.length && item.checked"
              >
                <div
                  class="task_content"
                  v-for="(itemRoute, indexRoute) in item.routeList"
                  :key="`route${indexRoute}`"
                >
                  <div
                    @click="switchRoute(item, index, itemRoute, indexRoute)"
                    class="task_content_desc"
                    :class="{ task_content_desc_active: itemRoute.checked }"
                  >
                    <div class="task_content_img">
                      <img src="@/assets/images/menu/lineTitle.png" alt="" />
                    </div>
                    <div class="task_content_name">
                      {{ itemRoute.lineName }}
                    </div>
                    <div class="control_wrapper" v-if="itemRoute.checked">
                      <img
                        src="@/assets/images/menu/route_info.png"
                        @click="algorithm(itemRoute, indexRoute)"
                      />
                      <img
                        src="@/assets/images/menu/route_assess.png"
                        @click="algorithm(itemRoute, indexRoute)"
                      />
                      <img
                        src="@/assets/images/menu/edit_route.png"
                        @click="algorithm(itemRoute, indexRoute)"
                      />
                      <img
                        src="@/assets/images/menu/route_delete.png"
                        @click="deleteRoute(itemRoute, indexRoute)"
                      />
                      <img
                        :class="{ activeAssess: itemRoute.assessChecked }"
                        src="@/assets/images/menu/down_content.png"
                        @click.stop="
                          loadAssessInfo(itemRoute, indexRoute, item, index)
                        "
                      />
                    </div>
                    <div class="control_wrapper" v-else></div>
                  </div>

                  <!-- 评估列表 -->
                  <div class="assess_wrapper">
                    <div
                      class="assess_items"
                      v-for="(itemAssess, indexAssess) in itemRoute.assessList"
                      :key="`assess${indexAssess}`"
                    >
                      <div class="assess_img">
                        <img src="@/assets/images/menu/timeTitle.png" />
                      </div>
                      <div class="assess_desc">
                        {{ itemAssess.assesstime | filterTime }}
                      </div>
                      <div class="assess_control" v-if="itemAssess.setting">
                        <img
                          src="@/assets/images/menu/alorithm_deactive.svg"
                          class="control_items"
                          @click="
                            changeAssessTime(
                              itemAssess,
                              indexAssess,
                              itemRoute,
                              indexRoute,
                              item,
                              index
                            )
                          "
                        />
                        <img
                          src="@/assets/images/menu/table_assess_deactive.svg"
                          class="control_items"
                          @click="
                            changeAssessTime(
                              itemAssess,
                              indexAssess,
                              itemRoute,
                              indexRoute,
                              item,
                              index
                            )
                          "
                        />
                        <img
                          src="@/assets/images/menu/line_assess_deactvie.svg"
                          class="control_items"
                          @click="
                            changeAssessTime(
                              itemAssess,
                              indexAssess,
                              itemRoute,
                              indexRoute,
                              item,
                              index
                            )
                          "
                        />
                        <img
                          src="@/assets/images/menu/area_assess_deactive.svg"
                          class="control_items"
                          @click="
                            changeAssessTime(
                              itemAssess,
                              indexAssess,
                              itemRoute,
                              indexRoute,
                              item,
                              index
                            )
                          "
                        />
                        <img
                          src="@/assets/images/menu/bin_assess_deactive.png"
                          class="control_items"
                          @click="
                            changeAssessTime(
                              itemAssess,
                              indexAssess,
                              itemRoute,
                              indexRoute,
                              item,
                              index
                            )
                          "
                        />
                        <img
                          src="@/assets/images/menu/time_assess_deactive.png"
                          class="control_items"
                          @click="
                            changeAssessTime(
                              itemAssess,
                              indexAssess,
                              itemRoute,
                              indexRoute,
                              item,
                              index
                            )
                          "
                        />
                      </div>
                      <div class="assess_control_deactive" v-else></div>
                      <div class="setting_wrapper">
                        <img
                          src="@/assets/images/menu/setting_assess_deactive.svg"
                          class="control_items"
                          @click="
                            AssessSetting(
                              itemAssess,
                              indexAssess,
                              itemRoute,
                              indexRoute,
                              item,
                              index
                            )
                          "
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>

          <!-- 系统设置 -->
          <ul
            class="list_system_ul"
            v-show="item.flag && flagList[1]"
            style="height: auto; overflow-y: hidden"
          >
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
          <ul
            class="list_system_ul"
            v-show="item.flag && flagList[2]"
            style="height: auto; overflow-y: hidden"
          >
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
      // 任务
      taskList: [],
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
      nowMenuList: [],
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
    TaskManagerOptions(val) {
      this.loadTaskList();
    },
    // 航线变化
    routeDialogOptions() {
      console.log("更新航线信息");
    },
  },
  filters: {
    filterTime(val) {
      return val.slice(0, -6);
    },
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
    // 任务树setting
    AssessSetting(itemAssess, indexAssess, itemRoute, indexRoute, item, index) {
      (this.taskList[index].routeList[indexRoute].assessList)[
        indexAssess
      ].setting = !this.taskList[index].routeList[indexRoute].assessList[
        indexAssess
      ].setting;
    },
    routeAlgorithmInfo(item, index) {
      this.setRouteAlgorithmInfo([1, item]);
    },
    changeAssessTime(
      itemAssess,
      indexAssess,
      itemRoute,
      indexRoute,
      item,
      index
    ) {
      console.log(
        itemAssess,
        indexAssess,
        itemRoute,
        indexRoute,
        item,
        index,
        `changeAssessTime`,
        this.taskList
      );
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
        this.loadRouteList(item, index);
        this.taskList[index].checked = true;
      }
    },
    switchRoute(item, index, itemRoute, indexRoute) {
      this.taskList[index].routeList[indexRoute].checked = !this.taskList[index]
        .routeList[indexRoute].checked;
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
    // 请求任务列表
    loadTaskList() {
      let params = {
        pageSize: 1000000,
      };
      this.$get(`/api/plan`, {
        ...params,
      }).then((res) => {
        if (res.data.data) {
          this.taskList = res.data.data.rows.map((e, i) => {
            return {
              ...e,
              checked: false,
              routeList: [],
            };
          });
          console.log(this.taskList, `this.taskList`);
        }
      });
    },
    // 请求航线列表
    loadRouteList(item, index) {
      this.taskList[index].routeList = [];
      this.$get(`/api/course`, {
        plan_Id: item.id,
      })
        .then((res) => {
          if (res.status === 200) {
            this.taskList[index].routeList = res.data.data.rows.map((e, i) => {
              return {
                ...e,
                checked: false,
                assessChecked: false,
                assessList: [],
              };
            });
          }
        })
        .catch(() => {
          this.$message({
            message: "航线列表加载失败",
            type: "error",
          });
        });
    },
    // 请求评估列表
    loadAssessInfo(itemRoute, indexRoute, item, index) {
      this.taskList[index].routeList[indexRoute].assessChecked = !this.taskList[
        index
      ].routeList[indexRoute].assessChecked;
      const status = this.taskList[index].routeList[indexRoute].assessChecked;
      if (status) {
        // 请求该航线评估列表
        this.$get(`/api/assessment`, {
          courseId: itemRoute.id,
        }).then((res) => {
          if (res.status === 200) {
            this.taskList[index].routeList[
              indexRoute
            ].assessList = res.data.data.map((e, i) => {
              return {
                ...e,
                line: false,
                area: false,
                table: false,
                timeIndex: 0,
                alorithm: false,
                setting: false,
              };
            });
          }
        });
      } else {
        this.taskList[index].routeList[indexRoute].assessList = [];
      }
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
      console.log(index, `openTask`);
      // 重置
      this.menuList.forEach((item) => {
        item.flag = false;
      });
      // 任务管理器
      if (index == 2) {
        this.loadTaskList();
      }

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