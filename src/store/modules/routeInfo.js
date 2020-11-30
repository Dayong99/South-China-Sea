export default {
    namespaced: true,
    state:{
        titleList:[],
        dataList:[],
        routeInfoShow:false
    },
    mutations:{
        setTitleList(state,val){
            state.titleList = JSON.parse(JSON.stringify(val))
        },
        setDataList(state,val){
            state.dataList = JSON.parse(JSON.stringify(val))
        },
        setRouteInfoShow(state,val){
            state.routeInfoShow = val
        }
    }
}