
<template>
  <div class="right-top-container" id="toolBar">
    <div class="zoom zoom-in" @click.stop="zoomIn">
      <img src="@/assets/toolList/add.png">
    </div>
    <div class="zoom zoom-out" @click.stop="zoomOut">
      <img src="@/assets/toolList/minus.png">
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      
    };
  },
  computed: {
    
  },
  watch: {
    
  },
  mounted() {
    
  },
  methods: {
    // 地图放大
    zoomIn() {
      window.map.zoomIn(1)
    },
    // 地图缩小
    zoomOut() {
      window.map.zoomOut(1)
    },
  }
};
</script>
<style scoped lang="scss">
#toolBar {
  z-index: 999;
}
.right-top-container {
  position: absolute;
  right: 35px;
  top: 26px;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;

  .zoom {
    width: 28px;
    height: 28px;
    line-height: 28px;
    border-radius: 50%;
    background: rgba(26, 26, 24, 0.7);
    text-align: center;
    cursor: pointer;

    img {
      width: 90%;
      height: 90%;
      vertical-align: middle;
    }
  }

  .zoom-out {
    margin-top: 5px;
  }
}

/* 设置滚动条的样式 */
::-webkit-scrollbar {
  width: 4px;
  background-color: rgba(0, 0, 0, 0.5);
}

/* 滚动槽 */
::-webkit-scrollbar-track {
  border-radius: 10px;
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: rgba(240, 240, 240, 0.6);
}
</style>
