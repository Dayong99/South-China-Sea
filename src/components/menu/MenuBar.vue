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
            placeholder="请输入位置"
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
            :src="downIcon"
            v-if="index == 2"
            class="down"
            @click.stop="openTask(index)"
          />
        </li>
        
        <ul class="list_task_ul" v-show="menuListFlag">
          <li v-for="(item, index) in taskList" :key="index">
            <div class="task_name">
              <div class="task_dot"></div>
              <span>{{ item.name }}</span>
            </div>
            <div class="task_operation">
              <el-button
                icon="el-icon-warning-outline"
                class="table_column_icon blue"
                type="text"
              ></el-button>
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
                icon="el-icon-s-operation"
                class="table_column_icon purple"
                type="text"
              ></el-button>
            </div>
          </li>
        </ul>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      // 搜索框
      searchFlag: false,
      searchIcon: require("@/assets/images/menu/unselect.png"),
      searchValue: "",

      // 任务管理展开
      menuListFlag: false,
      downIcon: require("@/assets/images/menu/down.png"),
      nowMenuList: [],
      taskList: [],
    };
  },
  computed: {
    ...mapState({
      menuList: (state) => state.menuBar.menuList,
      TaskManagerOptions: (state) => state.menuBar.TaskManagerOptions,
    }),
  },
  watch: {
    menuList: {
      handler(newval, oldval) {
        let i = newval.findIndex((item) => {
          return item.flag == true;
        });
        if (i != -1) {
          // 任务管理控制箭头
          if (i == 2) {
            this.menuListFlag = true;
          } else {
            this.menuListFlag = false;
          }
        }
      },
      deep: true,
    },
    // 任务管理
    menuListFlag(newval, oldval) {
      if (newval) {
        this.downIcon = require("@/assets/images/menu/up.png");
      } else {
        this.downIcon = require("@/assets/images/menu/down.png");
        // this.menuList[2].flag = false
      }
    },
    TaskManagerOptions() {
      this.loadTaskList();
    },
  },
  mounted() {
    this.loadTaskList();
  },
  methods: {
    ...mapMutations({
      setMenuList: "menuBar/setMenuList",
      setTaskManagerOptions: "menuBar/setTaskManagerOptions",
    }),
    editTaskItem(item) {
      this.setTaskManagerOptions(2);
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
          this.taskList = res.data.data.rows;
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
        this.downIcon = require("@/assets/images/menu/down.png");
      }
    },
    //------------end搜索框--------------

    //------------start任务管理--------------
    // 添加任务
    addTask(index) {
      this.setTaskManagerOptions(1);
    },
    // 打开任务管理
    openTask(index) {
      // 重置
      this.menuList.forEach((item) => {
        item.flag = false;
      });
      // 任务管理需要可以多次切换
      if (index == 2) {
        this.menuList[index].flag = !this.menuListFlag;
        this.menuListFlag = !this.menuListFlag;
      } else {
        this.menuList[index].flag = true;
      }
      this.setMenuList(this.menuList);
    },
    //------------end任务管理--------------
  },
};
</script>

<style lang="scss" scoped>
</style>