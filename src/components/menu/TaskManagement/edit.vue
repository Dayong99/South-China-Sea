<template>
  <el-dialog
    :title="title"
    width="500px"
    top="80px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="taskManagerShow"
    append-to-body
    @close="closeManager"
  >
    <el-form
      ref="form"
      :model="data"
      :rules="rules"
      label-position="right"
      label-width="100px"
      style="line-height: 100%"
    >
      <!-- 名称 -->
      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="名称">
              <el-input
                placeholder="请输入任务内容"
                v-model="formData.name"
              ></el-input>
            </el-form-item>
            <el-form-item label="任务类型">
              <el-select
                class="select_wrapper"
                v-model="formData.ptype"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in planTypeList"
                  :key="item.baseValue"
                  :label="item.baseKey"
                  :value="item.baseValue"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <!-- 作战单元 -->
      <el-row>
        <el-col :span="18">
          <div class="grid-content bg-purple-dark">
            <el-form-item label="作战类型">
              <el-select
                class="select_wrapper"
                v-model="formData.type"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="formData.type === 1">
              <div class="wrapper">
                <div
                  class="content_wrapper"
                  v-for="(item, index) in shipList"
                  :key="`ship${index}`"
                >
                  <div class="content">
                    <span
                      class="content_desc item"
                      :style="{
                        color: item.checked ? '#FF0000' : 'rgba(80, 80, 80, 1)',
                      }"
                      >{{ item.warshipName }}</span
                    >
                    <span
                      class="content_type item"
                      :style="{
                        color: item.checked
                          ? '#FF0000'
                          : 'rgba(138, 138, 138, 1)',
                      }"
                      >{{ item.warshipType }}</span
                    >
                  </div>
                  <div class="check">
                    <el-checkbox v-model="item.checked"></el-checkbox>
                  </div>
                </div>
              </div>
            </el-form-item>
            <el-form-item v-if="formData.type === 2">
              <div class="wrapper">
                <div
                  class="content_wrapper"
                  v-for="(item, index) in teamList"
                  :key="`team${index}`"
                >
                  <div class="content">
                    <span
                      class="content_desc item"
                      :style="{
                        color: item.checked ? '#FF0000' : 'rgba(80, 80, 80, 1)',
                      }"
                      >{{ item.name }}</span
                    >
                    <span
                      class="content_type item"
                      :style="{
                        color: item.checked
                          ? '#FF0000'
                          : 'rgba(138, 138, 138, 1)',
                      }"
                      >{{ item.ships }}</span
                    >
                  </div>
                  <div class="check">
                    <el-checkbox
                      v-model="item.checked"
                      @change="changeTeamActive(item, index)"
                    ></el-checkbox>
                  </div>
                </div>
              </div>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <div class="save_wrapper">
      <button class="save" type="button" @click="submit()">保存</button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  components: {},
  data() {
    return {
      title: "添加任务",
      data: {},
      rules: {},
      planTypeList: [],
      options: [
        {
          value: 1,
          label: "自由组队",
        },
        {
          value: 2,
          label: "已有编队",
        },
      ],
      taskManagerShow: false,
      formData: {
        name: "",
        type: 2,
        ptype: 0,
      },
      // 舰船列表
      shipList: [],
      teamList: [],
    };
  },
  computed: {
    ...mapState({
      TaskManagerOptions: (state) => state.menuBar.TaskManagerOptions,
    }),
  },
  watch: {
    TaskManagerOptions: {
      handler: function (val) {
        if (val[0] === 1) {
          this.title = "添加任务";
        }
        if (val[0] === 2) {
          this.title = "修改任务";
        }
        this.taskManagerShow = val[0];
        if (val[0] === 1 || val[0] === 2) {
          this.loadShipList();
        }
        this.loadPtypeList();
      },
    },
  },
  methods: {
    ...mapMutations({
      setTaskManagerOptions: "menuBar/setTaskManagerOptions",
    }),
    loadPtypeList() {
      this.$get(`api/base-info/values`, {
        type: `任务`,
      }).then((res) => {
        if (res.status) {
          this.planTypeList = res.data.data;
          this.formData.ptype = res.data.data[0].baseValue;
          console.log(this.formData.ptype, `this.formData.ptype`);
        }
      });
    },
    setData() {
      console.log(`setData`, this.TaskManagerOptions[1]);
      this.$get(`api/base-info/values`, {
        type: `任务`,
      })
        .then((res) => {
          if (res.status) {
            this.planTypeList = res.data.data;
          }
        })
        .then(() => {
          if (this.TaskManagerOptions[0] === 2) {
            this.$get(`/api/plan/sfs`, {
              id: this.TaskManagerOptions[1].id,
            }).then((res) => {
              if (res.data.data) {
                res.data.data.forEach((e, i) => {
                  // 编队
                  if (e.type === 0) {
                    this.teamList = this.teamList.map((a, b) => {
                      let obj = a;
                      if (a.id === e.sfId) {
                        obj.checked = true;
                      }
                      return obj;
                    });
                  }
                  // 船舰
                  if (e.type === 1) {
                    this.shipList = this.shipList.map((a, b) => {
                      let obj = a;
                      if (a.id === e.sfId) {
                        obj.checked = true;
                      }
                      return obj;
                    });
                  }
                  console.log(this.shipList, `this.shipListsetData`);
                });
              }
            });
            this.formData = {
              id: this.TaskManagerOptions[1].id,
              name: this.TaskManagerOptions[1].name,
              ptype: this.TaskManagerOptions[1].ptype,
              type: 1,
              createtime: this.TaskManagerOptions[1].createtime,
            };
          }
        });
    },
    closeManager() {
      this.taskManagerShow = false;
      this.setTaskManagerOptions([0, {}]);
      this.reset();
    },
    changeTeamActive(item, index) {
      if (!item.checked) {
        return;
      }
      if (item.checked) {
        this.teamList = this.teamList.map((e, i) => {
          let obj = e;
          if (item.id === e.id) {
            obj.checked = true;
          } else {
            obj.checked = false;
          }
          return obj;
        });
      }
    },
    submit() {
      console.log(this.formData, `this.formDatathis.formData`);
      let obj = {};
      obj["name"] = this.formData.name;
      obj["ptype"] = this.formData.ptype;
      obj["planSfs"] = [];
      if (this.formData.type === 1) {
        this.shipList.forEach((e, i) => {
          if (e.checked) {
            let a = {};
            a["sfId"] = e.id;
            a["type"] = 1;
            obj["planSfs"].push(a);
          }
        });
      }
      if (this.formData.type === 2) {
        this.teamList.forEach((e, i) => {
          if (e.checked) {
            let a = {};
            a["sfId"] = e.id;
            a["type"] = 0;
            obj["planSfs"].push(a);
          }
        });
      }

      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.title === "添加任务") {
            this.$jsonPost(`/api/plan`, {
              ...obj,
            })
              .then(() => {
                this.$message({
                  message: "任务添加成功",
                  type: "success",
                });
                this.reset();
                this.closeManager();
              })
              .catch(() => {
                this.$message({
                  message: "任务添加失败",
                  type: "error",
                });
                this.reset();
                this.closeManager();
              });
          }
          if (this.title === "修改任务") {
            this.$jsonPut(`/api/plan`, {
              ...obj,
              id: this.formData.id,
            })
              .then(() => {
                this.$message({
                  message: "任务修改成功",
                  type: "success",
                });
                this.reset();
                this.closeManager();
              })
              .catch(() => {
                this.$message({
                  message: "任务修改失败",
                  type: "error",
                });
                this.reset();
                this.closeManager();
              });
          }
        }
      });
    },
    reset() {
      this.shipList = [];
      this.teamList = [];
      this.formData = {
        name: "",
        type: 2,
        ptype: ""
      };
    },
    loadShipList() {
      this.shipList = [];
      this.$get(`/api/warship`, {
        pageSize: 10000,
      })
        .then((res) => {
          if (res.data.data) {
            this.shipList = res.data.data.rows.map((e, i) => {
              return { ...e, checked: false };
            });
            console.log("船舰数组", this.shipList);
          }
        })
        .then(() => {
          this.loadTeamList();
        });
    },
    loadTeamList() {
      console.log(`请求编队信息`);
      this.teamList = [];
      this.$get(`/api/formation`)
        .then((res) => {
          if (res.data.data) {
            this.teamList = res.data.data.rows.map((e, i) => {
              return { ...e, checked: false };
            });
          }
          console.log(`编队数组`, this.teamList);
        })
        .then(() => {
          this.setData();
        });
    },
  },
};
</script>

<style lang="scss">
.select_wrapper {
  width: 260px;
  height: 32px;
  cursor: pointer;
  background: rgba(245, 245, 245, 1);
}
.el-input__inner {
  color: #2a2c30;
}
</style>