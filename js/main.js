'use strict';

var AD_COUNT = 8; // количество объявлений
var PIN_WIDTH = 50; // ширина пина
var PIN_HEIGHT = 70; // высота пина
var IMAGE_COUNT = 8;
var timeArrival; // время заезда
var timeDeparture; // время выезда
var pinList = document.querySelector('.map__pins');
var adHeader = document.getElementById('title');
var adHeaderText = document.querySelector('.title-label');
var price = document.getElementById('price');
var timein = document.getElementById('timein');
var timeout = document.getElementById('timeout');
var priceHeader = document.querySelector('.price-label');
var houseType = document.getElementById('type');
var adTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var addressInput = document.getElementById('address');
var mapFilter = document.querySelectorAll('.map__filter');
var adForm = document.querySelectorAll('.ad-form__element');
var mainPin = document.querySelector('.map__pin--main');
var map = document.querySelector('.map');
var adFormStatus = document.querySelector('.ad-form');
var ads = []; // массив пользователей
var primaryPin = { // главный пин
  isActive: false,
  activeHeight: mainPin.clientHeight + 22,
  disabledHeight: mainPin.clientHeight,
  width: mainPin.clientWidth
};

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
  var isPageActive = primaryPin.isActive;
  var leftPosition = Math.floor(mainPin.offsetLeft + primaryPin.width / 2);
  var topPosition = Math.floor(isPageActive ? mainPin.offsetTop + (primaryPin.activeHeight / 2) : mainPin.offsetTop + primaryPin.disabledHeight / 2);
  return {
    x: leftPosition,
    y: topPosition
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

/**
 * Рендерим Объявления
 *
 * @param { array } adArray - массив объявлений
 *
 */
var renderAds = function (adArray) {
  var fragment = document.createDocumentFragment();
  adArray.forEach(function (ad) {
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
    renderAds(ads);
  } else {
    removeAds();
  }
};

var onMainPinClick = function () {
  changePageStatus();
  var pinPosition = getMainPinPosition();
  addressInput.value = pinPosition.x + ', ' + pinPosition.y;
};

/**
 * Обработчики событий
 */

window.addEventListener('load', function () {
  var pinPosition = getMainPinPosition();
  addressInput.value = pinPosition.x + ', ' + pinPosition.y;
});

mainPin.addEventListener('click', onMainPinClick);

/**
 * Проверка заполнения поля "Заголов объявления"
 */
adHeader.addEventListener('blur', function (evt) {
  var minValue = 30;
  var textValue = adHeaderText.textContent;
  var value = minValue - evt.target.value.length;
  if (!evt.target.checkValidity()) {
    adHeaderText.textContent = 'Минимальное количество символов 30, осталось: ' + value;
    evt.target.classList.add('invalid-value');
    setTimeout(function () {
      adHeaderText.textContent = textValue;
    }, 1500);
  } else {
    evt.target.classList.remove('invalid-value');
  }
});
/**
 * Проверка заполнения поля "цена за ночь"
 */
price.addEventListener('blur', function (evt) {
  var textValue = priceHeader.textContent;
  var minValue = evt.target.min;
  if (!evt.target.checkValidity()) {
    priceHeader.textContent = 'Цена от ' + minValue + ' до 1000000';
    evt.target.classList.add('invalid-value');
    setTimeout(function () {
      priceHeader.textContent = textValue;
    }, 1500);
  } else {
    evt.target.classList.remove('invalid-value');
  }
});

/**
 * Изменение поля "тип жилья"
 */
houseType.addEventListener('change', function (evt) {
  var value = evt.target.value;

  switch (value) {
    case 'bungalo':
      price.placeholder = 0;
      price.min = 0;
      break;

    case 'flat':
      price.placeholder = 1000;
      price.min = 1000;
      break;

    case 'house':
      price.placeholder = 5000;
      price.min = 5000;
      break;

    case 'palace':
      price.placeholder = 10000;
      price.min = 10000;
      break;
  }

  if (price.checkValidity()) {
    price.classList.remove('invalid-value');
  } else {
    price.classList.add('invalid-value');
  }
});

/**
 * Изменения полей "время заезда и выезда"
*/

timein.addEventListener('change', function (evt) {
  timeArrival = evt.target.value;
  timeDeparture = timeout.value;
  if (timeArrival !== timeDeparture) {
    timeout.value = timeArrival;
  }
});

timeout.addEventListener('change', function (evt) {
  timeArrival = timein.value;
  timeDeparture = evt.target.value;
  if (timeArrival !== timeDeparture) {
    timein.value = timeDeparture;
  }
});
