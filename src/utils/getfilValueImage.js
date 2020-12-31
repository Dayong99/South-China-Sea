/* eslint-disable */
export function getShipFillingValueImage(fillingValue) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 80;
  canvas.height = 80;
  ctx.font = "12px";
  let firstParmsX =
    10 * Math.sin(((360 / 5) * 4 * Math.PI) / 180).toFixed(1);
  let firstParmsY =
    10 * Math.cos(((360 / 5) * 4 * Math.PI) / 180).toFixed(1);
  let secondParmsX = 10 * Math.sin(((360 / 5) * Math.PI) / 180).toFixed(1);
  let secondParmsY = 10 * Math.cos(((360 / 5) * Math.PI) / 180).toFixed(1);

  let temp = '//'
  if (fillingValue.tempreture) {
    temp = fillingValue.tempreture
  }
  /* 气温 */
  ctx.fillStyle = "#e9305b";
  ctx.font = "12px Arial";
  ctx.fillText(
    temp,
    canvas.width / 2 + firstParmsX - 20,
    canvas.height / 2 + firstParmsY + 2
  );
  /* 时间 */
  ctx.fillStyle = "#4c44f1";
  ctx.fillText(
    "" + fillingValue.time,
    canvas.width / 2 + secondParmsX - 25,
    canvas.height / 2 + secondParmsY - 15
  );
  /* 气压 */
  ctx.fillStyle = "#008000";
  ctx.fillText(
    '//',
    canvas.width / 2 + secondParmsX + 5,
    canvas.height / 2 + secondParmsY
  );
  // 绘制风羽
  drawWind(ctx, fillingValue, 80, 80)
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, 2, 0, Math.PI * 2, false);
  ctx.fillStyle = "#FC1C1C"; //填充颜色,默认是黑色
  ctx.fill(); //画实心圆
  ctx.beginPath();
  ctx.strokeStyle = "#222";
  ctx.lineWidth = 0.5
  ctx.arc(canvas.width / 2, canvas.height / 2, 3.5, 0, Math.PI * 2, false);
  ctx.stroke()

  return canvas.toDataURL();
}

export function getOceanFillingValueImage(fillingValue) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 80;
  canvas.height = 80;
  ctx.font = "12px";
  let firstParmsX =
    10 * Math.sin(((360 / 5) * 4 * Math.PI) / 180).toFixed(1);
  let firstParmsY =
    10 * Math.cos(((360 / 5) * 4 * Math.PI) / 180).toFixed(1);
  let temp = '//'
  if (fillingValue.tempreture) {
    temp = fillingValue.tempreture
  }
  /* 气温 */
  ctx.fillStyle = "#e9305b";
  ctx.font = "12px Arial";
  ctx.fillText(
    temp,
    canvas.width / 2 + firstParmsX - 25,
    canvas.height / 2 + firstParmsY + 2
  );
  let time = '//'
  if (fillingValue.time) {
    time = fillingValue.time
  }
  /* 时间 */
  ctx.fillStyle = "#4c44f1";
  ctx.fillText(
    time,
    canvas.width / 2 + firstParmsX - 5,
    canvas.height / 2 + firstParmsY - 15
  );
  let visibility = '//'
  if (fillingValue.visibility) {
    visibility = fillingValue.visibility
  }
  /* 能见度 */
  ctx.fillStyle = "#4c44f1";
  ctx.fillText(
    visibility,
    canvas.width / 2 + firstParmsX - 25,
    canvas.height / 2 + firstParmsY + 15
  );
  // 水温
  ctx.fillStyle = "#4c44f1";
  ctx.fillText(
    '//',
    canvas.width / 2 + firstParmsX - 25,
    canvas.height / 2 + firstParmsY + 30
  );
  // 气压
  ctx.fillStyle = "#4c44f1";
  ctx.fillText(
    '//',
    canvas.width / 2 + firstParmsX + 25,
    canvas.height / 2 + firstParmsY + 5
  );
  // 浪高
  ctx.fillStyle = "#4c44f1";
  ctx.fillText(
    '//',
    canvas.width / 2 + firstParmsX + 25,
    canvas.height / 2 + firstParmsY + 15
  );
  // 周期
  ctx.fillStyle = "#4c44f1";
  ctx.fillText(
    '//',
    canvas.width / 2 + firstParmsX + 5,
    canvas.height / 2 + firstParmsY + 15
  );
  // 绘制风羽
  drawWind(ctx, fillingValue, 80, 80)
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, 2, 0, Math.PI * 2, false);
  ctx.fillStyle = "#FC1C1C"; //填充颜色,默认是黑色
  ctx.fill(); //画实心圆
  ctx.beginPath();
  ctx.strokeStyle = "#222";
  ctx.lineWidth = 0.5
  ctx.arc(canvas.width / 2, canvas.height / 2, 3.5, 0, Math.PI * 2, false);
  ctx.stroke()

  return canvas.toDataURL();
}

export function getBuoyFillingValueImage(fillingValue) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 80;
  canvas.height = 80;
  ctx.font = "12px";
  let firstParmsX =
    10 * Math.sin(((360 / 5) * 4 * Math.PI) / 180).toFixed(1);
  let firstParmsY =
    10 * Math.cos(((360 / 5) * 4 * Math.PI) / 180).toFixed(1);
  let temp = '//'
  if (fillingValue.tempreture) {
    temp = fillingValue.tempreture
  }
  /* 气温 */
  ctx.fillStyle = "#e9305b";
  ctx.font = "12px Arial";
  ctx.fillText(
    temp,
    canvas.width / 2 + firstParmsX - 25,
    canvas.height / 2 + firstParmsY - 5
  );
  let time = '//'
  if (fillingValue.time) {
    time = fillingValue.time
  }
  /* 时间 */
  ctx.fillStyle = "#4c44f1";
  ctx.fillText(
    time,
    canvas.width / 2 + firstParmsX - 5,
    canvas.height / 2 + firstParmsY - 15
  );
  /* 能见度 */
  ctx.fillStyle = "#4c44f1";
  ctx.fillText(
    '//',
    canvas.width / 2 + firstParmsX - 25,
    canvas.height / 2 + firstParmsY + 8
  );
  let salinity = '//'
  if (fillingValue.salinity) {
    salinity = fillingValue.salinity
  }
  /* 相对湿度 */
  ctx.fillStyle = "#4c44f1";
  ctx.fillText(
    salinity,
    canvas.width / 2 + firstParmsX - 25,
    canvas.height / 2 + firstParmsY + 20
  );
  // 水温
  ctx.fillStyle = "#4c44f1";
  ctx.fillText(
    '//',
    canvas.width / 2 + firstParmsX - 25,
    canvas.height / 2 + firstParmsY + 30
  );
  // 气压
  ctx.fillStyle = "#4c44f1";
  ctx.fillText(
    '//',
    canvas.width / 2 + firstParmsX + 25,
    canvas.height / 2 + firstParmsY + 5
  );
  let waveHeight = '//'
  if (fillingValue.waveHeight) {
    waveHeight = fillingValue.waveHeight
  }
  // 波高
  ctx.fillStyle = "#4c44f1";
  ctx.fillText(
    waveHeight,
    canvas.width / 2 + firstParmsX + 25,
    canvas.height / 2 + firstParmsY + 15
  );
  let wavePeriod = '//'
  if (fillingValue.wavePeriod) {
    wavePeriod = fillingValue.wavePeriod
  }
  // 周期
  ctx.fillStyle = "#4c44f1";
  ctx.fillText(
    wavePeriod,
    canvas.width / 2 + firstParmsX,
    canvas.height / 2 + firstParmsY + 15
  );
  // 绘制风羽
  drawWind(ctx, fillingValue, 80, 80)
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, 2, 0, Math.PI * 2, false);
  ctx.fillStyle = "#FC1C1C"; //填充颜色,默认是黑色
  ctx.fill(); //画实心圆
  ctx.beginPath();
  ctx.strokeStyle = "#222";
  ctx.lineWidth = 0.5
  ctx.arc(canvas.width / 2, canvas.height / 2, 3.5, 0, Math.PI * 2, false);
  ctx.stroke()

  return canvas.toDataURL();
}

function drawWind(ctx, windObj, width, height) {
  let startPoint = {
    x: width / 2,
    y: height / 2
  }
  // console.time('drawWind');
  let len = 24 // 风向线长度 16
  let r = 4 // 风力线长度 4
  let arc = Math.PI / 180 * (windObj.dirwind - 180) // 旋转角
  let a = startPoint.x
  let b = startPoint.y
  let x0 = a
  let y0 = b - len // 长边点(x0, y0)
  // 计算第三个点  短边点
  let endPoint = {
    x: a + (x0 - a) * Math.cos(arc) - (y0 - b) * Math.sin(arc),
    y: b + (x0 - a) * Math.sin(arc) + (y0 - b) * Math.cos(arc)
  }
  // let level = getLevel(12) // 根据风速设置风级   横杠个数
  let level = getLevel(windObj.speedwind) // 根据风速设置风级   横杠个数
  let floorLevel = Math.floor(level / 8)
  let color = '#000000'

  let count8 = floorLevel // 8级个数  三角代表8级
  let count2 = Math.floor(level % 8 / 2) // 2级个数
  let count1 = level % 2 === 0 ? 0 : 1 // 1级个数
  let count = 6 // 等分点个数

  ctx.save()
  ctx.beginPath()
  ctx.strokeStyle = color
  if (count8 === 0 && count2 === 0 && count1 === 0) {
    ctx.arc(startPoint.x, startPoint.y, r, 0, Math.PI * 2)
  } else {
    ctx.moveTo(startPoint.x, startPoint.y)
    ctx.lineTo(endPoint.x, endPoint.y)
    // 8 级
    for (let i = 0; i < count8; i++) {
      const sp = getChunkPoint(startPoint, endPoint, count, 2 * i + 1)
      const sp2 = getChunkPoint(startPoint, endPoint, count, 2 * i + 1 + 2)
      const lp = getPointByDistance(startPoint, sp, r * 2)
      let point = []
      point.x = sp.x + (lp.x - sp.x) * Math.cos(Math.PI / 180 * -30) - (lp.y - sp.y) * Math.sin(Math.PI / 180 * -30)
      point.y = sp.y + (lp.x - sp.x) * Math.sin(Math.PI / 180 * -30) + (lp.y - sp.y) * Math.cos(Math.PI / 180 * -30)
      ctx.moveTo(sp.x, sp.y)
      //   ctx.lineTo(lp.x, lp.y)
      ctx.lineTo(point.x, point.y)
      ctx.lineTo(sp2.x, sp2.y)
    }
    // 2级
    for (let i = 0; i < count2; i++) {
      const sp = getChunkPoint(startPoint, endPoint, count, 2 * count8 + 1 + i)
      const lp = getPointByDistance(startPoint, sp, r * 2)
      let point = []
      point.x = sp.x + (lp.x - sp.x) * Math.cos(Math.PI / 180 * -30) - (lp.y - sp.y) * Math.sin(Math.PI / 180 * -30)
      point.y = sp.y + (lp.x - sp.x) * Math.sin(Math.PI / 180 * -30) + (lp.y - sp.y) * Math.cos(Math.PI / 180 * -30)
      ctx.moveTo(sp.x, sp.y)
      //   ctx.lineTo(lp.x, lp.y)
      ctx.lineTo(point.x, point.y)
    }
    // 1级
    for (let i = 0; i < count1; i++) {
      const sp = getChunkPoint(startPoint, endPoint, count, 2 * count8 + 1 + count2 + i)
      const lp = getPointByDistance(startPoint, sp, r)
      let point = []
      point.x = sp.x + (lp.x - sp.x) * Math.cos(Math.PI / 180 * -30) - (lp.y - sp.y) * Math.sin(Math.PI / 180 * -30)
      point.y = sp.y + (lp.x - sp.x) * Math.sin(Math.PI / 180 * -30) + (lp.y - sp.y) * Math.cos(Math.PI / 180 * -30)
      ctx.moveTo(sp.x, sp.y)
      //   ctx.lineTo(lp.x, lp.y)
      ctx.lineTo(point.x, point.y)
    }
  }
  ctx.closePath()
  ctx.stroke()
  // ctx.restore()
  // console.timeEnd('drawWind');
}
// 取一条线的 count 等分点的第number(1,2,3...)个点，从endPoint开始计数。
function getChunkPoint(startPoint, endPoint, count, number) {
  let points = []
  let xn, yn
  points.push(startPoint)
  for (let i = 1; i < count; i++) {
    xn = startPoint.x + i * (endPoint.x - startPoint.x) / count
    yn = startPoint.y + i * (endPoint.y - startPoint.y) / count
    const point = []
    point.x = xn
    point.y = yn
    points.push(point)
  }
  points.push(endPoint)
  points = points.reverse()
  return points[number - 1]
}

function getPointByDistance(sp, ep, r) {
  let x, y
  let point = []
  let k = (ep.y - sp.y) / (ep.x - sp.x)
  let r2 = Math.pow(r, 2)
  let k2 = Math.pow(k, 2)
  // 不同坐标系符号问题
  if (ep.x > sp.x) {
    if (ep.y < sp.y) {
      x = ep.x + Math.sqrt((r2 * k2) / (1 + k2))
      y = ep.y + Math.sqrt(r2 / (1 + k2))
    } else {
      x = ep.x - Math.sqrt((r2 * k2) / (1 + k2))
      y = ep.y + Math.sqrt(r2 / (1 + k2))
    }
  } else if (ep.x < sp.x) {
    if (ep.y > sp.y) {
      x = ep.x - Math.sqrt((r2 * k2) / (1 + k2))
      y = ep.y - Math.sqrt(r2 / (1 + k2))
    } else {
      x = ep.x + Math.sqrt((r2 * k2) / (1 + k2))
      y = ep.y - Math.sqrt(r2 / (1 + k2))
    }
  } else {
    if (ep.y > sp.y) {
      x = ep.x - r
      y = ep.y
    } else {
      x = ep.x + r
      y = ep.y
    }
  }
  point.x = x
  point.y = y
  return point
}
// 风级
function getLevel(speed) {
  let level = 0
  if (speed <= 0.2) {
    level = 0
  } else if (speed > 0.2 && speed <= 1.5) {
    level = 1
  } else if (speed > 1.5 && speed <= 3.3) {
    level = 2
  } else if (speed > 3.3 && speed <= 5.4) {
    level = 3
  } else if (speed > 5.4 && speed <= 7.9) {
    level = 4
  } else if (speed > 7.9 && speed <= 10.7) {
    level = 5
  } else if (speed > 10.7 && speed <= 13.8) {
    level = 6
  } else if (speed > 13.8 && speed <= 17.1) {
    level = 7
  } else if (speed > 17.1 && speed <= 20.7) {
    level = 8
  } else if (speed > 20.7 && speed <= 24.4) {
    level = 9
  } else if (speed > 24.4 && speed <= 28.4) {
    level = 10
  } else if (speed > 28.4 && speed <= 32.6) {
    level = 11
  } else if (speed > 32.6 && speed <= 36.9) {
    level = 12
  } else if (speed > 36.9 && speed <= 41.4) {
    level = 13
  } else if (speed > 41.4 && speed <= 46.1) {
    level = 14
  } else if (speed > 46.1 && speed <= 50.9) {
    level = 15
  } else if (speed > 50.9 && speed <= 56.0) {
    level = 16
  } else if (speed > 56.0) {
    level = 17
  }
  return level
}