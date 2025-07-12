// 暴露初始化函数供动态加载后调用
function initImageryAnimations() {
    const imgContainer = document.querySelector(".img-container");

    if (imgContainer) {
        setInterval(() => {
            let last = imgContainer.firstElementChild;
            if(last) {
                last.remove();
                imgContainer.appendChild(last);
            }
        }, 2500);
    }

    // 初始化 Magnific Popup
    if (typeof $ !== 'undefined' && $.fn.magnificPopup) {
        $('.container--gallery').magnificPopup({
            delegate: 'a',
            type: 'image',
            mainClass: 'mfp-with-zoom mfp-img-mobile',
            image: {
                verticalFit: true,
            },
            gallery: {
                enabled: true
            },
            zoom: {
                enabled: true,
                duration: 230,
                opener: function(element) {
                    return element.find('img');
                }
            }
        });
    }
}

// 页面加载时初始化
$(document).ready(function() {
    initImageryAnimations();
});
