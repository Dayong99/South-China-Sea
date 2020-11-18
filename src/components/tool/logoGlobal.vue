
<template>
  <!-- eslint-disable -->
  <div class="logo-global" id="logo-global">
    <!-- <img src="@/assets/images/logo/logo.png" /> -->
    <img src="@/assets/images/logo.png" />
    <span>{{logoName}}</span>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  data() {
    return {
      logoName: "XX船舰"
    };
  },
  created() {},
  methods: {}
};
</script>

<style scoped lang="scss">
#logo-global {
  z-index: 999;
}
.logo-global {
  position: fixed;
  top: 12.5px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 26px;
  letter-spacing: 2px;
  font-family: FZLTZCHK--GBK1-0, FZLTZCHK--GBK1;
  font-weight: normal;
  color: #2674FD;
  padding: 10px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  -ms-border-radius: 5px;
  -o-border-radius: 5px;
  width: 302px;
	border-radius: 23px;
  text-align: center;
  user-select: none;
}

.logo-global img {
  // width: 46px;
  width: 34px;
  height: 34px;
  vertical-align: middle;
  margin-right: 5px;
  color: #FFFFFF;
}
</style>