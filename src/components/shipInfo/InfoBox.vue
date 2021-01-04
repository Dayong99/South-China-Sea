<template>
  <div></div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import {
  getShipFillingValueImage,
  getOceanFillingValueImage,
  getBuoyFillingValueImage,
} from "@/utils/getfilValueImage.js";
import "@/utils/L.CanvasOverlay.js";
export default {
  components: {},
  data() {
    return {
      // 创建的ship图标
      shipIcon: null,
      groundIcon: null,
      oceanIcon: null,
      // 存放站点的list
      stationList: [],
      shipImg: require("@/assets/images/sidebar/redship.png"),
      buoyImg: require("@/assets/images/sidebar/redbuoy.png"),
      groundImg: require("@/assets/images/sidebar/redground.png"),
      oceanImg: require("@/assets/images/sidebar/redocean.png"),
      shipImage: require("@/assets/images/sidebar/ship.png"),
      buoyImage: require("@/assets/images/sidebar/buoy.png"),
      groundImage: require("@/assets/images/sidebar/ground.png"),
      oceanImage: require("@/assets/images/sidebar/ocean.png"),
      // 浮标
      buoyList: [],
      buoyMarkerGroup: [],
      shipMarkerGroup: [],
      oceanMarkerGroup: [],
      groundMarkerGroup: [],
      // 船舶站数组
      shipMarkArr: [],
      // 海洋填值
      oceanMarkArr: [],
      // 浮标填值
      buoyMarkArr: [],
    };
  },
  mounted() {
    // 船舰图标
    this.shipIcon = new L.Icon({
      iconUrl: this.shipImg,
      iconSize: [20, 20],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
    this.groundIcon = new L.Icon({
      iconUrl: this.groundImg,
      iconSize: [20, 20],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
    this.oceanIcon = new L.Icon({
      iconUrl: this.oceanImg,
      iconSize: [20, 20],
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
            prefix + " " + (this.options.className || "") + " leaflet-zoom-animated"
          ));

        var wrapper = container;
        this._contentNode = L.DomUtil.create("div", prefix + "-content", wrapper);

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
      this.removeAllLayer();
      if (newval === "ground") {
        // 地面常规观测站
        this.getGroundInfo();
      } else if (newval === "ship") {
        // 船舶站
        this.getShipInfo();
      } else if (newval === "ocean") {
        // 海洋站
        this.getOceanInfo();
      } else if (newval === "buoy") {
        // 浮标站
        this.$get("/api/ocean-buoys-live").then((r) => {
          if (r.status == 200) {
            this.buoyList = r.data.data;
            this.buoyList.forEach((item, index) => {
              this.$get("/api/ocean-buoys-live/one-byId", {
                id: item.id,
              })
                .then((r) => {
                  if (r.status == 200) {
                    let data = r.data.data;
                    let day = this.$m(data.dayTime).format("YYYY-MM-DD");
                    let time =
                      this.$m(data.dayTime).format("HH") +
                      "时" +
                      this.$m(data.dayTime).format("mm") +
                      "分";
                    let str = this.getBuoyContent({
                      title: "浮标站",
                      content: r.data.data,
                      day: day,
                      time: time,
                      lon: Number(item.lon).toFixed(3),
                      lat: Number(item.lat).toFixed(3),
                    });
                    const image = getBuoyFillingValueImage({
                      tempreture: data.temperature,
                      time: this.$m(data.dayTime).format("HH:mm"),
                      dirwind: data.windDirection,
                      speedwind: data.windSpeed,
                      wavePeriod: data.wavePeriod,
                      waveHeight: data.waveHeight,
                      salinity: data.salinity,
                    });
                    const fillIcon = new L.Icon({
                      iconUrl: image,
                      iconSize: [80, 80],
                      iconAnchor: [42, 64],
                      popupAnchor: [1, -34],
                      shadowSize: [41, 41],
                    });
                    let buoy = L.marker([item.lat, item.lon], {
                      icon: fillIcon,
                    }).addTo(map);
                    buoy.id = item.id;
                    this.buoyMarkArr.push(buoy);
                    const popup = buoy.bindCustomPopup(str);
                    buoy.on("click", (ev) => {
                      popup.openPopup();
                    });
                  }
                })
                .then(() => {
                  this.buoyMarkerGroup = L.layerGroup(this.buoyMarkArr);
                  map.addLayer(this.buoyMarkerGroup);
                });
            });
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
            <img src="` +
        this.buoyImage +
        `"></img>
            <span>` +
        info.title +
        `</span>
          </div>
          <div class="info_content">
            <div class="info">
              <div>区站号:<span>` +
        this.getValue(info.content.areaNum) +
        `</span></div>
              <div>浮标类型:<span>` +
        this.getValue(info.content.type) +
        `</span></div>
              <div>日期:<span>` +
        this.getValue(info.day) +
        `</span></div>
              <div>时间:<span>` +
        this.getValue(info.time) +
        `</span></div>
              <div>位置:<span>` +
        info.lon +
        `N,` +
        info.lat +
        `E</span> </div>
              <div>风速:<span>` +
        this.getValue(info.content.windDirection) +
        `° ` +
        this.getValue(info.content.windSpeed) +
        `m/s</span>
              </div>
              <div>温度:<span>` +
        this.getValue(info.content.temperature) +
        `℃</span> </div>
              <div>湿度:<span>` +
        this.getValue(info.content.humidity) +
        `%</span></div>
              <div>气压:<span>` +
        this.getValue(info.content.pressure) +
        `hPa</span></div>
              
              <div>波浪周期:<span>` +
        this.getValue(info.content.wavePeriod) +
        `s</span></div>
              <div>波浪高度:<span>` +
        this.getValue(info.content.waveHeight) +
        `m</span></div>
              <div>波浪方向:<span>` +
        this.getValue(info.content.waveDirection) +
        `</span></div>
            </div>
          </div>
        </div>`
      );
    },
    getShipContent(info) {
      return (
        `<div id="info_box">
        <div class="info_title"><img src="` +
        this.shipImage +
        `"></img><span>` +
        info.name +
        `</span></div>
        <div class="info_content">
          <div class="info">
            <div>
              呼号:
              <span>` +
        info.callSign +
        `</span>
            </div>
            <div>
              日期:
              <span>` +
        info.day +
        `</span>
            </div>
            <div>
              时间:
              <span>` +
        info.time +
        `</span>
            </div>
            <div>
              位置:
              <span>` +
        info.lat +
        `N,` +
        info.lon +
        `E</span>
            </div>
            <div>
              浮标类型:
              <span>` +
        this.getValue(info.buoyName) +
        `</span>
            </div>
            <div>
              风向:
              <span>` +
        this.getValue(info.windDirection) +
        `°</span>
            </div>
            <div>
              风速:
              <span>` +
        this.getValue(info.windSpeed) +
        `m/s</span>
            </div>
            <div>
              温度:
              <span>` +
        this.getValue(info.temperature) +
        `℃</span>
            </div>
            <div>
              航向:
              <span>` +
        this.getValue(info.course) +
        `</span>
            </div>
            <div>
              航速:
              <span>` +
        this.getValue(info.speed) +
        `</span>
            </div>
            <div>
              海洋资料类型:
              <span>` +
        this.getValue(info.typeFlag) +
        `</span>
            </div>
            <div>
              数值一:
              <span>` +
        this.getValue(info.value1) +
        `</span>
            </div>
            <div>
              数值二:
              <span>` +
        this.getValue(info.value2) +
        `</span>
            </div>
          </div>
        </div>
      </div>`
      );
    },
    getOceanContent(info) {
      return (
        `<div id="info_box">
        <div class="info_title"><img src="` +
        this.oceanImage +
        `"></img><span>` +
        info.name +
        `</span></div>
        <div class="info_content">
          <div class="info">
            <div>
              日期:
              <span>` +
        info.day +
        `</span>
            </div>
            <div>
              时间:
              <span>` +
        info.time +
        `</span>
            </div>
            <div>
              位置:
              <span>` +
        info.lat +
        `N,` +
        info.lon +
        `E</span>
            </div>
            <div>
              低云高度:
              <span>` +
        this.getValue(info.lowCloudHeight) +
        `</span>
            </div>
            <div>
              风向:
              <span>` +
        this.getValue(info.windDirection) +
        `°</span>
            </div>
            <div>
              风速:
              <span>` +
        this.getValue(info.windSpeed) +
        " " +
        info.windUnit +
        `</span>
            </div>
            <div>
              温度:
              <span>` +
        this.getValue(info.temperature) +
        `℃</span>
            </div>
            <div>
              航向:
              <span>` +
        this.getValue(info.course) +
        `</span>
            </div>
            <div>
              航速:
              <span>` +
        this.getValue(info.speed) +
        `</span>
            </div>
            <div>
              能见度:
              <span>` +
        this.getValue(info.visibility) +
        `</span>
            </div>
            <div>
              海平面气压:
              <span>` +
        this.getValue(info.pressure) +
        `</span>
            </div>
          </div>
        </div>
      </div>`
      );
    },
    getGroundContent(info) {
      return (
        `<div id="info_box">
        <div class="info_title"><img src="` +
        this.groundImage +
        `"></img><span>` +
        info.name +
        `</span></div>
        <div class="info_content">
          <div class="info">
            <div>
              日期:
              <span>` +
        info.day +
        `</span>
            </div>
            <div>
              时间:
              <span>` +
        info.time +
        `</span>
            </div>
            <div>
              位置:
              <span>` +
        info.lat +
        `N,` +
        info.lon +
        `E</span>
            </div>
            <div>
              露点温度:
              <span>` +
        this.getValue(info.dewTemperature) +
        `°</span>
            </div>
            <div>
              温度:
              <span>` +
        this.getValue(info.temperature) +
        `°</span>
            </div>
            <div>
              风速:
              <span>` +
        this.getValue(info.windSpeed) +
        " " +
        info.windUnit +
        `</span>
            </div>
            <div>
              风向:
              <span>` +
        this.getValue(info.windDirection) +
        `°</span>
            </div>
            <div>
              降水:
              <span>` +
        this.getValue(info.precipitation) +
        `</span>
            </div>
            <div>
              能见度:
              <span>` +
        this.getValue(info.visibility) +
        `</span>
            </div>
            <div>
              气压:
              <span>` +
        this.getValue(info.pressure) +
        `hPa</span>
            </div>
            <div>
              海平面气压:
              <span>` +
        this.getValue(info.seaLevelPressure) +
        `hPa</span>
            </div>
          </div>
        </div>
      </div>`
      );
    },
    getShipInfo() {
      this.$get("/api/ship-live")
        .then((res) => {
          if (res.status == 200) {
            let data = res.data.data;
            let markerArr = [];
            data.forEach((item) => {
              let lat = item.lat;
              let lon = item.lon;
              this.$get("/api/ship-live/one-byId", {
                id: item.id,
              })
                .then((res) => {
                  if (res.status == 200) {
                    let station = res.data.data;
                    let day = this.$m(station.dayTime).format("YYYY-MM-DD");
                    let time =
                      this.$m(station.dayTime).format("HH") +
                      "时" +
                      this.$m(station.dayTime).format("mm") +
                      "分";
                    const image = getShipFillingValueImage({
                      tempreture: station.temperature,
                      time: this.$m(station.dayTime).format("HH:mm"),
                      dirwind: station.windDirection,
                      speedwind: station.windSpeed,
                    });
                    const fillIcon = new L.Icon({
                      iconUrl: image,
                      iconSize: [80, 80],
                      iconAnchor: [42, 64],
                      popupAnchor: [1, -34],
                      shadowSize: [41, 41],
                    });
                    let shipMarker = L.marker(L.latLng(lat, lon), {
                      icon: fillIcon,
                    }).addTo(map);
                    //点击地图上任意另一个点，锚点跟过去，当前坐标值跟着变换；
                    shipMarker.type = "ship";
                    shipMarker.callSign = item.callSign;
                    shipMarker.id = item.id;
                    this.shipMarkArr.push(shipMarker);
                    let str = this.getShipContent({
                      callSign: station.callSign,
                      name: "船舶站",
                      buoyName: station.buoyName,
                      lat: station.lat.toFixed(3),
                      lon: station.lon.toFixed(3),
                      dataUnit: station.dataUnit,
                      temperature: station.temperature,
                      windSpeed: station.windSpeed,
                      windDirection: station.windDirection,
                      course: station.course,
                      speed: station.speed,
                      typeFlag: station.typeFlag,
                      value1: station.value1,
                      value2: station.value2,
                      day: day,
                      time: time,
                    });
                    const popup = shipMarker.bindCustomPopup(str);
                    shipMarker.on("click", (ev) => {
                      popup.openPopup();
                    });
                  }
                })
                .then(() => {
                  this.shipMarkerGroup = L.layerGroup(this.shipMarkArr);
                  map.addLayer(this.shipMarkerGroup);
                });
            });
          }
        })

        .catch((error) => {
          this.$message.error("获取船舶站数据失败");
        });
    },
    getGroundInfo() {
      this.$get("/api/ground-live")
        .then((res) => {
          if (res.status == 200) {
            let data = res.data.data;
            let markerArr = [];
            data.forEach((item) => {
              if (item.latitude === null && item.longitude === null) {
                return;
              }
              let lat = item.latitude;
              let lon = item.longitude;
              let groundMarker = L.marker(L.latLng(lat, lon), {
                icon: this.groundIcon,
              }).addTo(map);
              //点击地图上任意另一个点，锚点跟过去，当前坐标值跟着变换；
              groundMarker.type = "ground";
              groundMarker.id = item.id;
              markerArr.push(groundMarker);
              groundMarker.on("click", (ev) => {
                this.$get("/api/ground-live/one-byId", {
                  id: ev.target.id,
                })
                  .then((res) => {
                    if (res.status == 200) {
                      let station = res.data.data;
                      let unit = null;
                      if (station.windUnit == 3 || station.windUnit == 4) {
                        unit = "nm/h";
                      } else {
                        unit = "m/s";
                      }
                      let day = this.$m(station.startTime).format("YYYY-MM-DD");
                      let time =
                        this.$m(station.startTime).format("HH") +
                        "时" +
                        this.$m(station.startTime).format("mm") +
                        "分";
                      let str = this.getGroundContent({
                        name: "地面站",
                        lat: station.latitude.toFixed(3),
                        lon: station.longitude.toFixed(3),
                        dewTemperature: station.dewTemperature,
                        temperature: station.temperature,
                        pressure: station.pressure,
                        windSpeed: station.windSpeed,
                        windDirection: station.windDirection,
                        precipitation: station.precipitation,
                        seaLevelPressure: station.seaLevelPressure,
                        visibility: station.visibility,
                        windUnit: unit,
                        pressure: station.pressure,
                        day: day,
                        time: time,
                      });
                      groundMarker.bindCustomPopup(str).openPopup();
                    }
                  })
                  .catch((error) => {
                    this.$message.error("获取站点数据失败");
                  });
              });
            });
            this.groundMarkerGroup = L.layerGroup(markerArr);
            map.addLayer(this.groundMarkerGroup);
          }
        })
        .catch((error) => {
          this.$message.error("获取地面站数据失败");
        });
    },
    getOceanInfo() {
      this.$get("/api/ocean-station-live")
        .then((res) => {
          if (res.status == 200) {
            let data = res.data.data;
            let markerArr = [];
            data.forEach((item) => {
              if (item.lat === null && item.lon === null) {
                return;
              }
              let lat = item.lat;
              let lon = item.lon;
              this.$get("/api/ocean-station-live/one-byId", {
                id: item.id,
              })
                .then((res) => {
                  if (res.status == 200) {
                    let station = res.data.data;
                    let unit = null;
                    if (station.windUnit == 3 || station.windUnit == 4) {
                      unit = "nm/h";
                    } else {
                      unit = "m/s";
                    }
                    let day = this.$m(station.dayTime).format("YYYY-MM-DD");
                    let time =
                      this.$m(station.dayTime).format("HH") +
                      "时" +
                      this.$m(station.dayTime).format("mm") +
                      "分";
                    let str = this.getOceanContent({
                      name: "海洋站",
                      lat: station.lat.toFixed(3),
                      lon: station.lon.toFixed(3),
                      lowCloudHeight: station.lowCloudHeight,
                      temperature: station.temperature,
                      windSpeed: station.windSpeed,
                      windDirection: station.windDirection,
                      course: station.course,
                      speed: station.speed,
                      visibility: station.visibility,
                      windUnit: unit,
                      pressure: station.pressure,
                      day: day,
                      time: time,
                    });
                    //点击地图上任意另一个点，锚点跟过去，当前坐标值跟着变换；
                    const image = getOceanFillingValueImage({
                      tempreture: station.temperature,
                      time: this.$m(station.dayTime).format("HH:mm"),
                      dirwind: station.windDirection,
                      speedwind: station.windSpeed,
                      visibility: station.visibility,
                    });
                    const fillIcon = new L.Icon({
                      iconUrl: image,
                      iconSize: [80, 80],
                      iconAnchor: [42, 64],
                      popupAnchor: [1, -34],
                      shadowSize: [41, 41],
                    });
                    let oceanMarker = L.marker(L.latLng(lat, lon), {
                      icon: fillIcon,
                    }).addTo(map);
                    oceanMarker.type = "ocean";
                    oceanMarker.id = item.id;
                    this.oceanMarkArr.push(oceanMarker);
                    const popup = oceanMarker.bindCustomPopup(str);
                    oceanMarker.on("click", (ev) => {
                      popup.openPopup();
                    });
                  }
                })
                .then(() => {
                  this.oceanMarkerGroup = L.layerGroup(this.oceanMarkArr);
                  map.addLayer(this.oceanMarkerGroup);
                })
                .catch((error) => {
                  this.$message.error("获取站点数据失败");
                });
            });
          }
        })
        .catch((error) => {
          this.$message.error("获取海洋站数据失败");
        });
    },
    // 清除站点数据
    removeAllLayer() {
      if (this.buoyMarkerGroup.length) {
        this.buoyMarkerGroup.clearLayers();
      }
      // 船舶站数组
      this.shipMarkArr = [];
      // 海洋填值
      this.oceanMarkArr = [];
      // 浮标填值
      this.buoyMarkArr = [];
      map.removeLayer(this.buoyMarkerGroup);
      map.removeLayer(this.shipMarkerGroup);
      map.removeLayer(this.oceanMarkerGroup);
      map.removeLayer(this.groundMarkerGroup);
    },
  },
};
</script>
<style lang="scss">
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
.custom-color-icon {
  color: #ff0000;
  font-weight: 700;
}
</style>
