<template>
  <div></div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
export default {
  components: {
  },
  data() {
    return {
      shipId:'22107',
      shipImg:require("../../assets/images/ship1.png"),
      content:{
        temp:23
      },
      // 创建的ship图标
      shipIcon: null,
      // 存放站点的list
      stationList: [],
      // 统一用站点数据
      station: {
        callSign: null,
        buoyName: null,
        lat: null,
        lon: null,
        unit: null,
        temperature: null,
        windSpeed: null,
        windDirection: null,
        dayTime: null,
        course: null,
        speed: null,
        typeFlag: null,
        value1: null,
        value2: null,
      }
    };
  },
  mounted() {
    // 船舰图标
    this.shipIcon = new L.Icon({
      iconUrl: this.shipImg,
      iconSize: [30, 30],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
    // create custom popup
    L.CustomPopup = L.Popup.extend({
      _initLayout: function () {
        var prefix = "leaflet-popup",
          container = (this._container = L.DomUtil.create(
            "div",
            prefix +
              " " +
              (this.options.className || "") +
              " leaflet-zoom-animated"
          ));

        var wrapper = container;
        this._contentNode = L.DomUtil.create(
          "div",
          prefix + "-content",
          wrapper
        );

        L.DomEvent.disableClickPropagation(wrapper)
          .disableScrollPropagation(this._contentNode)
          .on(wrapper, "contextmenu", L.DomEvent.stopPropagation);
      }
    });

    // add bindCustomPopup
    L.Layer.include({
      bindCustomPopup: function (content, options) {
        if (content instanceof L.Popup) {
          L.setOptions(content, options);
          this._popup = content;
          content._source = this;
        } else {
          if (!this._popup || options) {
            this._popup = new L.CustomPopup(options, this);
          }
          this._popup.setContent(content);
        }

        if (!this._popupHandlersAdded) {
          this.on({
            click: this._openPopup,
            // mouseover: this._openPopup,
            // mouseout: this.closePopup,
            remove: this.closePopup,
            move: this._movePopup,
          });
          this._popupHandlersAdded = true;
        }

        return this;
      },
    });
    // var icon = new L.Icon({
    //   iconUrl: this.shipImg,
    //   iconSize: [30, 30],
    //   iconAnchor: [12, 41],
    //   popupAnchor: [1, -34],
    //   shadowSize: [41, 41],
    // });
    // var locationMarker = L.marker(map.getCenter(), { icon: icon }).addTo(map);
    // //点击地图上任意另一个点，锚点跟过去，当前坐标值跟着变换；
    // locationMarker.bindCustomPopup(this.getInfoContent);

    // var locationMarker1 = L.marker([34,120], { icon: icon }).addTo(map);
    // //点击地图上任意另一个点，锚点跟过去，当前坐标值跟着变换；
    // locationMarker1.bindCustomPopup(this.getInfoContent);

  },
  computed: {
    ...mapState({
      realTimeValue: state => state.sideBar.realTimeValue
    })
  },
  watch: {
    realTimeValue(newval) {
      if(newval === 'ship') {
        this.getShipInfo()
        // var locationMarker = L.marker(map.getCenter(), { icon: icon }).addTo(map);
        // //点击地图上任意另一个点，锚点跟过去，当前坐标值跟着变换；
        // locationMarker.bindCustomPopup(this.getInfoContent('测试'));
        // locationMarker.id = this.shipId
        // locationMarker.on('click', ev => {
        //   console.log(ev)
        // })

        // var locationMarker1 = L.marker([34,120], { icon: icon }).addTo(map);
        // //点击地图上任意另一个点，锚点跟过去，当前坐标值跟着变换；
        // locationMarker1.bindCustomPopup(this.getInfoContent('还是测试'));
      }
    }
  },
  methods: {
    getValue(val){
      if(val){
        return val
      }else{
        return '--'
      }
    },
    getInfoContent(title) {
      return `<div
      id="info_box">
      <div
        class="info_title"
      >
        <i class="el-icon-ship"></i>
        <span>`+this.station.callSign+`</span>
      </div>
      <div class="info_content">
        <div class="info">
          <div>
            时分:
            <span>`+this.station.dayTime+`</span>
          </div>
          <div>
            位置:
            <span>`+this.station.lat+`N,`+this.station.lon+`E</span>
          </div>
          <div>
            浮标类型:
            <span>`+this.station.buoyName+`</span>
          </div>
          <div>
            风向:
            <span>`+this.station.windDirection+`</span>
          </div>
          <div>
            风速:
            <span>`+this.station.windSpeed+`m/s</span>
          </div>
          <div>
            风速单位:
            <span>`+this.station.unit+`</span>
          </div>
          <div>
            温度:
            <span>`+this.station.temperature+`℃</span>
          </div>
          <div>
            航向:
            <span>`+this.station.course+`</span>
          </div>
          <div>
            航速:
            <span>`+this.station.speed+`</span>
          </div>
          <div>
            海洋资料类型:
            <span>`+this.station.typeFlag+`</span>
          </div>
          <div>
            数值一:
            <span>`+this.station.value1+`</span>
          </div>
          <div>
            数值二:
            <span>`+this.station.value2+`</span>
          </div>
        </div>
      </div>
    </div>`;
    },
    getShipInfo() {
      this.$get('/api/ship-live').then(res => {
        if(res.status == 200) {
          console.log(res.data.data)
          let data = res.data.data
          data.forEach(item => {
            let lat = item.lat
            let lon = item.lon
            var locationMarker = L.marker(L.latLng(lat, lon), { icon: this.shipIcon }).addTo(map);
            //点击地图上任意另一个点，锚点跟过去，当前坐标值跟着变换；
            // locationMarker.bindCustomPopup(this.getInfoContent());
            locationMarker.type = 'ship'
            locationMarker.callSign = item.callSign
            this.stationList.push(locationMarker)
            // locationMarker.id = this.shipId
            locationMarker.on('click', ev => {
              console.log(ev)
              this.$get('/api/ship-live/one', {
                callSign: ev.target.callSign,
                localDate: this.$m().format('YYYY-MM-DD')
              }).then(res => {
                if(res.status == 200) {
                  let station = res.data.data
                  // station: {
                  //   callSign: null,
                  //   buoyName: null,
                  //   lat: null,
                  //   lon: null,
                  //   unit: null,
                  //   temperature: null,
                  //   windSpeed: null,
                  //   windDirection: null,
                  //   ms: null,
                  //   course: null,
                  //   speed: null,
                  //   typeFlag: null,
                  //   value1: null,
                  //   value2: null,
                  // }
                  this.station.callSign = station.callSign
                  this.station.buoyName = station.buoyName
                  this.station.lat = station.lat
                  this.station.lon = station.lon
                  this.station.unit = station.unit
                  this.station.temperature = station.temperature
                  this.station.windSpeed = station.windSpeed
                  this.station.windDirection = station.windDirection
                  this.station.dayTime = station.dayTime
                  this.station.course = station.course
                  this.station.speed = station.speed
                  this.station.typeFlag = station.typeFlag
                  this.station.value1 = station.value1
                  this.station.value2 = station.value2
                  let i = this.stationList.findIndex(item => {
                    return item.callSign === ev.target.callSign
                  })
                  if(i != -1) {
                    this.stationList[i].bindCustomPopup(this.getInfoContent())
                  }
                }
              }).catch(error => {
                this.$message.error('获取站点数据失败')
              })
            })
          })
        }
      }).catch(error => {
        this.$message.error('获取船舶站数据失败')
      })
    }
  },
};
</script>
<style scoped lang='scss'>
.l-popup {
  &--no-style {
    /* 用不了 &#{&} 这种写法*/
    .leaflet-popup-close-button.leaflet-popup-close-button {
      display: none;
    }
    .leaflet-popup-tip-container.leaflet-popup-tip-container {
      display: none;
    }
    .leaflet-popup-content-wrapper.leaflet-popup-content-wrapper {
      background: transparent;
      border-radius: 0;
      padding: 0;
      .leaflet-popup-content.leaflet-popup-content {
        margin: 0;
      }
    }
  }
}
.info_title::after {
  border-color: var(--borderColor);
}
</style>