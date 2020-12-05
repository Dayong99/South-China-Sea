<template>
  <div id="menuBar" class="menuBar">
    <!-- 搜索框 -->
    <div class="search">
      <div
        :class="{ search_bgcolor: searchFlag, search_icon: true }"
        @click.stop="changeSearch"
      >
        <img :src="searchIcon" />
      </div>
      <div class="search_input">
        <div class="input_left">
          <img src="@/assets/images/menu/search.svg" />
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
        <div class="input_right" @click.stop="showMarkArea">
          <img src="@/assets/images/menu/heart.svg" />
        </div>
      </div>
    </div>

    <div class="mark_area" v-show="markAreaFlag">
      <div class="area_top">
        <div class="area_top_left">
          <img src="@/assets/images/menu/transform.png" />
          <span>常用区域</span>
        </div>
        <div class="area_top_right">
          <img
            src="@/assets/images/menu/addarea.png"
            class="area_add"
            @click.stop="addItem"
          />
          <img
            src="@/assets/images/menu/close.png"
            class="area_close"
            @click.stop="showMarkArea"
          />
        </div>
      </div>
      <div class="area_content">
        <ul>
          <li v-for="(item, index) in areaList" :key="index">
            <span class="area_index">{{ index + 1 }}</span>
            <span class="area_name">{{ item.name }}</span>
            <div class="tolatlon" @click.stop="toLatLon(item)">
              <img src="@/assets/images/menu/location.png" />
              <span>跳转</span>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- 菜单列表 -->
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
                src="@/assets/images/menu/add.svg"
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
                <div class="task_name" @click.stop="switchTask(item, index)">
                  <div class="task_dot" v-if="!item.checked">
                    <img src="@/assets/images/menu/taskTitle.svg" />
                  </div>
                  <div class="task_dot" v-else>
                    <img src="@/assets/images/menu/taskTitleActive.svg" />
                  </div>
                  <span class="task_desc" :class="{ active: item.checked }">{{
                    item.name
                  }}</span>
                </div>
                <div class="task_operation" style="margin-left: 0">
                  <img
                    src="@/assets/images/menu/add_task.svg"
                    alt=""
                    @click="addTaskItem(item, index)"
                  />
                  <img
                    src="@/assets/images/menu/edit_task.svg"
                    alt=""
                    @click="editTaskItem(item)"
                  />
                  <img
                    src="@/assets/images/menu/delete_task.svg"
                    alt=""
                    @click="deleteTaskItem(item)"
                  />
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
                      <img src="@/assets/images/menu/lineTitle.svg" alt="" />
                    </div>
                    <div class="task_content_name">
                      {{ itemRoute.lineName }}
                    </div>
                    <div class="control_wrapper">
                      <!-- 航线详情按钮 -->
                      <img
                            :src="
                              itemRoute.showRoute
                                ? AssessControlSrc.information.active
                                : AssessControlSrc.information.deactive
                            "
                            class="control_items"
                            @click.stop="showRoute(itemRoute, indexRoute)"
                          />

                      <!-- 航线评估按钮 -->
                      <img
                            :src="
                              itemRoute.showAlorithm
                                ? AssessControlSrc.assess.active
                                : AssessControlSrc.assess.deactive
                            "
                            class="control_items"
                            @click.stop="algorithm_Task(itemRoute, indexRoute)"
                          />

                        <!-- 航线编辑按钮 -->
                        <img
                            :src="
                              itemRoute.edit
                                ? AssessControlSrc.edit.active
                                : AssessControlSrc.edit.deactive
                            "
                            class="control_items"
                            @click.stop="editRoute(itemRoute, indexRoute, index)"
                          />

                      <!-- 航线删除按钮 -->
                      <img
                        src="@/assets/images/menu/route_delete.svg"
                        @click.stop="
                          deleteRoute(itemRoute, indexRoute, item, index)
                        "
                      />

                      <!-- 航线展开按钮 -->
                      <img
                        :class="{ activeAssess: itemRoute.assessChecked }"
                        src="@/assets/images/menu/down_content.png"
                        id="down_img"
                        @click.stop="
                          loadAssessInfo(itemRoute, indexRoute, item, index)
                        "
                      />
                    </div>
                  </div>

                  <!-- 评估列表 -->
                  <div class="assess_wrapper">
                    <div
                      class="assess_items"
                      v-for="(itemAssess, indexAssess) in itemRoute.assessList"
                      :key="`assess${indexAssess}`"
                    >
                      <div class="assess_item">
                        <div class="assess_img">
                          <img src="@/assets/images/menu/timeTitle.png" />
                        </div>
                        <div class="assess_desc">
                          {{ itemAssess.assesstime | filterTime }}
                        </div>
                      </div>

                      <transition
                        enter-active-class="animated slideInRight"
                        leave-active-class="animated slideOutRight"
                      >
                        <div class="assess_control" v-if="itemAssess.setting">
                          <!-- bin -->
                          <img
                            src="@/assets/images/menu/bin_assess_deactive.png"
                            class="control_items"
                            @click="
                              deleteAssessItem(
                                itemAssess,
                                itemRoute,
                                indexRoute,
                                item,
                                index
                              )
                            "
                          />
                          <!-- 查看评估配置参数 -->
                          <img
                            :src="
                              itemAssess.alorithm
                                ? AssessControlSrc.alorithm.active
                                : AssessControlSrc.alorithm.deactive
                            "
                            class="control_items"
                            @click="
                              AssessInfo(
                                itemAssess,
                                itemRoute,
                                indexRoute,
                                item,
                                index
                              )
                            "
                          />

                          <!-- area -->
                          <img
                            :src="
                              itemAssess.area
                                ? AssessControlSrc.area.active
                                : AssessControlSrc.area.deactive
                            "
                            class="control_items"
                            @click="
                              showAssessArea(itemAssess, indexAssess, itemRoute)
                            "
                          />
                          <img
                            :src="
                              itemAssess.line
                                ? AssessControlSrc.line.active
                                : AssessControlSrc.line.deactive
                            "
                            class="control_items"
                            @click="
                              showAssessLine(itemAssess, indexAssess, itemRoute)
                            "
                          />
                          <img
                            :src="
                              itemAssess.table
                                ? AssessControlSrc.table.active
                                : AssessControlSrc.table.deactive
                            "
                            class="control_items"
                            @click="showAssessInfo(itemAssess)"
                          />
                          <img
                            src="@/assets/images/menu/time_assess_deactive.png"
                            class="control_items"
                            @click="
                              changeNext(itemAssess, indexAssess, itemRoute)
                            "
                          />
                        </div>
                      </transition>
                      <div
                        class="assess_control_deactive"
                        v-if="!itemAssess.setting"
                      ></div>
                      <div class="setting_wrapper">
                        <img
                          src="@/assets/images/menu/setting_assess_deactive.svg"
                          class="control_items"
                          @click="AssessSetting(itemAssess)"
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
                <div class="task_label">
                  <div class="task_dot">
                    <img src="@/assets/images/menu/taskSettle.svg" />
                  </div>
                  <div class="task_name" @click="openSystem(index)">
                    {{ item.name }}
                  </div>
                </div>
                <div class="task_operation" style="margin-left: 0">
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
            class="list_data_ul list_system_ul"
            v-show="item.flag && flagList[2]"
            style="height: auto; overflow-y: hidden"
          >
            <li v-for="(item, index) in dataList" :key="index">
              <div class="task_list">
                <div class="task_label">
                  <div class="task_dot">
                    <img src="@/assets/images/menu/taskSettle.svg" />
                  </div>
                  <div class="task_name" @click="openData(index)">
                    {{ item.name }}
                  </div>
                </div>

                <!-- <div class="task_name" @click="openData(index)">
                  <span>{{ item.name }}</span>
                </div> -->
                <div class="task_operation" style="margin-left:0;">
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
    <edit
      ref="edit"
      :dialog-visible="dialog.isVisible"
      :title="dialog.title"
      @close="closeDialogPage"
    >
    </edit>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import Edit from "@/components/menu/SystemManager/areaManager/edit.vue";
export default {
  components: {
    Edit,
  },
  data() {
    return {
      AssessControlSrc: {
        alorithm: {
          active: require("@/assets/images/menu/alorithm_active.svg"),
          deactive: require("@/assets/images/menu/alorithm_deactive.svg"),
        },
        bin: {
          active: require("@/assets/images/menu/bin_assess_deactive.png"),
        },
        area: {
          active: require("@/assets/images/menu/area_assess_active.svg"),
          deactive: require("@/assets/images/menu/area_assess_deactive.svg"),
        },
        line: {
          active: require("@/assets/images/menu/line_assess_actvie.svg"),
          deactive: require("@/assets/images/menu/line_assess_deactvie.svg"),
        },

        table: {
          active: require("@/assets/images/menu/table_assess_active.svg"),
          deactive: require("@/assets/images/menu/table_assess_deactive.svg"),
        },
        time: {
          active: require("@/assets/images/menu/time_assess_deactive.png"),
          deactive: require("@/assets/images/menu/time_assess_deactive.png"),
        },
        information: {
          active: require("@/assets/images/menu/info_assess_active.svg"),
          deactive: require("@/assets/images/menu/info_assess_deactive.svg"),
        },
        edit: {
          active: require("@/assets/images/menu/edit_assess_active.svg"),
          deactive: require("@/assets/images/menu/edit_assess_deactive.svg"),
        },
        assess: {
          active: require("@/assets/images/menu/assess_assess_active.svg"),
          deactive: require("@/assets/images/menu/assess_assess_deactive.svg"),
        },
      },
      // 任务
      taskList: [],
      searchFlag: false,
      searchIcon: require("@/assets/images/menu/unselect.svg"),
      searchValue: "",
      downIcon: require("@/assets/images/menu/down.svg"),
      upIcon: require("@/assets/images/menu/up.svg"),
      iconList: [
        require("@/assets/images/menu/down.svg"),
        require("@/assets/images/menu/down.svg"),
        require("@/assets/images/menu/down.svg"),
      ],
      flagList: [false, false, false],
      nowMenuList: [],
      //风险评估区域集合，用于删除
      rectangle: [],
      //风险评估航线集合，用于删除
      routeLine: [],
      //风险等级
      colorArr: ["#00ff00", "#ffff00", "#ff8000", "#9919e5", "#ff0000"],

      // 固定区域面板
      markAreaFlag: false,
      areaList: [],
      // 新增 修改 对话框
      dialog: {
        isVisible: false,
        title: "",
      },
      //查看航线集合，用于删除
      showLine: [],
    };
  },
  computed: {
    ...mapState({
      menuList: (state) => state.menuBar.menuList,
      systemList: (state) => state.menuBar.systemList,
      dataList: (state) => state.menuBar.dataList,
      pointInfo: (state) => state.clickup.pointInfo,
      TaskManagerOptions: (state) => state.menuBar.TaskManagerOptions,
      routeDialogOptions: (s) => s.menuBar.routeDialogOptions,
      algorithmOptions: (s) => s.menuBar.algorithmOptions,
    }),

    assessflag() {
      let arr = [];
      this.taskList.forEach((item) => {
        if (item.routeList.length != 0) {
          item.routeList.forEach((item1) => {
            if (item1.assessList.length != 0) {
              item1.assessList.forEach((item2) => {
                arr.push(item2);
              });
            }
          });
        }
      });

      let index = arr.findIndex((item) => {
        return item.area || item.line;
      });
      return index;
    },
  },
  mounted() {
    L.CustomPopup = L.Popup.extend({
      _initLayout: function() {
        var prefix = "leaflet-popup",
          container = (this._container = L.DomUtil.create(
            "div",
            prefix +
              " " +
              (this.options.className || "") +
              " leaflet-zoom-animated"
          ));

        var wrapper = container;
        this._contentNode = L.DomUtil.create(
          "div",
          prefix + "-content",
          wrapper
        );

        L.DomEvent.disableClickPropagation(wrapper)
          .disableScrollPropagation(this._contentNode)
          .on(wrapper, "contextmenu", L.DomEvent.stopPropagation);
      },
    });

    // add bindCustomPopup
    L.Layer.include({
      bindCustomPopup: function(content, options) {
        if (content instanceof L.Popup) {
          L.setOptions(content, options);
          this._popup = content;
          content._source = this;
        } else {
          if (!this._popup || options) {
            this._popup = new L.CustomPopup(options, this);
          }
          this._popup.setContent(content);
        }

        if (!this._popupHandlersAdded) {
          this.on({
            click: this._openPopup,
            // mouseover: this._openPopup,
            // mouseout: this.closePopup,
            remove: this.closePopup,
            move: this._movePopup,
          });
          this._popupHandlersAdded = true;
        }

        return this;
      },
    });

    // map.on("popupopen", (e) => {
    //   console.log(e, "22222222222222");
    //   console.log(document.getElementById("des_btn"));
    //   let btn = document.getElementById("des_btn");
    //   btn.onclick = function() {
    //     let str = document.getElementById("des_text").value;
    //     console.log(str, "文本域内容----------");
    //   };
    // });
  },
  watch: {
    menuList: {
      handler(newval, oldval) {
        console.log(newval);
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
    routeDialogOptions(val) {
      console.log("更新航线信息", val);
      if(val[3]) {
        if(val[1].hasOwnProperty('plan_Id')) {
          this.reLoadRouteList(val[1], val[2])
        } else {
          this.loadRouteList(val[1], val[2])
        }
      }
    },
    assessflag(val) {
      console.log(val, "有无选中评估------");
      if (val != -1) {
        //有选中评估区域或航线，显示图例
        this.setAssessLegendShow(true);
      } else {
        //没有选中评估区域或航线，隐藏图例
        this.setAssessLegendShow(false);
      }
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
      setTitleList: "routeInfo/setTitleList",
      setDataList: "routeInfo/setDataList",
      setRouteInfoShow: "routeInfo/setRouteInfoShow",
      // setMarker: "clickup/setMarker",
      setLocation: "clickup/setLocation",
      setPointInfo: "clickup/setPointInfo",
      setPointInfoShow: "clickup/setPointInfoShow",
      setInfoShow: "clickup/setInfoShow",
      setAssessLegendShow: "menuBar/setAssessLegendShow",
    }),
    // 任务树setting
    AssessSetting(itemAssess) {
      itemAssess.setting = !itemAssess.setting;
    },
    routeAlgorithmInfo(item, index) {
      this.setRouteAlgorithmInfo([1, item]);
    },
    deleteRoute(item, index, taskItem, taskIndex) {
      console.log(item, index, `delete`);
      this.$confirm("确认删除该航线吗")
        .then(() => {
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
              this.loadRouteList(taskItem, taskIndex);
            });
        })
        .catch(() => {
          this.$message({
            message: "取消删除",
            type: "information",
          });
        })
        .then(() => {
          this.loadRouteList(item, index);
        });
    },
    algorithm(item, index) {
      this.setAlgorithm([1, item]);
    },
    algorithm_Task(itemRoute, indexRoute){
      itemRoute.showAlorithm = !itemRoute.showAlorithm
      this.setAlgorithm([1, itemRoute]);
    },
    addTaskItem(item, index) {
      console.log(item, index, `item`);
      this.setRouteDialogOptions([1, item, index, false]);
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
    //删除评估
    deleteAssessItem(itemAssess, itemRoute, indexRoute, item, index) {
      this.$confirm("确认删除该评估吗")
        .then(() => {
          this.$delete("api/assessment", {
            id: itemAssess.id,
          }).then((res) => {
            this.$message({
              message: "评估删除成功",
              type: "success",
            });
            this.loadAssessInfo(itemRoute, indexRoute, item, index);
          });
        })
        .catch(() => {
          this.$message({
            message: "取消删除",
            type: "information",
          });
        });
    },
    // 查看评估配置参数
    AssessInfo(itemAssess, itemRoute, indexRoute, item, index) {
      itemAssess.alorithm = !itemAssess.alorithm;
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
      this.$get(`/api/course/list`, {
        plan_Id: item.id,
      })
        .then((res) => {
          if (res.status === 200) {
            this.taskList[index].routeList = res.data.data.map((e, i) => {
              return {
                ...e,
                checked: false,
                assessChecked: false,
                showRoute: false,
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
    reLoadRouteList(item, index) {
      this.taskList[index].routeList = [];
      this.$get(`/api/course/list`, {
        plan_Id: item.plan_Id,
      })
        .then((res) => {
          if (res.status === 200) {
            this.taskList[index].routeList = res.data.data.map((e, i) => {
              return {
                ...e,
                checked: false,
                assessChecked: false,
                showRoute: false,
                showAlorithm: false,
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
        this.$get("api/course/one", {
          id: itemRoute.id,
        }).then((res) => {
          let length = res.data.data.courseItemList.length;
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
                  pointNum: length,
                  timeIndex: 0,
                  alorithm: false,
                  setting: false,
                };
              });
            }
          });
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
        this.searchIcon = require("@/assets/images/menu/select.svg");
      } else {
        this.searchIcon = require("@/assets/images/menu/unselect.svg");
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

    showInfo(item) {
      item = true;
    },
    //显示评估区域
    showAssessArea(itemAssess, indexAssess, itemRoute) {
      console.log(itemAssess, itemRoute, "点击风险评估区域");
      itemAssess.timeIndex = 0;
      //单个评估区域和航线互斥
      itemAssess.line = false;
      //清除风险等级航线
      this.clearRouteById(itemAssess.id);
      // if (itemAssess.id == this.pointInfo.assessmentId) {
      //   this.setPointInfoShow(false);
      // }
      //单条航线多个评估互斥
      itemRoute.assessList.forEach((item) => {
        if (item.id != itemAssess.id) {
          item.area = false;
          item.line = false;
          this.clearRectangleById(item.id);
          this.clearOriginalLine(item.courseId, "rectangle");
          this.clearRouteById(item.id);
          if (item.id == this.pointInfo.assessmentId) {
            this.setPointInfoShow(false);
          }
        }
      });

      itemAssess.area = !itemAssess.area;
      //绘制风险等级区域
      if (itemAssess.area) {
        this.clearRectangleById(itemAssess.id);
        this.clearOriginalLine(itemAssess.courseId, "rectangle");
        this.drawRectangle(
          itemAssess.id,
          itemAssess.timeIndex,
          itemAssess.courseId
        );
      } else {
        //清除该评估的风险区域
        this.clearRectangleById(itemAssess.id);
        this.clearOriginalLine(itemAssess.courseId, "rectangle");
      }
    },

    //显示评估航线
    showAssessLine(itemAssess, indexAssess, itemRoute) {
      console.log(itemAssess, itemRoute, "点击风险评估航线");
      itemAssess.timeIndex = 0;
      //单个评估区域和航线互斥
      itemAssess.area = false;
      //清除风险等级区域
      this.clearRectangleById(itemAssess.id);
      this.clearOriginalLine(itemAssess.courseId, "rectangle");
      //单条航线多个评估互斥
      itemRoute.assessList.forEach((item) => {
        if (item.id != itemAssess.id) {
          item.area = false;
          item.line = false;
          this.clearRectangleById(item.id);
          this.clearOriginalLine(item.courseId, "rectangle");
          this.clearRouteById(item.id);
          // if (item.id == this.pointInfo.assessmentId) {
          //   this.setPointInfoShow(false);
          // }
        }
      });

      itemAssess.line = !itemAssess.line;
      //绘制风险等级航线
      if (itemAssess.line) {
        this.clearRouteById(itemAssess.id);
        // if (itemAssess.id == this.pointInfo.assessmentId) {
        //   this.setPointInfoShow(false);
        // }
        this.drawRouteLine(
          itemAssess.id,
          itemAssess.timeIndex,
          itemAssess.courseId
        );
      } else {
        //清除该评估的风险航线
        this.clearRouteById(itemAssess.id);
        // if (itemAssess.id == this.pointInfo.assessmentId) {
        //   this.setPointInfoShow(false);
        // }
      }
    },

    //切换显示下一个时间点的评估信息
    changeNext(itemAssess, indexAssess, itemRoute) {
      console.log(itemAssess);
      //当前选中了风险区域评估或者风险航线评估或者风险评估数据列表时
      if (itemAssess.area || itemAssess.line) {
        itemAssess.timeIndex++;
        if (itemAssess.timeIndex >= itemAssess.pointNum) {
          itemAssess.timeIndex = 0;
        }
        console.log(itemAssess.timeIndex);
        //选中区域风险评估
        if (itemAssess.area) {
          this.changeShowAssessArea(itemAssess);
          //选中风险评估航线
        } else if (itemAssess.line) {
          this.changeShowAssessLine(itemAssess);
          //选中风险评估信息列表
        }
        // else if (itemAssess.table) {
        //   this.changeShowAssessInfo(itemAssess);
        // }
      }
    },

    //切换下一个时间点时，重新绘制风险等级区域
    changeShowAssessArea(itemAssess) {
      this.clearRectangleById(itemAssess.id);
      this.clearOriginalLine(itemAssess.courseId, "rectangle");
      this.drawRectangle(
        itemAssess.id,
        itemAssess.timeIndex,
        itemAssess.courseId
      );
    },

    //切换下一个时间点时，重新绘制风险等级航线
    changeShowAssessLine(itemAssess) {
      this.clearRouteById(itemAssess.id);
      this.drawRouteLine(
        itemAssess.id,
        itemAssess.timeIndex,
        itemAssess.courseId
      );
    },

    //切换下一个时间点时，重新请求风险信息表格数据
    changeShowAssessInfo(itemAssess) {
      this.$get("api/assessment/line-conclusion", {
        assessmentId: itemAssess.id,
      }).then((res) => {
        console.log(res.data.data, "航线评估数据-----------");
        let obj = res.data.data;
        let titleList = ["风险等级"];
        let dataList = [];
        for (let key in obj) {
          if (key != "conclusion") {
            titleList.push(key);
          }
        }
        for (let i = 0; i < obj.conclusion.length; i++) {
          let arr = [obj.conclusion[i].dateTime, obj.conclusion[i].value];
          for (let key in obj) {
            if (key != "conclusion") {
              arr.push(obj[key][i].value);
            }
          }
          dataList.push(arr);
        }
        this.setTitleList(titleList);
        this.setDataList(dataList);
        this.setRouteInfoShow(true);
      });
    },

    //获取风险等级航线详细信息列表
    showAssessInfo(itemAssess) {
      //互斥，表格只能显示一个
      console.log(this.taskList, "任务列表----------");
      this.taskList.forEach((item) => {
        if (item.routeList.length != 0) {
          item.routeList.forEach((item1) => {
            if (item1.assessList.length != 0) {
              item1.assessList.forEach((item2) => {
                if (item2.id != itemAssess.id) {
                  item2.table = false;
                  this.setRouteInfoShow(false);
                }
              });
            }
          });
        }
      });

      itemAssess.table = !itemAssess.table;
      if (itemAssess.table) {
        //请求航线详细信息数据，构造显示下方列表
        this.$get("api/assessment/line-conclusion", {
          assessmentId: itemAssess.id,
        }).then((res) => {
          console.log(res.data.data, "航线评估数据-----------");
          let obj = res.data.data;
          let titleList = ["风险等级"];
          let dataList = [];
          for (let key in obj) {
            if (key != "conclusion") {
              titleList.push(key);
            }
          }
          for (let i = 0; i < obj.conclusion.length; i++) {
            let arr = [obj.conclusion[i].dateTime, obj.conclusion[i].value];
            for (let key in obj) {
              if (key != "conclusion") {
                arr.push(obj[key][i].value);
              }
            }
            dataList.push(arr);
          }
          this.setTitleList(titleList);
          this.setDataList(dataList);
          this.setRouteInfoShow(true);
        });
      } else {
        this.setRouteInfoShow(false);
      }
    },

    //绘制风险等级区域
    drawRectangle(assessmentId, timeIndex, courseId) {
      let riskArr = [];
      //获取风险评估区域，绘制
      this.$get("api/assessment/evaluation-conclusion", {
        assessmentId: assessmentId, //评估id
        courseTime: "", //航线的时间节点
        index: timeIndex, //航线第几个时间点
      }).then((res) => {
        console.log(res, "评估数据");
        riskArr = res.data.data;

        let reArr = [];
        let color = "";
        riskArr.forEach((item) => {
          item.forEach((item1) => {
            if (item1.value == -1) {
              reArr.push({
                corner1: [Number(item1.lat), Number(item1.lon)],
                corner2: [
                  Number(item1.lat) - Number(item1.grid),
                  Number(item1.lon) + Number(item1.grid),
                ],
                color: "",
                borderColor: "",
                fillOpacity: 0,
              });
            } else {
              if (parseInt(Number(item1.value) * 10) != 10) {
                color = this.colorArr[parseInt((Number(item1.value) * 10) / 2)];
              } else {
                color = this.colorArr[this.colorArr.length - 1];
              }
              reArr.push({
                corner1: [Number(item1.lat), Number(item1.lon)],
                corner2: [
                  Number(item1.lat) - Number(item1.grid),
                  Number(item1.lon) + Number(item1.grid),
                ],
                color: color,
                borderColor: "#000000",
                fillOpacity: 0.5,
              });
            }
          });
        });
        console.log(reArr, "画风险评估区域---------");
        reArr.forEach((item) => {
          let bounds = [item.corner1, item.corner2];
          let rectangle = L.rectangle(bounds, {
            fillColor: item.color,
            color: item.borderColor,
            weight: 1,
            fillOpacity: item.fillOpacity,
          }).addTo(map);
          rectangle.assessmentId = assessmentId;
          rectangle.courseId = courseId;
          this.rectangle.push(rectangle);
        });
        this.drawOriginalLine(courseId, "rectangle", timeIndex, assessmentId);
      });
    },

    //绘制风险等级航线
    drawRouteLine(assessmentId, timeIndex, courseId) {
      let riskArr = [];
      //获取风险评估区域，绘制
      this.$get("api/assessment/evaluation-conclusion", {
        assessmentId: assessmentId, //评估id
        courseTime: "", //航线的时间节点
        index: timeIndex, //航线第几个时间点
      }).then((res) => {
        // console.log(res, "评估数据");
        riskArr = res.data.data;

        let reArr = [];
        let color = "";
        riskArr.forEach((item) => {
          item.forEach((item1) => {
            if (parseInt(Number(item1.value) * 10) != 10) {
              color = this.colorArr[parseInt((Number(item1.value) * 10) / 2)];
            } else {
              color = this.colorArr[this.colorArr.length - 1];
            }
            reArr.push({
              corner1: [Number(item1.lat), Number(item1.lon)],
              corner2: [
                Number(item1.lat) - Number(item1.grid),
                Number(item1.lon) + Number(item1.grid),
              ],
              color: color,
            });
          });
        });
        console.log(reArr, "画风险评估区域---------");
        //获取单个航线数据
        this.$get("api/course/one", {
          id: courseId,
        }).then((res) => {
          let lineData = res.data.data.courseItemList;
          let latlngs = [];
          lineData.forEach((item) => {
            latlngs.push([Number(item.latitude), Number(item.longitude)]);
          });
          // L.polyline(latlngs, { color: "blue" }).addTo(map);
          console.log(latlngs, "航线点-------------", lineData);

          let allPoint = [];
          for (let i = 0; i < latlngs.length - 1; i++) {
            let lineArr = this.cutLine(
              latlngs[i],
              latlngs[i + 1],
              riskArr,
              reArr
            );
            allPoint = [...allPoint, ...lineArr];
            console.log("lineArr--------------", lineArr);
            for (let i = 0; i < lineArr.length - 1; i++) {
              let line = [lineArr[i].position, lineArr[i + 1].position];
              let lines = L.polyline(line, { color: lineArr[i].color }).addTo(
                map
              );
              lines.assessmentId = assessmentId;
              lines.courseId = courseId;
              this.routeLine.push(lines);
            }
          }
          console.log(allPoint, "所有点----------------");
          allPoint[allPoint.length - 1].color =
            allPoint[allPoint.length - 2].color;
          allPoint.forEach((item, index) => {
            if (item.color == "") {
              allPoint.splice(index, 1);
            }
          });
          console.log("处理之后的所有点------", allPoint);
          let pointArr = [];
          allPoint.forEach((item) => {
            latlngs.forEach((item1) => {
              if (
                item.position[0] == item1[0] &&
                item.position[1] == item1[1]
              ) {
                pointArr.push(item);
              }
            });
          });
          console.log(pointArr);
          pointArr.forEach((item, index) => {
            let circle;
            if (index == timeIndex) {
              circle = L.circleMarker(item.position, {
                radius: 7,
                fillOpacity: 1,
                fillColor: item.color,
                weight: 4,
                color: "#00F1FF",
              }).addTo(map);
            } else {
              circle = L.circleMarker(item.position, {
                radius: 6,
                fillOpacity: 1,
                fillColor: item.color,
                weight: 0,
              }).addTo(map);
            }
            circle.index = index;
            circle.assessmentId = assessmentId;
            circle.courseId = courseId;
            circle.on("click", (e) => {
              map.off("click", window.mapClick_p);
              this.setInfoShow(false);
              console.log(e, "航线点的信息--------");
              //请求单个航线点的信息
              this.$get("api/assessment/point-conclusion", {
                assessmentId: assessmentId,
                index: e.target.index,
                point: timeIndex,
              }).then((res) => {
                console.log(res, "单个点的数据信息");
                let arr = res.data.data;
                let singleInfo = {
                  assessmentId: assessmentId, //评估id
                  index: e.target.index, //点在航线中的index值
                  message: arr[0].other,
                  arr: [
                    {
                      name: "时间",
                      value: arr[0].dateTime,
                    },
                  ],
                };
                arr.forEach((item) => {
                  if (item.name == "conclusion") {
                    singleInfo.arr.push({
                      name: "风险等级",
                      value: item.value,
                    });
                  } else {
                    singleInfo.arr.push({
                      name: item.name,
                      value: item.value,
                    });
                  }
                });
                this.setPointInfo(singleInfo);
                this.setLocation(e.containerPoint);
                // this.setInfoShow(false)
                this.setPointInfoShow(true);

                let marker = e.target;
                map.on("move", (e) => {
                  let p = map.latLngToContainerPoint(
                    L.latLng(marker._latlng.lat, marker._latlng.lng)
                  );
                  console.log(p);
                  this.setLocation(p);
                });
              });

              // let content = this.getPointContent(info);
              // circle.bindCustomPopup(content).openPopup();
              // console.log(document.getElementById("des_btn"));
              // document.getElementById("des_btn").onclick = () => {
              //   let str = document.getElementById("des_text").value;
              //   console.log(str, "文本域内容----------");
              // };
              // map.on("popupopen", (e) => {
              //   console.log(e, "22222222222222");
              //   document.getElementById("des_btn").onclick = () => {
              //     let str = document.getElementById("des_text").value;
              //     console.log(str, "文本域内容----------");
              //   };
              // });
            });
            this.routeLine.push(circle);
          });
        });
      });
    },

    //根据评估id清除图上的风险评估区域
    clearRectangleById(id) {
      console.log(this.rectangle, "保存的风险区域----------");
      for (let i = 0; i < this.rectangle.length; i++) {
        if (this.rectangle[i].assessmentId == id) {
          map.removeLayer(this.rectangle[i]);
          this.rectangle.splice(i, 1);
          i--;
        }
      }
    },
    //根据航线id清除图上的风险评估区
    //根据评估id清除图上的风险评估航线
    clearRouteById(id) {
      if (id == this.pointInfo.assessmentId) {
        this.setPointInfoShow(false);
      }
      console.log(this.routeLine, "保存的风险区域----------");
      for (let i = 0; i < this.routeLine.length; i++) {
        if (this.routeLine[i].assessmentId == id) {
          map.removeLayer(this.routeLine[i]);
          this.routeLine.splice(i, 1);
          i--;
        }
      }
    },

    //传两个端点,根据风险评估区域给这段线段划分区域，进行变色(point1为这一段的起始点，point2为这一段的结束点)
    cutLine(point1, point2, riskArr, reArr) {
      let latArr = [];
      let lonArr = [];
      riskArr.forEach((item) => {
        latArr.push(Number(item[0].lat));
      });
      // latArr.push(latArr[latArr.length - 1] - this.arr[0][0].grid);
      latArr.sort((a, b) => {
        return a - b;
      });
      riskArr[0].forEach((item) => {
        lonArr.push(Number(item.lon));
      });
      // lonArr.push(lonArr[lonArr.length - 1] + this.arr[0][0].grid);
      lonArr.sort((a, b) => {
        return a - b;
      });
      console.log(latArr, lonArr);
      //特殊情况  航线为垂直竖线时，即两点经度相等
      if (point1[1] === point2[1]) {
        console.log("垂直竖线");
        //找跟纬度的交叉点
        let pointArr = [];
        latArr.forEach((item) => {
          if (
            item >= Math.min(point1[0], point2[0]) &&
            item <= Math.max(point1[0], point2[0])
          ) {
            pointArr.push([item, point1[1]]);
          }
        });
        pointArr.push(point1, point2);
        let newArr = [];
        //去除重复的点
        if (point1[0] > point2[0]) {
          //纬度从高到低排序
          newArr = this.removeRepeat(pointArr, "y-");
        } else if (point1[0] < point2[0]) {
          //纬度从低到高排序
          newArr = this.removeRepeat(pointArr, "y+");
        }
        console.log(newArr);
        let fArr = [];
        for (let i = 0; i < newArr.length - 1; i++) {
          let middleY = (newArr[i][0] + newArr[i + 1][0]) / 2;
          let middleX = (newArr[i][1] + newArr[i + 1][1]) / 2;
          for (let j = 0; j < latArr.length - 1; j++) {
            if (middleY > latArr[j] && middleY < latArr[j + 1]) {
              console.log(reArr);
              let index = reArr.findIndex((item) => {
                return (
                  item.corner1[0] == latArr[j + 1] &&
                  middleX > item.corner1[1] &&
                  middleX <= item.corner2[1]
                );
              });
              if (index != -1) {
                fArr.push({
                  position: newArr[i],
                  color: reArr[index].color,
                });
              } else {
                let index1 = reArr.findIndex((item) => {
                  return (
                    item.corner1[0] == latArr[j + 1] &&
                    middleX >= item.corner1[1] &&
                    middleX < item.corner2[1]
                  );
                });
                fArr.push({
                  position: newArr[i],
                  color: reArr[index1].color,
                });
              }
            }
          }
        }
        fArr.push({
          position: newArr[newArr.length - 1],
          color: "",
        });
        console.log("最终---------", fArr);
        return fArr;

        //航线为横着的横线时，即两点纬度相等
      } else if (point1[0] === point2[0]) {
        console.log("横线");
        //找跟经度的交叉点
        let pointArr = [];
        lonArr.forEach((item) => {
          if (
            item >= Math.min(point1[1], point2[1]) &&
            item <= Math.max(point1[1], point2[1])
          ) {
            pointArr.push([point1[0], item]);
          }
        });
        pointArr.push(point1, point2);
        let newArr = [];
        //去除重复的点
        if (point1[1] > point2[1]) {
          //经度从高到低排序
          newArr = this.removeRepeat(pointArr, "x-");
        } else if (point1[1] < point2[1]) {
          //纬度从低到高排序
          newArr = this.removeRepeat(pointArr, "x+");
        }
        console.log(newArr);
        //构建位置，颜色数组，用于循环绘制变色线
        let fArr = [];
        for (let i = 0; i < newArr.length - 1; i++) {
          let middleY = (newArr[i][0] + newArr[i + 1][0]) / 2;
          let middleX = (newArr[i][1] + newArr[i + 1][1]) / 2;
          for (let j = 0; j < lonArr.length - 1; j++) {
            if (middleX > lonArr[j] && middleX < lonArr[j + 1]) {
              console.log(reArr);
              let index = reArr.findIndex((item) => {
                return (
                  item.corner2[1] == lonArr[j + 1] &&
                  middleY >= item.corner2[0] &&
                  middleY < item.corner1[0]
                );
              });
              if (index != -1) {
                fArr.push({
                  position: newArr[i],
                  color: reArr[index].color,
                });
              } else {
                let index1 = reArr.findIndex((item) => {
                  return (
                    item.corner2[1] == lonArr[j + 1] &&
                    middleY > item.corner2[0] &&
                    middleY <= item.corner1[0]
                  );
                });
                fArr.push({
                  position: newArr[i],
                  color: reArr[index1].color,
                });
              }
            }
          }
        }
        fArr.push({
          position: newArr[newArr.length - 1],
          color: "",
        });
        console.log("最终---------", fArr);
        return fArr;
      } else {
        console.log("斜线-----------");
        //首先根据这两点构建一个函数
        let a = (point2[0] - point1[0]) / (point2[1] - point1[1]); //根据两点确定直线函数解析式的斜率
        let b = point1[0] - a * point1[1]; //确定函数解析式偏移量
        console.log("斜率", a, "偏移量", b);

        let pointArr = [];
        //循环纬度，找交叉点
        latArr.forEach((item) => {
          if (
            item >= Math.min(point1[0], point2[0]) &&
            item <= Math.max(point1[0], point2[0])
          ) {
            pointArr.push([item, (item - b) / a]);
          }
        });
        lonArr.forEach((item) => {
          if (
            item >= Math.min(point1[1], point2[1]) &&
            item <= Math.max(point1[1], point2[1])
          ) {
            pointArr.push([a * item + b, item]);
          }
        });
        pointArr.push(point1, point2);
        console.log("去重之前的交点数组-------", pointArr);
        let newArr = [];
        //去除重复的点,并排序
        if (point1[1] > point2[1]) {
          //经度从高到低排序
          newArr = this.removeRepeat(pointArr, "x-");
        } else if (point1[1] < point2[1]) {
          //纬度从低到高排序
          newArr = this.removeRepeat(pointArr, "x+");
        }
        console.log("去重排序之后的数组-----------", newArr);
        let index = newArr.findIndex((item) => {
          return (
            ((item[0] == point1[0] || item[1] == point1[1]) &&
              !(item[0] == point1[0] && item[1] == point1[1])) ||
            ((item[0] == point2[0] || item[1] == point2[1]) &&
              !(item[0] == point2[0] && item[1] == point2[1]))
          );
        });
        if (index != -1) {
          newArr.splice(index, 1);
        }

        //构建位置，颜色数组，用于循环绘制变色线
        let fArr = [];
        for (let i = 0; i < newArr.length - 1; i++) {
          //每两个点计算一下中点位置
          let middleY = (newArr[i][0] + newArr[i + 1][0]) / 2;
          let middleX = (newArr[i][1] + newArr[i + 1][1]) / 2;
          let index = reArr.findIndex((item) => {
            return (
              middleX > item.corner1[1] &&
              middleX < item.corner2[1] &&
              middleY > item.corner2[0] &&
              middleY < item.corner1[0]
            );
          });
          if (index != -1) {
            fArr.push({
              position: newArr[i],
              color: reArr[index].color,
            });
          }
        }
        fArr.push({
          position: newArr[newArr.length - 1],
          color: "",
        });
        console.log("最终---------", fArr);
        return fArr;
      }
    },

    //点的二维数组去重排序,K表示排序的方式（x+:经度递增排序，x-:经度递减排序，y+:纬度递增排序，y-:纬度递减排序）
    removeRepeat(pointArr, k) {
      //先数组去重
      let newArr = [];
      pointArr.forEach((item) => {
        if (newArr.length == 0) {
          newArr.push(item);
        } else {
          let i = newArr.findIndex((item1) => {
            return item1[0] === item[0] && item1[1] === item[1];
          });
          if (i == -1) {
            newArr.push(item);
          }
        }
      });
      console.log("排序前-------", newArr);
      //排序
      if (k == "x+") {
        // console.log(newArr.sort(this.compare(1,"+")));
        return newArr.sort(this.compare(1, "+"));
      } else if (k == "x-") {
        // console.log(newArr.sort(this.compare(1,"-")));
        return newArr.sort(this.compare(1, "-"));
      } else if (k == "y+") {
        // console.log(newArr.sort(this.compare(0,"+")));
        return newArr.sort(this.compare(0, "+"));
      } else if (k == "y-") {
        // console.log(newArr.sort(this.compare(0,"-")));
        return newArr.sort(this.compare(0, "-"));
      }
    },
    compare(property, m) {
      return function(a, b) {
        var value1 = a[property];
        var value2 = b[property];
        if (m == "+") {
          return value1 - value2;
        } else if (m == "-") {
          return value2 - value1;
        }
      };
    },
    // 区域收藏面板
    showMarkArea() {
      this.markAreaFlag = !this.markAreaFlag;
      if (this.markAreaFlag) {
        this.areaFetch();
      }
    },
    areaFetch() {
      this.$get("/api/region-division")
        .then((res) => {
          if (res.status == 200) {
            console.log("常用区域", res);
            let data = res.data.data.rows;
            this.areaList = data;
          }
        })
        .catch((error) => {
          this.$message("获取常用区域失败");
        });
    },
    toLatLon(location) {
      window.map.flyToBounds(
        L.latLngBounds([
          [location.maxLat, location.minLon],
          [location.minLat, location.maxLon],
        ])
      );
    },
    addItem() {
      this.dialog.isVisible = true;
      this.dialog.title = "添加区域";
    },
    // 关闭新增 修改 对话框
    closeDialogPage() {
      this.dialog.isVisible = false;
      this.areaFetch();
    },

    //配置航线点的弹出框信息
    getPointContent(info) {
      let str = "";
      info.forEach((item) => {
        str += `<div>` + item.name + `: ` + item.value + `</div>`;
      });
      return (
        `<div id="p_infobox">
      <div class="info_title">评估信息</div>
      <div class="info_content">
         ` +
        str +
        `<div class="descriptionBox">描述信息:<button id="des_btn">保存</button><textarea name="description" id="des_text" cols="25" rows="3" style="resize:none;"></textarea></div>

        </div>
      </div>
    </div>`
      );
    },

    //查看航线
    showRoute(itemRoute, indexRoute) {
      console.log(itemRoute, indexRoute);
      itemRoute.showRoute = !itemRoute.showRoute;
      if (itemRoute.showRoute) {
        this.drawOriginalLine(itemRoute.id, "show");
      } else {
        //清除航线
        this.clearOriginalLine(itemRoute.id, "show");
      }
    },

    //画原始航线(区别于风险评估变色航线)
    drawOriginalLine(id, type, timeIndex, assessmentId) {
      this.$get("api/course/one", {
        id: id,
      }).then((res) => {
        console.log(res.data.data.courseItemList);
        let pointArr = res.data.data.courseItemList.map((item) => {
          return [item.latitude, item.longitude];
        });
        console.log(pointArr);
        let polyline = L.polyline(pointArr).addTo(map);
        polyline.id = type + id;
        this.showLine.push(polyline);
        pointArr.forEach((item, index) => {
          let circle;
          if (typeof timeIndex == "undefined") {
            circle = L.circleMarker(item, {
              radius: 6,
              fillOpacity: 1,
              weight: 0,
            }).addTo(map);
          } else {
            if (timeIndex == index) {
              circle = L.circleMarker(item, {
                radius: 7,
                fillOpacity: 1,
                fillColor: "#3388ff",
                weight: 4,
                color: "#00F1FF",
              }).addTo(map);
            } else {
              circle = L.circleMarker(item, {
                radius: 6,
                fillOpacity: 1,
                fillColor: "#3388ff",
                weight: 0,
              }).addTo(map);
            }
          }
          circle.id = type + id;
          circle.index = index;
          if (typeof timeIndex != "undefined") {
            circle.on("click", (e) => {
              map.off("click", window.mapClick_p);
              this.setInfoShow(false);
              console.log(e, "航线点的信息--------");
              //请求单个航线点的信息
              this.$get("api/assessment/point-conclusion", {
                assessmentId: assessmentId,
                index: e.target.index,
                point: timeIndex,
              }).then((res) => {
                console.log(res, "单个点的数据信息");
                let arr = res.data.data;
                let singleInfo = {
                  assessmentId: assessmentId, //评估id
                  index: e.target.index, //点在航线中的index值
                  message: arr[0].other,
                  arr: [
                    {
                      name: "时间",
                      value: arr[0].dateTime,
                    },
                  ],
                };
                arr.forEach((item) => {
                  if (item.name == "conclusion") {
                    singleInfo.arr.push({
                      name: "风险等级",
                      value: item.value,
                    });
                  } else {
                    singleInfo.arr.push({
                      name: item.name,
                      value: item.value,
                    });
                  }
                });
                this.setPointInfo(singleInfo);
                this.setLocation(e.containerPoint);
                // this.setInfoShow(false)
                this.setPointInfoShow(true);

                let marker = e.target;
                map.on("move", (e) => {
                  let p = map.latLngToContainerPoint(
                    L.latLng(marker._latlng.lat, marker._latlng.lng)
                  );
                  console.log(p);
                  this.setLocation(p);
                });
              });
            });
          }
          this.showLine.push(circle);
        });
      });
    },

    //清除原始航线
    clearOriginalLine(id, type) {
      for (let i = 0; i < this.showLine.length; i++) {
        if (this.showLine[i].id == type + id) {
          map.removeLayer(this.showLine[i]);
          this.showLine.splice(i, 1);
          i--;
        }
      }
    },

    // 航线编辑
    editRoute(itemRoute, indexRoute, index) {
      // false 不刷新    true 刷新
      this.setRouteDialogOptions([2, itemRoute, index, false]);
    },
  },
};
</script>

<style lang="scss" scoped></style>
