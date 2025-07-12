// 暴露初始化函数供动态加载后调用
function initCharactersAnimations() {
    const cards = document.querySelectorAll(".card");
    const dotsContainer = document.querySelector(".dots");
    const dots = document.querySelectorAll(".dot");
    const memberName = document.querySelector(".member-name");
    const memberRole = document.querySelector(".member-role");
    const memberBio = document.querySelector(".member-bio");
    const leftArrow = document.querySelector(".nav-arrow.left");
    const rightArrow = document.querySelector(".nav-arrow.right");
    
    let currentIndex = 0;
    let isAnimating = false;

    // 从JSON数据获取团队成员信息
    const teamMembers = window.charactersData || [];
    if (teamMembers.length === 0) {
        // Fallback: 从图片alt属性获取信息
        cards.forEach((card, index) => {
            const img = card.querySelector('img');
            if (img) {
                teamMembers.push({
                    name: img.alt || `Team Member ${index + 1}`,
                    role: "Team Member",
                    bio: "A valued member of our team."
                });
            }
        });
    }

    // 动态生成状态点
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < cards.length; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            dot.dataset.index = i;
            dotsContainer.appendChild(dot);
        }
    }

    // 重新获取dots元素
    const updatedDots = document.querySelectorAll(".dot");

    function updateCarousel(newIndex) {
        if (isAnimating) return;
        isAnimating = true;

        currentIndex = (newIndex + cards.length) % cards.length;

        cards.forEach((card, i) => {
            const offset = (i - currentIndex + cards.length) % cards.length;

            card.classList.remove(
                "center",
                "left-1",
                "left-2",
                "right-1",
                "right-2",
                "hidden"
            );

            if (offset === 0) {
                card.classList.add("center");
            } else if (offset === 1) {
                card.classList.add("right-1");
            } else if (offset === 2) {
                card.classList.add("right-2");
            } else if (offset === cards.length - 1) {
                card.classList.add("left-1");
            } else if (offset === cards.length - 2) {
                card.classList.add("left-2");
            } else {
                card.classList.add("hidden");
            }
        });

        updatedDots.forEach((dot, i) => {
            dot.classList.toggle("active", i === currentIndex);
        });

        if (memberName) memberName.style.opacity = "0";
        if (memberRole) memberRole.style.opacity = "0";

        setTimeout(() => {
            if (memberName && teamMembers[currentIndex]) {
                memberName.textContent = teamMembers[currentIndex].name;
            }
            if (memberRole && teamMembers[currentIndex]) {
                memberRole.textContent = teamMembers[currentIndex].role;
            }
            if (memberName) memberName.style.opacity = "1";
            if (memberRole) memberRole.style.opacity = "1";
        }, 300);

        setTimeout(() => {
            isAnimating = false;
        }, 800);
    }

    // 添加事件监听器
    if (leftArrow) {
        leftArrow.addEventListener("click", () => {
            updateCarousel(currentIndex - 1);
        });
    }

    if (rightArrow) {
        rightArrow.addEventListener("click", () => {
            updateCarousel(currentIndex + 1);
        });
    }

    updatedDots.forEach((dot, i) => {
        dot.addEventListener("click", () => {
            updateCarousel(i);
        });
    });

    cards.forEach((card, i) => {
        card.addEventListener("click", () => {
            updateCarousel(i);
        });
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") {
            updateCarousel(currentIndex - 1);
        } else if (e.key === "ArrowRight") {
            updateCarousel(currentIndex + 1);
        }
    });

    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                updateCarousel(currentIndex + 1);
            } else {
                updateCarousel(currentIndex - 1);
            }
        }
    }

    updateCarousel(0);

    // --- 自动轮播 ---
    let autoPlayInterval;
    const teamContainer = document.querySelector('.team-container');

    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            updateCarousel(currentIndex + 1);
        }, 3000); // 每3秒切换一次
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    if (teamContainer) {
        teamContainer.addEventListener('mouseenter', stopAutoPlay);
        teamContainer.addEventListener('mouseleave', startAutoPlay);
    }

    startAutoPlay(); // 页面加载后开始自动轮播
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    // 如果内容已经加载，立即初始化
    if (document.querySelectorAll('.card').length > 0) {
        initCharactersAnimations();
    }
});
