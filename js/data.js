'use strict';

(function (randomAds) {
  var AD_COUNT = 8; // количество объявлений
  var PIN_WIDTH = 50; // ширина пина
  var PIN_HEIGHT = 70; // высота пина
  var mapMinY = 130;
  var mapMaxY = 630;
  var adTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var pinList = document.querySelector('.map__pins');
  var ads = randomAds.getRandomAds(AD_COUNT);

  var checkCoords = function (posX, posY) {
    if (posX + PIN_WIDTH > 1200) {
      posX = 1200 - PIN_WIDTH / 2;
    } else if (posX < 0) {
      posX = 0;
    }

    if (posY + PIN_HEIGHT > mapMaxY) {
      posY = mapMaxY - PIN_HEIGHT;
    } else if (posY < mapMinY) {
      posX = mapMinY;
    }

    return {
      top: posY,
      left: posX
    };
  };

  var renderPin = function (ad) {
    var left = ad.location.x + PIN_WIDTH / 2;
    var top = ad.location.y + PIN_HEIGHT;
    var type = ad.offer.type;
    var avatar = ad.author.avatar;
    var adElement = adTemplate.cloneNode(true);

    var validCoords = checkCoords(left, top);
    adElement.style = 'left: ' + validCoords.left + 'px; top: ' + validCoords.top + 'px;';
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
})(window.randomAds);
