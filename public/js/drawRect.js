// import GIF from './gif.js'
var drawX, drawY;
var arr = [];
var timer = undefined;
var flag = false;
var type; //区分截图还是录制gif
// 绘制框图
function drawRect(canvasId) {
  console.log("截图-------------")
  const that = this
  window.onresize = function () {
    clearInterval(timer)
    endShot(["#backCanvas", "#canvasResult", '#result']);
    document.getElementById("screenShot").style.background = "";
  }

  // 绘制底布canvas
  $("#backCanvas").remove();
  let backCanvas = document.createElement("canvas");
  backCanvas.id = "backCanvas";
  $("#app").append(backCanvas);
  let screenWidth = document.body.clientWidth - 4;
  let screenHeight = document.body.clientHeight - 4;
  backCanvas.width = screenWidth;
  backCanvas.height = screenHeight;


  // 截屏canvas
  var canvas = document.getElementById(canvasId);

  var layerName = "layer";
  var layer = 0;
  var startX = 0;
  var startY = 0;
  var isShot = false;
  var width, height
  //设置画笔颜色和宽度
  var color = "#2674FD";
  var penWidth = 2;
  var css = '<style>#result {position: fixed;z-index: 20000;cursor: pointer;}#result button {cursor:pointer;padding: 3px 13px;outline:none;border-radius: 12px;margin-right: 5px;font-size: 12px;display: inline-block;border: 0px;}</style>';
  $('head').append(css);

  //鼠标点击按下事件，画图准备
  canvas.onmousedown = function (e) {
    console.log(e);
    $('#result').remove();
    $("#" + canvasId).removeLayer(layerName);
    isShot = true;

    layerName = 'layer' + layer

    startX = e.clientX;
    startY = e.clientY;
    $("#" + canvasId).addLayer({
      type: 'rectangle',
      strokeStyle: color,
      strokeWidth: penWidth,
      name: layerName,
      fromCenter: false,
      x: startX,
      y: startY,
      width: 1,
      height: 1
    });

    $("#" + canvasId).drawLayers();
    $("#" + canvasId).saveCanvas();
    //鼠标移动事件，画图
    canvas.onmousemove = function (e) {
      if (isShot) {

        width = e.clientX - startX;
        height = e.clientY - startY;

        $("#" + canvasId).removeLayer(layerName);

        $("#" + canvasId).addLayer({
          type: 'rectangle',
          strokeStyle: color,
          strokeWidth: penWidth,
          name: layerName,
          fromCenter: false,
          x: startX,
          y: startY,
          width: width,
          height: height
        });

        $("#" + canvasId).drawLayers();
      }

    }
  };

  canvas.onmouseup = function (e) {
    isShot = false;
    // 添加截图和取消按钮
    $('body').append('<div id="result"><button class="screenShot" style="background: #2674FD;color: #fff;">截图</button></div>')
    // 添加取消截屏按钮
    $("#result").append("<button class='screenGif' style='background: #2674FD;color: #fff;'>录制gif</button>");
    $("#result").append("<button class='certainShot' style='background: #ffffff;color: #000;border:1px solid #2674FD;'>确定</button>");
    $("#result").append("<button class='cancleShot' style='background: #ffffff;color: #000;border:1px solid #2674FD;'>取 消</button>");

    $('#result').css({
      'top': e.clientY - startY < 0 ? e.clientY - 25 : startY - 25,
      'left': e.clientX - startX < 0 ? startX - 230 : e.clientX - 230,
      'display': e.clientY - startY == 0 ? 'none' : 'block'
    });

    canvas.onmousemove = null;


    width = e.clientX - startX;
    height = e.clientY - startY;

    $("#" + canvasId).removeLayer(layerName);

    $("#" + canvasId).addLayer({
      type: 'rectangle',
      strokeStyle: color,
      strokeWidth: penWidth,
      name: layerName,
      fromCenter: false,
      x: startX,
      y: startY,
      width: width,
      height: height
    });


    $("#" + canvasId).drawLayers();
    $("#" + canvasId).saveCanvas();

    console.log($("#" + canvasId), "==============");

    // canvas.onmousedown = null;
    // canvas.onmouseup = null;

    // 截图
    $('.screenShot').click(function () {
      type="shot"
      drawX = e.clientX - startX > 0 ? startX : e.clientX;
      drawY = e.clientY - startY > 0 ? startY : e.clientY

      // let timeStart = startIndex;
      // let timeEnd = endIndex;
      drawImg(drawX, drawY, width, height)
    })

    //录制gif
    $('.screenGif').click(function () {
      type="gif"
      canvas.onmousedown = null;
      canvas.onmouseup = null;
      arr = []
      drawX = e.clientX - startX > 0 ? startX : e.clientX;
      drawY = e.clientY - startY > 0 ? startY : e.clientY
      drawImg(drawX, drawY, width, height)

      timer = setInterval(draw, 500)

    })

    //点击确定时，将截取的多张图片合成为gif并下载
    $('.certainShot').click(function () {
      if(type=="gif"){
        clearInterval(timer)
        console.log(arr);
        var gif = new GIF({
          workers: 2,
          quality: 10,
          workerScript: 'js/gif.worker.js',
        });
  
        //使用canvas进行合成，gif合成可以使用canvas，也可以使用img
        // let gCanvas = document.createElement("canvas");
        // let gCtx = gCanvas.getContext('2d');
        // gCanvas.width = width;
        // gCanvas.height = height;
  
        gif.on('finished', blob => { //生成新GIF
          // let url = URL.createObjectURL(blob)
          blobToBase64(blob).then(res => {
            // console.log(res);
            handleDownload(res)
            endShot(["#backCanvas", "#canvasResult", '#result']);
            document.getElementById("screenShot").style.background = "";
          })
        })
  
        let i = 0
  
        arr.forEach((item) => {
          let img = new Image()
          img.src = item
          img.onload = () => {
            // gCtx.clearRect(0, 0, width, height) //清除画布（避免影响下一帧）
            // gCtx.drawImage(img, 0, 0, width, height); //GIF帧
            // gif.addFrame(gCanvas, {
            //   copy: true,
            //   delay: 250
            // }) //canvas生成帧
            gif.addFrame(img, {
              copy: true,
              delay: 500
            })
            if (++i >= arr.length) { //已添加所有帧
              gif.render()
            }
          }
        })
      }
    })

    function draw() {
      if (flag) {
        flag = false
        drawX = e.clientX - startX > 0 ? startX : e.clientX;
        drawY = e.clientY - startY > 0 ? startY : e.clientY;
        drawImg(drawX, drawY, width, height)
      }
    }


    // 取消截图
    $('.cancleShot').click(function () {
      //清除定时器
      clearInterval(timer)
      endShot(["#backCanvas", "#canvasResult", '#result']);
      document.getElementById("screenShot").style.background = "";
    })


  }
}


// 绘制图片
async function drawImg(drawX, drawY, width, height) {
  await html2canvas(document.getElementById("earthContainer"), {
    backgroundColor: null, //画出来的图片有白色的边框,不要可设置背景为透明色（null）
    useCORS: true, //支持图片跨域
    scale: 1, //设置放大的倍数
  }).then((canvas) => {
    $('#canvasResult').remove()
    $('body').append('<canvas id="canvasResult" width=' + width + ' height=' + height + ' style="display:none"></canvas>');
    let canvasResult = document.getElementById('canvasResult');
    let ctx = canvasResult.getContext("2d");
    ctx.save();

    let animatedImage = new Image();
    animatedImage.src = canvas.toDataURL("image/jpeg");
    ctx.fillRect(0, 0, width, height);
    let dataURL
    if (animatedImage.complete) {
      // 如果图片已经存在于浏览器缓存，直接调用回调函数
      // ctx.drawImage(
      //   animatedImage,
      //   drawX,
      //   drawY,
      //   width,
      //   height,
      //   0,
      //   0,
      //   width,
      //   height
      // );
      // dataURL = canvasResult.toDataURL("image/jpeg");
      // console.log(dataURL, "1111111111111111111");
      // // handleDownload(dataURL); // 将单个截图存入录制数组中
      // arr.push(dataURL)
      flag = true
      return; // 直接返回，不用再处理onload事件
    }
    animatedImage.onload = function () {
      ctx.drawImage(
        animatedImage,
        drawX,
        drawY,
        width,
        height,
        0,
        0,
        width,
        height
      );
      dataURL = canvasResult.toDataURL("image/jpeg");
      //截图
      if (type == "shot") {
        handleDownload(dataURL)
        endShot(["#backCanvas", "#canvasResult", '#result']);
        document.getElementById("screenShot").style.background = "";
      } else if (type == "gif") {
        arr.push(dataURL)
      }
      flag = true
      // console.log(dataURL, "222222222222");
    };
  });
}


//下载图片
function handleDownload(base64) {
  // 这里是获取到的图片base64编码,这里只是个例子哈，要自行编码图片替换这里才能测试看到效果
  const imgUrl = `${base64}`
  // 如果浏览器支持msSaveOrOpenBlob方法（也就是使用IE浏览器的时候），那么调用该方法去下载图片
  if (window.navigator.msSaveOrOpenBlob) {
    const bstr = atob(imgUrl.split(',')[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    const blob = new Blob([u8arr])
    window.navigator.msSaveOrOpenBlob(blob, 'chart-download' + '.' + 'png')
  } else {
    // 这里就按照chrome等新版浏览器来处理
    const a = document.createElement('a')
    a.href = imgUrl
    a.setAttribute('download', 'screen-shot')
    a.click()
  }
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      resolve(e.target.result);
    };
    // readAsDataURL
    fileReader.readAsDataURL(blob);
    fileReader.onerror = () => {
      reject(new Error('blobToBase64 error'));
    };
  });
}

// 结束截图
function endShot(resetObj) {
  if (resetObj) {
    if (Array.isArray(resetObj)) {
      resetObj.forEach(function (item) {
        $(item).remove();
      })
    } else {
      console.error('resetObj must be a Array');
    }
  }
  $('body').css('cursor', 'default');
  // document.getElementById('cut').style.color =  'white'

}

// export {
//   drawRect
// }