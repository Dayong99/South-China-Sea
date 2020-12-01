
<template>
  <!-- eslint-disable -->
  <div class="logo-global" id="logo-global">
    <div class="logal_image">
      <img src="@/assets/images/logo.png" />
    </div>
    <span>{{logoName}}</span>
    <span>船舰</span>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  data() {
    return {
      logoName: "XX"
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
  width: 302px;
  position: fixed;
  top: 12.5px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 26px;
  letter-spacing: 2px;
  font-family: FZLTZCHK--GBK1-0, FZLTZCHK--GBK1;
  font-weight: bold;
  color: #fff;
  padding: 10px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  -ms-border-radius: 5px;
  -o-border-radius: 5px;
	border-radius: 23px;
  user-select: none;
  display: flex;
  justify-content: center;
  align-items: center;
  color:rgba(152, 26, 0, 1);

  .logal_image {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background: rgba(152, 26, 0, 1);
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 15px;

    img {
      width: 70%;
      height: 70%;
    }
  }

  span:last-child {
    font-weight: normal;
  }
}
</style>