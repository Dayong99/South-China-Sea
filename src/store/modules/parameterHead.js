/* eslint-disable */
/* jshint esversion: 6 */
/* 
界面-参数标题 
*/
export default {
  // !每个文件形成独立命名空间
  namespaced: true,
  state: {
    parameter_data: "未选择数据",
    title_text: '暂无参数',
    title_date: '暂无数据',
    longitudeDateLatitudeData: []
  },
  mutations: {
    setParameter_data(state,val) {
      state.parameter_data = val
    },
    setTitle_text(state,val) {
      state.title_text = val
    },
    setTitle_date(state,val) {
      state.title_date = val+'（北京时间）'
    },
    setLongitudeDateLatitudeData(state, val) {
      state.longitudeDateLatitudeData = val
    }
  }
};