/* jshint esversion: 6 */
/* eslint-disable */
export default {
  namespaced: true,
  state: {
    markToolsList: [
      /* 点 */
      {
        src: require("@/assets/toolList/shape/line.svg"),
        events: "drawPoint",
        type: 'line'
      },
      /* 矩形 */
      {
        src: require("@/assets/toolList/shape/rect.svg"),
        events: "drawRectangle",
        type: 'rectangle'
      },
      /* 多边形 */
      {
        src: require("@/assets/toolList/shape/polygon.svg"),
        events: "drawPolygon",
        type: 'polygon'
      },
      /* 圆形 */
      {
        src: require("@/assets/toolList/shape/circle.svg"),
        events: "drawCircle",
        type: 'circle'
      },
      /* 封闭曲线 */
      // {
      //   src: require("@/assets/images/toolBar/pline.svg"),
      //   events: "drawCurve",
      //   type: 'curve'
      // },
      /* 文字 */
      // {
      //   src: require("@/assets/images/toolBar/font.svg"),
      //   events: "font",
      //   type: 'font'
      // },
      /* 箭头 */
      // {
      //   src: require("@/assets/images/toolBar/arrow.svg"),
      //   events: "drawArrow",
      //   type: 'arrow'
      // },
      /* 编辑 */
      // {
      //   src: require("@/assets/images/toolBar/edit.svg"),
      //   events: "edit",
      //   type: 'edit'
      // },
    ],
    controlList: [
      /* 确定 */
      // {
      //   src: require("@/assets/images/toolBar/yes.svg"),
      //   events: "yes",
      //   type: 'yes'
      // },
      /* 关闭 */
      {
        src: require("@/assets/toolList/shape/close.svg"),
        events: "close",
        type: 'close'
      }
    ],
    colorList: [{
        class: "color_box",
        color: "rgb(255,72,72,1)",
      },
      {
        class: "color_box",
        color: "rgb(255,186,0,1)",
      },
      {
        class: "color_box",
        color: "rgb(122,8,0,1)",
      }
    ],
    sizeList: [{
        class: "round_mini",
        size: "size_mini",
      },
      {
        class: "round_normal",
        size: "size_normal",
      },
      {
        class: "round_large",
        size: "size_large",
      },
    ],
    bindColor: "#409EFF",
    markShow: false,
    echoId: {}
  },
  mutations: {
    setMarkShow(state,val) {
      state.markShow = val
      console.log(state.markShow,`state.markShow`)
    },
    setEchoId(state,val) {
      state.echoId = val
      console.log(state.echoId,`state.casePictureInfo`)
    }
  }
};
