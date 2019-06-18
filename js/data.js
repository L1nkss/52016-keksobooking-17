'use strict';

/**
 * Получить случайное число
 *
 * @param {number} min - начальное число
 * @param {number} max - конечное число (не включительно)
 *
 * @return {number}
 */
window.getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

(function () {
  var AD_COUNT = 8; // количество объявлений
  var IMAGE_COUNT = 8;
  var PIN_WIDTH = 50; // ширина пина
  var PIN_HEIGHT = 70; // высота пина
  var adTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var pinList = document.querySelector('.map__pins');
  var ads = [];
  /**
     * Генератор случайного объявления
     *
     * @return {object}
     *
     * @example
     *
     * {
      *  author: { avatar: 'img/avatars/user02.png'},
      *  offer: { type: 'flat'},
      *  location: { x: 500, y: 320}
      * }
      *
      */
  var getRandomAd = function () {
    var mapWidth = document.querySelector('.map__pins').offsetWidth;
    var types = ['palace', 'flat', 'house', 'bungalo'];
    /**
         * @description Генерируем строку для пути к картинке
         *
         * @example
         *
         * imageString = 'img/avatars/user02.png'
         */
    var imageNumber = window.getRandomInt(1, IMAGE_COUNT);
    var imageString = 'img/avatars/user0' + imageNumber + '.png';

    return {
      author: {
        avatar: imageString
      },
      offer: {
        type: types[window.getRandomInt(0, types.length - 1)]
      },
      location: {
        x: window.getRandomInt(0, mapWidth),
        y: window.getRandomInt(130, 630)
      }
    };
  };

  var getRandomAds = function (count) {
    var randomAds = [];
    for (var i = 0; i < count; i++) {
      randomAds.push(getRandomAd());
    }

    return randomAds;
  };

  ads = getRandomAds(AD_COUNT);

  var renderAds = function () {
    var fragment = document.createDocumentFragment();
    ads.forEach(function (ad) {
      var left = ad.location.x + PIN_WIDTH / 2;
      var top = ad.location.y + PIN_HEIGHT / 2;
      var type = ad.offer.type;
      var avatar = ad.author.avatar;
      var adElement = adTemplate.cloneNode(true);

      // устанавливаем стили для объявления и добавляем во fragment
      adElement.style = 'left: ' + left + 'px; top: ' + top + 'px;';
      adElement.querySelector('img').src = avatar;
      adElement.querySelector('img').alt = type;
      fragment.appendChild(adElement);
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
}());
