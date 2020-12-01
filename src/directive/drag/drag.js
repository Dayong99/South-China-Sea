export default function drag(el) {
    let dragBox = el; //获取当前元素
    dragBox.onmousedown = e => {
        //算出鼠标相对元素的位置
        let disX = e.clientX - dragBox.offsetLeft;
        let disY = e.clientY - dragBox.offsetTop;
        let screenWidth =  document.body.clientWidth;
        let screenHeight =  document.body.clientHeight;
        document.onmousemove = e => {
            //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
            let left = e.clientX - disX;
            let top = e.clientY - disY;
            // console.log('right:'+dragBox.style.right)
            if(left<0){
                left=0
            }else if(left>(screenWidth-dragBox.offsetWidth)){
                left = screenWidth-dragBox.offsetWidth
            }
            if(top<0){
                top=0
            }else if(top>(screenHeight-dragBox.offsetHeight-36)){
                top = screenHeight-dragBox.offsetHeight-36
            }
            //移动当前元素
            dragBox.style.left = left + "px";
            dragBox.style.top = top + "px";
        };
        document.onmouseup = e => {
            //鼠标弹起来的时候不再移动
            document.onmousemove = null;
            //预防鼠标弹起来后还会循环（即预防鼠标放上去的时候还会移动）
            document.onmouseup = null;
        };
    };
}
