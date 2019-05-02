//点击开始游戏 -》 动态生成100个小格--》100div
//leftClick  没有雷  --》显示数字（代表以当前小格为中心周围8个格的雷数） 扩散（当前周围八个格没有雷）
//           有累 --》game Over
//rightClick 没有标记并且没有数字--》进行标记。 有标记 --》取消标记 --》标记是否正确，10个都正确标记，提示成功
//已经出现数字--》无效果
/**
 * core: 
 * 1.左点击，判断是否点击到雷 ? 游戏结束 : 显示周围的雷数
 * 周围雷数为0 ? 扩散 : 不扩散
 * 2.右点击，判断是否点击到雷 ? 剩余雷数-1 : null
 */


var startBtn = document.getElementById('btn');
var box = document.getElementById('box');
var flagBox = document.getElementById('flagBox');
var alertBox = document.getElementById('alertBox');
var alertImg = document.getElementById('alertImg');
var closeBtn = document.getElementById('close');
var score = document.getElementById('score');
var div1 = document.getElementsByClassName('div1')[0];
var div2 = document.getElementsByClassName('div2')[0];
var div3 = document.getElementsByClassName('div3')[0];
var oTxt = document.getElementsByTagName('input')[0];
var square = 100;
var minesNum = 20;
var mineOver =20;
var row = 10;//行
var col = 10;//列
var block;
var mineMap = []; // 存放雷
var startGameBool = true;
var div1Bool = true;
var div2Bool = true;
var div3Bool = true;
var timer = null,
    n = 0;

bindEvent();
function bindEvent() {
    div1.onclick = function(){
        if(div1Bool){
            minesNum = 20;
            mineOver =20;
            row = 10;//行
            col = 10;//列
            square = 100;
            // div1Bool = false;
            // alert('1');
            box.style.width = '500px';
            box.style.height = '500px';
            div1.style.backgroundColor = 'red';
            div2.style.backgroundColor = '';
            div3.style.backgroundColor = '';
            // console.log(minesNum + '|' + mineOver + '|' + row + '|' + col + '|' + box.style.width + '|' + box.style.height);
        }
    }
    div2.onclick = function(){
        if(div2Bool){
            minesNum = 30;
            mineOver =30;
            row = 12;//行
            col = 12;//列
            square = 144;
            // div2Bool = false;
            box.style.width = '600px';
            box.style.height = '600px';
            div2.style.backgroundColor = 'red';
            div1.style.backgroundColor = '';
            div3.style.backgroundColor = '';
            // alert('2');
            // console.log(minesNum + '|' + mineOver + '|' + row + '|' + col + '|' + box.style.width + '|' + box.style.height);
        }
    }
    div3.onclick = function(){
        if(div3Bool){
            minesNum = 40;
            mineOver =40;
            row = 14;//行
            col = 14;//列 
            square = 196;
            // div3Bool = false;
            box.style.width = '700px';
            box.style.height = '700px';
            box.style.top = '200px';
            div3.style.backgroundColor = 'red';
            div1.style.backgroundColor = '';
            div2.style.backgroundColor = '';
            // console.log(minesNum + '|' + mineOver + '|' + row + '|' + col + '|' + box.style.width + '|' + box.style.height);
            // alert('3');
        }
    }
    startBtn.onclick = function () {
        n = 0;
        if(startGameBool){
            if(minesNum == 20){
                div1.style.backgroundColor = 'red';
            }
            box.style.display = 'block';
            flagBox.style.display = 'block';
            init();
            startGameBool = false;
            div1Bool = false;
            div2Bool = false;
            div3Bool = false;
            timer=setInterval(function () {
                n++;
                var m=parseInt(n/60);
                var s=parseInt(n%60);
                oTxt.value=toDub(m)+":"+toDub(s);
            },1000/60);
        }
      
    }
    box.oncontextmenu = function () {
        return false;
    }
    box.onmousedown = function (e) {
        var event = e.target;
        if (e.which == 1) {
            leftClick(event);
        } else if (e.which == 3) {
            rightClick(event);
        }
    }
    closeBtn.onclick = function () {
        alertBox.style.display = 'none';
        flagBox.style.display = 'none';
        box.style.display = 'none';
        box.innerHTML = '';
        startGameBool = true;
        div1Bool = true;
        div2Bool = true;
        div3Bool = true;
        div1.style.backgroundColor = '';
        div2.style.backgroundColor = '';
        div3.style.backgroundColor = '';
        oTxt.value = '00:00';
        // beforeDate = new Date().getTime();
        minesNum = 20;
        mineOver =20;
        row = 10;//行
        col = 10;//列
    }
}
function toDub(n){
    return n<10?"0"+n:""+n;
}
function init() { // 生成雷
    // minesNum = 10;
    // mineOver = 10;
    score.innerHTML = mineOver;
    
    for (var i = 0; i < row; i++) {
        for (var j = 0; j < col; j++) {
            var con = document.createElement('div');//小格子
            con.classList.add('block');
            con.setAttribute('id', i + '-' + j);
            box.appendChild(con);
            mineMap.push({ mine: 0 });
        }
    }
    block = document.getElementsByClassName('block');
    while (minesNum) { // 判断是否重复
        var mineIndex = Math.floor(Math.random() * square);
        if (mineMap[mineIndex].mine === 0) {
            mineMap[mineIndex].mine = 1;
            block[mineIndex].classList.add('isLei');
            minesNum--;
        }
    }
}

function leftClick(dom) {
    if(dom.classList.contains('flag')){
        return;
    }
    var isLei = document.getElementsByClassName('isLei');
    if (dom && dom.classList.contains('isLei')) {
        for (var i = 0; i < isLei.length; i++) {
            isLei[i].classList.add('show');
        }
        clearInterval(timer);
        setTimeout(function () {
            alertBox.style.display = 'block';
            alertImg.style.backgroundImage = 'url("img/over.jpg")';
        }, 800)
    } else {
        var n = 0;
        var posArr = dom && dom.getAttribute('id').split('-');
        var posX = posArr && +posArr[0];
        var posY = posArr && +posArr[1];
        dom && dom.classList.add('num');
        /**
         * 判断周围八个区域
         * [i-1,j-1]  [i-1,j]  [i-1, j+1]
         * [i,j-1]    [i,j]    [i,j+1]
         * [i+1,j-1]  [i+1,j]  [i+1,j+1]
         */
        for (var i = posX - 1; i <= posX + 1; i++) {
            for (var j = posY - 1; j <= posY + 1; j++) {
                var aroundBox = document.getElementById(i + '-' + j);
                if (aroundBox && aroundBox.classList.contains('isLei')) {
                    n++;
                }
            }
        }
        dom && (dom.innerHTML = n);
        if (n == 0) { // 如果周围没有雷就扩散
            for (var i = posX - 1; i <= posX + 1; i++) {
                for (var j = posY - 1; j <= posY + 1; j++) {
                    var nearBox = document.getElementById(i + '-' + j);
                    if (nearBox && nearBox.length != 0) {
                        if (!nearBox.classList.contains('check')) {
                            nearBox.classList.add('check');
                            leftClick(nearBox); // 递归
                        }
                    }
                }
            }
        }
    }
}

function rightClick(dom){
    if(dom.classList.contains('num')){ // 表示已经左点击了 
        return;
    }
    dom.classList.toggle('flag');
    if(dom.classList.contains('isLei') &&dom.classList.contains('flag')){ // 判断是否擦对位置
        mineOver --;
    }
    if(dom.classList.contains('isLei') && !dom.classList.contains('flag')){
        mineOver ++;
    }

    score.innerHTML = mineOver;
    if(mineOver == 0){
        alertBox.style.display = 'block';
        alertImg.style.backgroundImage = 'url("img/success.png")';
    }
    return false;
}