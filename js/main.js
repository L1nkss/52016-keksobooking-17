'use strict';

var fragment = document.createDocumentFragment();
var pinList = document.querySelector('.map__pins');
var adTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
/**
 * @constant {number} AD_COUNT - количество объявлений
 */
var AD_COUNT = 8;
/**
 * @constant {number} PIN_WIDTH - ширина пина
 * @constant {number} PIN_HEIGHT - высота пина
 */
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;

document.querySelector('.map').classList.remove('map--faded');

/**
 * Получить случайное число
 *
 * @param {number} min - начальное число
 * @param {number} max - конечное число
 * @return {number}
 *
 * @example
 * getRandomInt(5, 15) // returns 9
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
  var mapWidth = document.querySelector('.map__pins').offsetWidth;
  var IMAGE_COUNT = 8;
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

/**
 * Получить массив случайных элементов
 *
 * @param {number} count -количество объявлений
 * @return {array}
 */
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
  for (var i = 0; i < ads.length; i++) {
    var x = ads[i].location.x - PIN_WIDTH / 2;
    var y = ads[i].location.y - PIN_HEIGHT / 2;
    var type = ads[i].offer.type;
    var avatar = ads[i].author.avatar;
    var adElement = adTemplate.cloneNode(true);

    adElement.style = 'left: ' + x + 'px; top: ' + y + 'px;';
    adElement.querySelector('img').src = avatar;
    adElement.querySelector('img').alt = type;
    /**
      * @description добавляем элемент в фрагмент
    */
    fragment.appendChild(adElement);
  }
  /**
    * @description отрисовываем все элементы
  */
  pinList.appendChild(fragment);
};

renderAds(getRandomAds(AD_COUNT));
