<template>
  <div></div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
export default {
  components: {},
  data() {
    return {
      // 创建的ship图标
      shipIcon: null,
      // 存放站点的list
      stationList: [],
      shipImg: require("../../assets/images/ship1.png"),
      buoyImg: require("../../assets/images/buoy.png"),
      // 浮标
      buoyList: [],
      buoyMarkerGroup: [],
      shipMarkerGroup: [],
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
      },
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

    // var locationMarker1 = L.marker([34, 120], { icon: icon }).addTo(map);
    // //点击地图上任意另一个点，锚点跟过去，当前坐标值跟着变换；
    // locationMarker1.bindCustomPopup(this.getInfoContent);
  },
  computed: {
    ...mapState({
      realTimeValue: (state) => state.sideBar.realTimeValue,
    }),
  },
  watch: {
    realTimeValue(newval) {
      // 先清除站点数据
      this.removeAllLayer()

      if(newval === 'ship') {
        this.getShipInfo()
      } else if (newval === "buoy") {
        this.$get("/api/ocean-buoys-live").then((r) => {
          if (r.status == 200) {
            this.buoyList = r.data.data;
            let markerArr = [];
            this.buoyList.forEach((item, index) => {
              let icon = new L.Icon({
                iconUrl: this.buoyImg,
                iconSize: [30, 30],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41],
              });
              let buoy = L.marker([item.lat, item.lon], {
                icon: icon,
              });
              markerArr.push(buoy);

              // buoy.id = this.shipId;
              //点击地图上任意另一个点，锚点跟过去，当前坐标值跟着变换；
              // buoy.bindCustomPopup(this.getInfoContent(item.callSign));
              buoy.on("click", (ev) => {
                this.$get("/api/ocean-buoys-live/one", {
                  areaNum: item.areaNum,
                  localDate: this.$m(new Date()).format("YYYY-MM-DD"),
                }).then((r) => {
                  if (r.status == 200) {
                    let str = this.getBuoyContent({
                      title: item.areaNum,
                      content: r.data.data,
                      lon: item.lon,
                      lat: item.lat,
                    });
                    buoy.bindCustomPopup(str).openPopup();
                  }
                });
              });
            });
            this.buoyMarkerGroup = L.layerGroup(markerArr);
            map.addLayer(this.buoyMarkerGroup);
          }
        });
      }
    },
  },
  methods: {
    getValue(val) {
      if (val) {
        return val;
      } else {
        return "--";
      }
    },
    getBuoyContent(info) {
      return (
        `<div id="info_box">
          <div class="info_title">
            <span>浮标` + info.title + `</span>
          </div>
          <div class="info_content">
            <div class="info">
              <div>位置:<span>` + info.lon + `N,` + info.lat + `E</span> </div>
              <div>温度:<span>` + this.getValue(info.content.temperature) + `℃</span> </div>
              <div>海平面气压:<span>` + this.getValue(info.content.pressure) + `hPa</span></div>
              <div>湿度:<span>` + this.getValue(info.content.humidity) + `%</span></div>
              <div>风速:<span>` + this.getValue(info.content.windDirection) + `° ` + this.getValue(info.content.windSpeed) +
                `m/s</span>
              </div>
              <div>风浪周期:<span>` + this.getValue(info.content.wavePeriodFlag1) + `秒</span></div>
              <div>风浪高度:<span>` + this.getValue(info.content.waveHeightFlag1) + `米</span></div>
              <div>涌浪周期:<span>` + this.getValue(info.content.wavePeriodFlag20) + `秒</span></div>
              <div>涌浪高度:<span>` + this.getValue(info.content.waveHeightFlag21) + `米</span></div>
            </div>
          </div>
        </div>`
      );
    },
    getShipContent(info) {
      return (
      `<div id="info_box">
        <div class="info_title"><i class="el-icon-ship"></i><span>`+info.callSign+`</span></div>
        <div class="info_content">
          <div class="info">
            <div>
              时分:
              <span>`+info.dayTime+`</span>
            </div>
            <div>
              位置:
              <span>`+info.lat+`N,`+info.lon+`E</span>
            </div>
            <div>
              浮标类型:
              <span>`+this.getValue(info.buoyName)+`</span>
            </div>
            <div>
              风向:
              <span>`+this.getValue(info.windDirection)+`°</span>
            </div>
            <div>
              风速:
              <span>`+this.getValue(info.windSpeed)+`m/s</span>
            </div>
            <div>
              温度:
              <span>`+this.getValue(info.temperature)+`℃</span>
            </div>
            <div>
              航向:
              <span>`+this.getValue(info.course)+`</span>
            </div>
            <div>
              航速:
              <span>`+this.getValue(info.speed)+`</span>
            </div>
            <div>
              海洋资料类型:
              <span>`+this.getValue(info.typeFlag)+`</span>
            </div>
            <div>
              数值一:
              <span>`+this.getValue(info.value1)+`</span>
            </div>
            <div>
              数值二:
              <span>`+this.getValue(info.value2)+`</span>
            </div>
          </div>
        </div>
      </div>`)
    },
    getShipInfo() {
      this.$get('/api/ship-live').then(res => {
        if(res.status == 200) {
          console.log(res.data.data)
          let data = res.data.data
          let markerArr = []
          data.forEach(item => {
            let lat = item.lat
            let lon = item.lon
            let shipMarker = L.marker(L.latLng(lat, lon), { icon: this.shipIcon }).addTo(map);
            //点击地图上任意另一个点，锚点跟过去，当前坐标值跟着变换；
            shipMarker.type = 'ship'
            shipMarker.callSign = item.callSign
            markerArr.push(shipMarker)
            shipMarker.on('click', ev => {
              this.$get('/api/ship-live/one', {
                callSign: ev.target.callSign,
                localDate: this.$m().format('YYYY-MM-DD')
              }).then(res => {
                if(res.status == 200) {
                  let station = res.data.data
                  let str = this.getShipContent({
                    callSign: shipMarker.callSign,
                    buoyName: station.buoyName,
                    lat: station.lat,
                    lon: station.lon,
                    dataUnit: station.dataUnit,
                    temperature: station.temperature,
                    windSpeed: station.windSpeed,
                    windDirection: station.windDirection,
                    dayTime: this.$m(station.dayTime).format('HH')+'时'+this.$m(station.dayTime).format('mm')+'分',
                    course: station.course,
                    speed: station.speed,
                    typeFlag: station.typeFlag,
                    value1: station.value1,
                    value2: station.value2,
                  });
                  shipMarker.bindCustomPopup(str).openPopup()
                }
              }).catch(error => {
                this.$message.error('获取站点数据失败')
              })
            })
          })
          this.shipMarkerGroup = L.layerGroup(markerArr)
          map.addLayer(this.shipMarkerGroup)
        }
      }).catch(error => {
        this.$message.error('获取船舶站数据失败')
      })
    },
    // 清除站点数据
    removeAllLayer() {
      map.removeLayer(this.buoyMarkerGroup)
      map.removeLayer(this.shipMarkerGroup)
    },
  },
};
</script>
<style scoped lang ='scss'>
  /* 用不了 &#{&} 这种写法*/
.l-popup {
  &--no-style {
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