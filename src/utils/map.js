import "leaflet/dist/leaflet.css"
import $L, { latLng } from "leaflet";

// 创建图标
const createIcon = options => {
  return $L.icon(options)
}
const createDivIcon = options => {
  return $L.divIcon(options)
}

/**
 * 通过经纬度创建点
 *
 * @param {window.map} map
 * @param {纬度、经度} latlngs
 * @param {参数} options
 * @return {*} 
 */
const createMarkerByLatlng = (map, latlngs, options) => {
  let mark = $L.marker($L.latLng(latlngs[0], latlngs[1]), options)
  mark.addTo(map)
  return mark
}

/**
 * 通过经纬度数组绘制线
 *
 * @param {window.map} map
 * @param {纬度、经度数组} latlngs
 * @param {参数} options
 * @return {*} 
 */
const createPolyline = (map, latlngs, options) => {
  let polyline = $L.polyline(latlngs, options)
  polyline.addTo(map)
  return polyline
}





export default {createIcon, createDivIcon, createMarkerByLatlng, createPolyline}