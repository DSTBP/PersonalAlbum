// characters.html 手机端专用脚本，仅影响本页
(function() {
  if (!document.body.classList.contains('characters-page')) return;

  function isMobile() {
    return window.innerWidth <= 768;
  }

  function updateCarouselUI() {
    const leftBtn = document.querySelector('.carousel-container .nav-arrow.left');
    const rightBtn = document.querySelector('.carousel-container .nav-arrow.right');
    if (isMobile()) {
      if (leftBtn) leftBtn.style.display = 'none';
      if (rightBtn) rightBtn.style.display = 'none';
    } else {
      if (leftBtn) leftBtn.style.display = '';
      if (rightBtn) rightBtn.style.display = '';
    }
  }

  // 触摸滑动切换轮播
  function enableCarouselSwipe() {
    const track = document.querySelector('.carousel-track');
    if (!track) return;
    let startX = 0, scrollLeft = 0, isDown = false;
    track.addEventListener('touchstart', function(e) {
      isDown = true;
      startX = e.touches[0].pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    });
    track.addEventListener('touchmove', function(e) {
      if (!isDown) return;
      e.preventDefault();
      const x = e.touches[0].pageX - track.offsetLeft;
      const walk = (startX - x);
      track.scrollLeft = scrollLeft + walk;
    }, { passive: false });
    track.addEventListener('touchend', function() { isDown = false; });
    track.addEventListener('touchcancel', function() { isDown = false; });
  }

  // 导航栏触摸优化（汉堡折叠）
  function navTouchCollapse() {
    const header = document.querySelector('body.characters-page header');
    const hamburger = document.querySelector('.characters-page .hamburger');
    const nav = document.getElementById('characters-nav');
    if (!header || !hamburger || !nav) return;
    function closeMenu() {
      header.classList.remove('nav-open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
    function openMenu() {
      header.classList.add('nav-open');
      hamburger.setAttribute('aria-expanded', 'true');
    }
    hamburger.addEventListener('click', function(e) {
      e.stopPropagation();
      const isOpen = header.classList.toggle('nav-open');
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', function() {
        if (window.innerWidth <= 768) closeMenu();
      });
    });
    document.addEventListener('click', function(e) {
      if (window.innerWidth > 768) return;
      if (!header.classList.contains('nav-open')) return;
      if (!header.contains(e.target)) closeMenu();
    });
    window.addEventListener('resize', function() {
      if (window.innerWidth > 768) closeMenu();
    });
    // 手机端显示汉堡按钮
    function updateHamburgerDisplay() {
      if (window.innerWidth <= 768) {
        hamburger.style.display = 'block';
      } else {
        hamburger.style.display = 'none';
      }
    }
    updateHamburgerDisplay();
    window.addEventListener('resize', updateHamburgerDisplay);
  }

  window.addEventListener('resize', updateCarouselUI);
  document.addEventListener('DOMContentLoaded', function() {
    updateCarouselUI();
    if (isMobile()) enableCarouselSwipe();
    navTouchCollapse();
  });
})(); 