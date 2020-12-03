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
        infoShow:true


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

    }
}