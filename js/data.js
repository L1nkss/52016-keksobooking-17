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

(function (Service) {
  var AD_COUNT = 8; // количество объявлений
  var IMAGE_COUNT = 8;
  var PIN_WIDTH = 50; // ширина пина
  var PIN_HEIGHT = 70; // высота пина
  var adTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var infoTemplate = document.querySelector('#card').content.querySelector('.popup');
  var pinList = document.querySelector('.map__pins');
  var ads = [];
  // var service = new Service ('https://js.dump.academy/keksobooking/data');
  // service.createRequest();
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

  //ads = getRandomAds(AD_COUNT);

  // service.http.addEventListener('progress', function() {
  //   console.log('loading');
  // })

  // service.http.addEventListener('load', function (evt) {
  //   ads = JSON.parse(evt.target.responseText);
  // })

  // service.http.addEventListener('error', function (evt) {
  //   console.log('error');
  // })

  // PopUP с подробной информацией

  var createPopup = function (ad) {
    var fragment = document.createDocumentFragment();
    var adElement = infoTemplate.cloneNode(true);
    console.log(ad);
    adElement.querySelector('.popup__avatar').src = ad.author.avatar;
    adElement.querySelector('.popup__text--address').textContent = ad.offer.address;
    adElement.querySelector('.popup__title').textContent = ad.offer.title;
    adElement.querySelector('.popup__text--price').textContent = ad.offer.title + "<span>/ночь</span>"
    adElement.querySelector('.popup__type').textContent = ad.offer.type;

    pinList.appendChild(adElement);
  }

  var renderAds = function (ads) {
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
      adElement.addEventListener('click', function (evt) {
        createPopup(ad);
      })
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
}(window.service));
