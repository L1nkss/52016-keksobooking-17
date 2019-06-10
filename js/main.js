'use strict';

var AD_COUNT = 8; // количество объявлений
var PIN_WIDTH = 50; // ширина пина
var PIN_HEIGHT = 70; // высота пина
var pinList = document.querySelector('.map__pins');
var adTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

document.querySelector('.map').classList.remove('map--faded');

/**
 * Получить случайное число
 *
 * @param {number} min - начальное число
 * @param {number} max - конечное число
 * 
 * @return {number}
 */
window.getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

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
  var IMAGE_COUNT = 8;
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
  var ads = [];
  for (var i = 0; i < count; i++) {
    ads.push(getRandomAd());
  }

  return ads;
};
/**
 * Рендерим Объявления
 *
 * @param { array } ads - массив объявлений
 *
 */
var renderAds = function (ads) {
  var fragment = document.createDocumentFragment();
  ads.forEach( function(ad) {
    var left = ad.location.x - PIN_WIDTH / 2;
    var top = ad.location.y - PIN_HEIGHT / 2;
    var type = ad.offer.type;
    var avatar = ad.author.avatar;
    var adElement = adTemplate.cloneNode(true);

    // устанавливаем стили для объявления и добавляем во fragment
    adElement.style = 'left: ' + left + 'px; top: ' + top + 'px;';
    adElement.querySelector('img').src = avatar;
    adElement.querySelector('img').alt = type;
    fragment.appendChild(adElement);
  })
  pinList.appendChild(fragment);
};

renderAds(getRandomAds(AD_COUNT));
