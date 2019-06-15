'use strict';

var AD_COUNT = 8; // количество объявлений
var PIN_WIDTH = 50; // ширина пина
var PIN_HEIGHT = 70; // высота пина
var IMAGE_COUNT = 8;
var pinList = document.querySelector('.map__pins');
var adTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var addressInput = document.getElementById('address');
var mapFilter = document.querySelectorAll('.map__filter');
var adForm = document.querySelectorAll('.ad-form__element');
var mainPin = document.querySelector('.map__pin--main');
var map = document.querySelector('.map');
var adFormStatus = document.querySelector('.ad-form');
var primaryPin = { // главный пин
  isActive: false
};
var users = []; // массив пользователей

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

var getMainPinPosition = function () {
  return {
    x: mainPin.offsetLeft,
    y: mainPin.offsetTop
  };
};

var getRandomAds = function (count) {
  var ads = [];
  for (var i = 0; i < count; i++) {
    ads.push(getRandomAd());
  }

  return ads;
};

users = getRandomAds(AD_COUNT);

/**
 * Рендерим Объявления
 *
 * @param { array } ads - массив объявлений
 *
 */
var renderAds = function (ads) {
  var fragment = document.createDocumentFragment();
  ads.forEach(function (ad) {
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

/**
 * Изменение состояние форм
 */

var changePageStatus = function () {

  // меняет состояние карты
  adFormStatus.classList.toggle('ad-form--disabled');
  map.classList.toggle('map--faded');

  // меняем состояние элементов форм
  mapFilter.forEach(function (el) {
    el.disabled = !el.disabled;
  });

  adForm.forEach(function (el) {
    el.disabled = !el.disabled;
  });

  // отрисовываем или удаляем пины с карты в зависимости от статуса.
  primaryPin.isActive = !primaryPin.isActive;

  if (primaryPin.isActive) {
    renderAds(users);
  } else {
    removeAds();
  }
};

var onMainPinClick = function () {
  var pinPosition = getMainPinPosition();
  changePageStatus();

  if (primaryPin.isActive) {
    addressInput.value = pinPosition.x + ', ' + pinPosition.y;
  } else {
    addressInput.value = ' ';
  }
};


/**
 * Обработчики событий
 */

mainPin.addEventListener('click', onMainPinClick);
