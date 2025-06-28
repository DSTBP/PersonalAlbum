// 加载动画自动隐藏
window.addEventListener('DOMContentLoaded', function () {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.transition = 'opacity 1s';
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 1000);
    }
});