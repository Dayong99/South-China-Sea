<template>
  <div id="clickup_box">
    <div
      id="p_infobox"
      v-if="pointInfoShow"
      :style="{ top: top - 14 + 'px', left: left + 14 + 'px' }"
    >
      <div class="info_title">评估信息</div>
      <div class="info_content">
        <div v-for="(item, index) in pointInfo.arr" :key="index">
          <div class="content_item">{{ item.name }}: {{ item.value }}</div>
        </div>
        <div class="descriptionBox">
          描述信息:
          <textarea
            name="description"
            id="des_text"
            cols="25"
            rows="3"
            style="resize:none;"
            v-model="pointInfo.message"
          ></textarea>
        </div>
        <div class="btn_box">
          <button id="des_btn_pre" @click="desPreserve">保存</button>
          <button id="des_btn_close" @click="desClose">取消</button>
        </div>
      </div>
    </div>

    <div
      id="p_infobox"
      v-if="infoShow"
      :style="{ top: infoTop - 14 + 'px', left: infoLeft + 14 + 'px' }"
    >
      <div class="info_title">水文信息</div>
      <div class="info_content">
        <div v-for="(item, index) in infoData" :key="index">
          <div class="content_item">{{ item.name }}: {{ item.value }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "vueName",
  components: {},
  props: {},
  data() {
    return {
      pointInfoList: [
        {
          name: "时间",
          value: "2020-01-01 10:00",
        },
        {
          name: "温度",
          value: "23",
        },
        {
          name: "高度",
          value: "1234",
        },
      ],
      //   textValue:""
    };
  },
  computed: {
    ...mapState({
      pointInfoShow: (state) => state.clickup.pointInfoShow,
      pointInfo: (state) => state.clickup.pointInfo,
      top: (state) => state.clickup.top,
      left: (state) => state.clickup.left,
      infoTop: (state) => state.clickup.infoTop,
      infoLeft: (state) => state.clickup.infoLeft,
      infoShow: (state) => state.clickup.infoShow,
      infoData: (state) => state.clickup.infoData,
    }),
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    ...mapMutations({
      setPointInfoShow: "clickup/setPointInfoShow",
    }),
    desPreserve() {
      console.log(this.pointInfo.message);
      this.$get("api/assessment/prompt-title", {
        assessmentId: this.pointInfo.assessmentId,
        index: this.pointInfo.index,
        title: this.pointInfo.message,
      })
        .then((res) => {
          console.log(res);
          this.$message({
            message: "保存成功",
            type: "success",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    desClose() {
      this.setPointInfoShow(false);
    },
  },
};
</script>

<style lang="scss" scoped></style>
