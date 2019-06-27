'use strict';

(function (card) {
  var PIN_WIDTH = 50; // ширина пина
  var PIN_HEIGHT = 70; // высота пина
  var mapMinY = 130;
  var mapMaxY = 630;
  var pinList = document.querySelector('.map__pins');
  var prevCard;

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
    var data = {
      left: ad.location.x + PIN_WIDTH / 2,
      top: ad.location.y + PIN_HEIGHT,
      type: ad.offer.type,
      avatar: ad.author.avatar,
      validCoords: checkCoords(ad.location.x + PIN_WIDTH / 2, ad.location.y + PIN_HEIGHT)
    };
    return card.pin(data);
  };

  var onPinClickCallback = function (ad, callback) {
    return function () {
      var pinCard = card.pinInformation(ad, callback);
      if (prevCard) {
        pinList.removeChild(prevCard);
      }
      pinList.appendChild(pinCard);
      prevCard = pinCard;
    };
  };

  /**
   * Функция для удаления информации об объявлении
   * Удаляет карточку со страницы и обнуляет предыдущее значение(prevCard)
   */

  var pinCardDelete = function (pinCard) {
    pinList.removeChild(pinCard);
    prevCard = '';
  };

  var renderAds = function (ads) {
    var fragment = document.createDocumentFragment();
    ads.forEach(function (ad) {
      var onPinClickShow = onPinClickCallback(ad, pinCardDelete);
      var pin = renderPin(ad);
      pin.addEventListener('click', onPinClickShow);
      fragment.appendChild(pin);
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
})(window.card);
