<template>
  <!-- eslint-disable -->
  <div class="nav-center">
    <!-- <span>{{moduleType[flag]}}&ensp;{{detailedParameters[flag][index]}}&ensp;{{currentDataTime}}</span> -->
    <span>{{title_text}}</span>&ensp;<span>{{title_date | showTitle}}</span>
  </div>
</template>
<script>
/* eslint-disable */
export default {
  computed: {
    title_text() {
      return this.$store.state.parameterHead.title_text
    },
    title_date() {
      return this.$store.state.parameterHead.title_date
    }
  },
  filters:{
    showTitle(val){
      console.log('时间：'+val)
      if(val!=='undefined（北京时间）'){
        return val
      }else{
        return '暂无数据'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.nav-center {
  position: fixed;
  top: 10px;
  left: 50%;
  width: 500px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  background: rgba(85, 95, 104, 0.8);
  border-radius: 25px;
  font-size: 24px;
  font-family: '微软雅黑';
  font-weight: 500;
  color: #fff;
  transform: translateX(-50%);
  // padding: 15px;
  -webkit-transform: translateX(-50%);
  -moz-transform: translateX(-50%);
  -ms-transform: translateX(-50%);
  -o-transform: translateX(-50%);
  -webkit-border-radius: 25px;
  -moz-border-radius: 25px;
  -ms-border-radius: 25px;
  -o-border-radius: 25px;
}
</style>