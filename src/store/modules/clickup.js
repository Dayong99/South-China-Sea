import lodash from 'lodash'
export default {
    namespaced: true,
    state:{
        //航线单点评估信息弹出框
        pointInfoShow:false,
        pointInfo:[],
        top:200,
        left:200,
        //工具栏单点水文气象信息
        infoData:[],
        infoTop:200,
        infoLeft:200,
        infoShow:false,

        /*------- 潮汐面板 --------*/
        tidalShow: false,
        // 显隐、相对位置
        tidalObj: {
            left: 0,
            top: 0,
        },
        // 面板数据
        tidalData: {
            time: null,
            name: null,
            timeList: [],
            tidalList: [],
        },
        // 面板图表数据
        tidalCharts: {
            xdata: [],
            ydata: [],
        },
        // 暂无数据提示
        tidalMsgFlag: false,
        changeDateIndex: 2,
    },
    mutations:{
        setPointInfoShow(state,val){
            state.pointInfoShow = val
        },
        setPointInfo(state,val){
            state.pointInfo = lodash.cloneDeep(val)
        },
        setLocation(state,obj){
            state.top = obj.y
            state.left = obj.x
        },
        setInfoShow(state,val){
            state.infoShow = val
        },
        setInfoLocation(state,obj){
            state.infoTop = obj.y
            state.infoLeft = obj.x
        },
        setInfoData(state,val){
            state.infoData = lodash.cloneDeep(val)
        },
        // 潮汐数据设置
        setTidalShow(state, val) {
            state.tidalShow = val
        },
        setTidalObj(state, val) {
            state.tidalObj = val
        },
        setTidalData(state, val) {
            state.tidalData = val
        },
        setTidalCharts(state, val) {
            state.tidalCharts = val
        },
        setTidalMsgFlag(state, val) {
            state.tidalMsgFlag = val
        },
        setChangeDateIndex(state, val) {
            state.changeDateIndex = val
        }
    }
}