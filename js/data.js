'use strict';

(function (randomAds) {
  var AD_COUNT = 8; // количество объявлений
  var PIN_WIDTH = 50; // ширина пина
  var PIN_HEIGHT = 70; // высота пина
  var adTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var pinList = document.querySelector('.map__pins');
  var getRandomAds = randomAds.getRandomAds;
  var ads = getRandomAds(AD_COUNT);

  var renderPin = function (ad) {
    var left = ad.location.x + PIN_WIDTH / 2;
    var top = ad.location.y + PIN_HEIGHT / 2;
    var type = ad.offer.type;
    var avatar = ad.author.avatar;
    var adElement = adTemplate.cloneNode(true);

    // устанавливаем стили для объявления и добавляем во fragment
    adElement.style = 'left: ' + left + 'px; top: ' + top + 'px;';
    adElement.querySelector('img').src = avatar;
    adElement.querySelector('img').alt = type;
    return adElement;
  };

  var renderAds = function () {
    var fragment = document.createDocumentFragment();
    ads.forEach(function (ad) {
      fragment.appendChild(renderPin(ad));
    });
    pinList.appendChild(fragment);
  };

  var removeAds = function () {
    var arrayPins = document.querySelectorAll('.map__pin');
    arrayPins.forEach(function (el, index) {
      if (index !== 0) {
        el.remove();
      }
    });
  };

  window.data = {
    renderAds: renderAds,
    removeAds: removeAds
  };
}(window.randomAds));
