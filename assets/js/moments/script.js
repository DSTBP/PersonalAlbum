// =================== 可配置参数 ===================
let radius = 300;            // 图片围绕中心的半径
let autoRotate = true;       // 是否自动旋转
let rotateSpeed = -60;       // 旋转速度，单位: 秒/360度
let imgWidth = 180;          // 图片宽度（单位: px）
let imgHeight = 255;         // 图片高度（单位: px）

// 暴露初始化函数供动态加载后调用
function initMomentsAnimations() {
    // =================== 元素获取 ===================
    const odrag = document.getElementById('drag-container');
    const ospin = document.getElementById('spin-container');
    const aImg = ospin.getElementsByTagName('img');
    const aVid = ospin.getElementsByTagName('video');
    const aEle = [...aImg, ...aVid]; // 合并图片和视频元素

    // 设置容器大小
    ospin.style.width = `${imgWidth}px`;
    ospin.style.height = `${imgHeight}px`;

    // 设置底部地面尺寸（取决于半径）
    const ground = document.getElementById('ground');
    if (ground) {
        ground.style.width = `${radius * 3}px`;
        ground.style.height = `${radius * 3}px`;
    }

    // =================== 初始化函数 ===================
    function init(delayTime) {
        for (let i = 0; i < aEle.length; i++) {
            aEle[i].style.transform = `rotateY(${i * (360 / aEle.length)}deg) translateZ(${radius}px)`;
            aEle[i].style.transition = 'transform 1s';
            aEle[i].style.transitionDelay = delayTime || `${(aEle.length - i) / 4}s`;
        }
    }

    // =================== 旋转控制 ===================
    function applyTransform(obj) {
        // 限制上下旋转角度范围
        if (tY > 180) tY = 180;
        if (tY < 0) tY = 0;
        obj.style.transform = `rotateX(${-tY}deg) rotateY(${tX}deg)`;
    }

    function playSpin(shouldRun) {
        ospin.style.animationPlayState = shouldRun ? 'running' : 'paused';
    }

    // =================== 自动旋转动画 ===================
    if (autoRotate) {
        var animationName = (rotateSpeed > 0 ? 'spin' : 'spinRevert');
        ospin.style.animation = `${animationName} ${Math.abs(rotateSpeed)}s infinite linear`;
    }

    // =================== 拖拽控制 ===================
    let sX, sY, nX, nY, desX = 0, desY = 0;
    let tX = 0, tY = 10;

    // setup events
    var leftPanel = document.querySelector('.left-panel');
    if (leftPanel) {
        // 鼠标拖动旋转
        leftPanel.onpointerdown = function (e) {
            clearInterval(odrag.timer);
            e = e || window.event;
            var sX = e.clientX,
                sY = e.clientY;

            document.onpointermove = function (e) {
                e = e || window.event;
                var nX = e.clientX,
                    nY = e.clientY;
                desX = nX - sX;
                desY = nY - sY;
                tX += desX * 0.1;
                tY += desY * 0.1;
                applyTransform(odrag);
                sX = nX;
                sY = nY;
            };

            document.onpointerup = function (e) {
                odrag.timer = setInterval(function () {
                    desX *= 0.95;
                    desY *= 0.95;
                    tX += desX * 0.1;
                    tY += desY * 0.1;
                    applyTransform(odrag);
                    playSpin(false);
                    if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
                        clearInterval(odrag.timer);
                        playSpin(true);
                    }
                }, 17);
                document.onpointermove = document.onpointerup = null;
            };

            return false;
        };

        // 鼠标滚轮缩放
        leftPanel.onmousewheel = function (e) {
            e = e || window.event;
            e.preventDefault(); // 阻止页面滚动
            var d = e.wheelDelta / 20 || -e.detail;
            radius += d;
            init(1);
        };
    }

    // =================== 六边形图自动背景设置 ===================
    const list = document.querySelectorAll('.hex-item a');
    list.forEach(item => {
        const url = item.children[0].getAttribute('src');
        if (url) {
            item.style.backgroundImage = `url('${url}')`;
        }
    });

    // =================== 启动初始化 ===================
    setTimeout(() => init(), 1000);
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    // 如果内容已经加载，立即初始化
    if (document.getElementById('spin-container') && document.querySelectorAll('#spin-container img, #spin-container video').length > 0) {
        initMomentsAnimations();
    }
});