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

$(document).ready(function() {
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
});
