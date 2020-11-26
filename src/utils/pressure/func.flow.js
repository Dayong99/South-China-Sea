import { ParseData } from './tool.parseData'
import { FlowLayer } from './ocean.weather.flow'

export class FuncFlow {

  constructor(map) {
    this._map = map;
  }

  start() {
    var url = './static/data/flow.csv';
    ParseData(url, null ,function (results) {
      this.getDataCallback(results);
    }, this);
  }

  stop　() {
    if(this._map.hasLayer(this._layer)) {
      this._map.removeLayer(this._layer);
    }
  }

  getDataCallback (results) {
    console.log('object');
    var datas = results.data;
    datas.shift();
    var config = {
      lat: '0',
      lng: '1',
      value: '2',
      dir: '3',
      data: datas
    };
    if(this._map.hasLayer(this._layer)) {
      this._map.removeLayer(this._layer);
    }
    this._layer = new FlowLayer({}, config);
    this._map.addLayer(this._layer);
  }
}
