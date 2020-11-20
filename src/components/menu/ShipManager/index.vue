<template>
  <div id="ship_manager" class="ship_manager" v-show="shipManagerShow">
    <div class="manager_title">
      <span>船舰管理</span>
      <img
        src="@/assets/images/legendbar/close.png"
        @click.stop="closeManager"
      />
    </div>
    <div class="manager_operation">
      <el-input
        placeholder="请输入关键词"
        prefix-icon="el-icon-search"
        v-model="managerValue"
        class="operation_input"
        clearable
      >
      </el-input>
      <el-button class="operation_search">搜索</el-button>
      <el-button class="operation_clear">重置</el-button>
      <el-button icon="el-icon-plus" class="operation_add" @click="add"
        >添加</el-button
      >
    </div>
    <div class="manager_table">
      <el-table :data="tableData" border style="width: 100%" max-height="390px">
        <el-table-column
          prop="date"
          label="日期"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          width="120"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="province"
          label="省份"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="city"
          label="市区"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="zip"
          label="邮编"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="picture"
          label="图片"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-button type="text">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="140px"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              icon="el-icon-warning-outline"
              class="table_column_icon blue"
              type="text"
            ></el-button>
            <el-button
              icon="el-icon-edit-outline"
              class="table_column_icon green"
              type="text"
            ></el-button>
            <el-button
              icon="el-icon-delete"
              class="table_column_icon red"
              type="text"
            ></el-button>
            <el-button
              icon="el-icon-s-operation"
              class="table_column_icon purple"
              type="text"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="manager_page">
      <el-pagination
        :page-sizes="[5, 10, 15]"
        :page-size="10"
        :pager-count="5"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="400"
      >
      </el-pagination>
    </div>

    <edit
      ref="edit"
      :dialog-visible="dialog.isVisible"
      :title="dialog.title"
      @close="closeDialogPage"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import edit from "./edit.vue";
export default {
  components: {
    edit,
  },
  data() {
    return {
      total: null,
      // 新增 修改 对话框
      dialog: {
        isVisible: false,
        title: "",
      },
      // 详细面板显示隐藏
      shipManagerShow: false,
      managerValue: "",
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1517 弄",
          zip: 200333,
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1519 弄",
          zip: 200333,
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1516 弄",
          zip: 200333,
        },
      ],
    };
  },
  mounted() {
    this.fetch()
  },
  computed: {
    ...mapState({
      menuList: (state) => state.menuBar.menuList,
    }),
  },
  watch: {
    // 监听menuList，控制详细面板的显隐
    menuList: {
      handler(newval, oldval) {
        let i = newval.findIndex((item) => {
          return item.flag == true;
        });
        if (i != -1 && i == 0) {
          this.shipManagerShow = true;
        } else {
          this.shipManagerShow = false;
        }
      },
      deep: true,
    },
  },
  methods: {
    ...mapMutations({
      setMenuList: "menuBar/setMenuList",
    }),
    add() {
      console.log('添加')
      this.dialog.isVisible = true;
      this.dialog.title = "添加船舰";
    },
    // 获取表格数据
    fetch() {
      console.log('获取表格数据')
      let params = {}
      this.$get('/api/warship',{
        ...params
      }).then(res=> {
        console.log(res.data.data,`tableData`)
        this.total = res.data.data.total
      })
    },
    // 关闭新增 修改 对话框
    closeDialogPage() {
      this.dialog.isVisible = false;
      this.fetch()
    },
    closeManager() {
      this.shipManagerShow = false;
      this.menuList[0].flag = false;
      this.setMenuList(this.menuList);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>