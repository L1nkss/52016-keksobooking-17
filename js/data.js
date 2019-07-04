'use strict';

(function (card) {
  var PIN_WIDTH = 50; // ширина пина
  var PIN_HEIGHT = 70; // высота пина
  var mapMinY = 130;
  var mapMaxY = 630;
  var pinList = document.querySelector('.map__pins');
  var activeCard = null;

  /**
   * Функция checkActiveCard проверяет какой пин сейчас активен и добавляет класс map__pin--active
   * У другого пина убирает этот класс
   * @param {DOM} clickedCard функция принимает DOM элемент pin
   */
  var checkActiveCard = function (clickedCard) {
    if (clickedCard !== activeCard && activeCard) {
      clickedCard.classList.add('map__pin--active');
      activeCard.classList.remove('map__pin--active');
      activeCard = clickedCard;
      return;
    }

    activeCard = clickedCard;
  };

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
    console.log(ad);
    var data = {
      left: ad.location.x + PIN_WIDTH / 2,
      top: ad.location.y + PIN_HEIGHT,
      type: ad.offer.type,
      avatar: ad.author.avatar,
      validCoords: checkCoords(ad.location.x + PIN_WIDTH / 2, ad.location.y + PIN_HEIGHT)
    };
    return card.renderPin(data);
  };

  // callback функция для создания карточек объявлений.
  var onPinClickCallback = function (ad, pin) {
    return function () {
      var pinCard = card.renderPinInformation(ad);
      if (pinCard) {
        checkActiveCard(pin);
        pinList.appendChild(pinCard);
      }
    };
  };


  // рендер объявления
  var renderAds = function (ads) {
    var fragment = document.createDocumentFragment();
    ads.forEach(function (ad) {
      var pin = renderPin(ad);
      var onPinClickShow = onPinClickCallback(ad, pin);
      pin.addEventListener('click', onPinClickShow);
      fragment.appendChild(pin);
    });
    pinList.appendChild(fragment);
  };

  // удалить все объявления
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
