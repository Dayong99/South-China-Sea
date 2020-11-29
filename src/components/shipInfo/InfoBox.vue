<template>
  <div></div>
</template>
<script>
export default {
  components: {
  },
  data() {
    return {
      shipId:'22107',
      shipImg:require("../../assets/images/ship1.png"),
      content:{
        temp:23
      }
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

    var locationMarker1 = L.marker([34,120], { icon: icon }).addTo(map);
    //点击地图上任意另一个点，锚点跟过去，当前坐标值跟着变换；
    locationMarker1.bindCustomPopup(this.getInfoContent);

  },
  methods: {
    getValue(val){
      if(val){
        return val
      }else{
        return '--'
      }
    },
    getInfoContent() {
      return `<div
      id="info_box">
      <div
        class="info_title"
      >
        <i class="el-icon-ship"></i>
        <span>`+this.shipId+`</span>
      </div>
      <div class="info_content">
        <div class="info">
          <div>
            位置:
            <span>126.8N,33.0E</span>
          </div>
          <div>
            温度:
            <span>`+this.getValue(this.content.temp)+`℃</span>
          </div>
          <div>
            海平面气压:
            <span>`+this.getValue()+`hPa</span>
          </div>
          <div>
            湿度:
            <span>`+this.getValue()+`%</span>
          </div>
          <div>
            风速:
            <span>`+this.getValue()+`° `+this.getValue()+`m/s</span>
          </div>
          <div>
            风浪风向:
            <span>`+this.getValue()+`度</span>
          </div>
          <div>
            风浪周期:
            <span>`+this.getValue()+`秒</span>
          </div>
          <div>
            风浪高度:
            <span>`+this.getValue()+`米</span>
          </div>
          <div>
            涌浪方向:
            <span>`+this.getValue()+`度</span>
          </div>
          <div>
            涌浪周期:
            <span>`+this.getValue()+`秒</span>
          </div>
          <div>
            涌浪高度:
            <span>`+this.getValue()+`米</span>
          </div>
        </div>
      </div>
    </div>`;
    },

  },
};
</script>
<style scoped>
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