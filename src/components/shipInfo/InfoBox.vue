<template>
  <div></div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
export default {
  components: {},
  data() {
    return {
      shipId: "22107",
      shipImg: require("../../assets/images/ship1.png"),
      buoyImg: require("../../assets/images/buoy.png"),
      content: {
        temp: 23,
      },

      // 浮标
      buoyList: [],
      markerGroup: [],
    };
  },
  mounted() {
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
    var icon = new L.Icon({
      iconUrl: this.shipImg,
      iconSize: [30, 30],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
    var locationMarker = L.marker(map.getCenter(), { icon: icon }).addTo(map);
    //点击地图上任意另一个点，锚点跟过去，当前坐标值跟着变换；
    locationMarker.bindCustomPopup(this.getInfoContent);

    var locationMarker1 = L.marker([34, 120], { icon: icon }).addTo(map);
    //点击地图上任意另一个点，锚点跟过去，当前坐标值跟着变换；
    locationMarker1.bindCustomPopup(this.getInfoContent);
  },
  computed: {
    ...mapState({
      realTimeValue: (state) => state.sideBar.realTimeValue,
    }),
  },
  watch: {
    realTimeValue(newval) {
      map.removeLayer(this.markerGroup);

      if (newval === "ground") {
        this.shipId = "ground";
        // var icon = new L.Icon({
        //   iconUrl: this.shipImg,
        //   iconSize: [30, 30],
        //   iconAnchor: [12, 41],
        //   popupAnchor: [1, -34],
        //   shadowSize: [41, 41],
        // });
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
      } else if (newval === "buoy") {
        this.$get("/api/ocean-buoys-live").then((r) => {
          // this.$get("/api/ship-live").then((r) => {
          console.log(r.data);
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
              let buoy = L.marker([item.lat,item.lon], {
                icon: icon,
              });
              markerArr.push(buoy);

              // buoy.id = this.shipId;
              //点击地图上任意另一个点，锚点跟过去，当前坐标值跟着变换；
              // buoy.bindCustomPopup(this.getInfoContent(item.callSign));
              buoy.on("click", (ev) => {
                this.$get("/api/ocean-buoys-live/one", {
                  areaNum:item.areaNum ,
                  localDate:this.$m(new Date()).format('YYYY-MM-DD')
                }).then((r) => {
                  if (r.status == 200) {
                    let str = this.getBuoyContent({title:item.areaNum,content:r.data.data,lon:item.lon,lat:item.lat})
                    buoy.bindCustomPopup(str);
                  }
                });
              });
            });
            this.markerGroup = L.layerGroup(markerArr);
            map.addLayer(this.markerGroup);
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
        `<div
      id="info_box">
      <div
        class="info_title"
      >

        <span>浮标` +
        info.title +
        `</span>
      </div>
      <div class="info_content">
        <div class="info">
          <div>
            位置:
            <span>`+info.lon+`N,`+info.lat+`E</span>
          </div>
          <div>
            温度:
            <span>` +
        this.getValue(info.content.temperature) +
        `℃</span>
          </div>
          <div>
            海平面气压:
            <span>` +
        this.getValue(info.content.pressure) +
        `hPa</span>
          </div>
          <div>
            湿度:
            <span>` +
        this.getValue(info.content.humidity) +
        `%</span>
          </div>
          <div>
            风速:
            <span>` +
        this.getValue(info.content.windDirection) +
        `° ` +
        this.getValue(info.content.windSpeed) +
        `m/s</span>
          </div>
            风浪周期:
            <span>` +
        this.getValue(info.content.wavePeriodFlag1) +
        `秒</span>
          </div>
          <div>
            风浪高度:
            <span>` +
        this.getValue(info.content.waveHeightFlag1) +
        `米</span>
          </div>
          <div>
            涌浪周期:
            <span>` +
        this.getValue(info.content.wavePeriodFlag20) +
        `秒</span>
          </div>
          <div>
            涌浪高度:
            <span>` +
        this.getValue(info.content.waveHeightFlag21) +
        `米</span>
          </div>
        </div>
      </div>
    </div>`
      );
    },
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