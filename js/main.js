'use strict';
var fragment = document.createDocumentFragment();
var pinList = document.querySelector('.map__pins');
var adTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var AD_COUNT = 8;
// размер pin'a
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;

document.querySelector('.map').classList.remove('map--faded');

window.getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

// получить случайное объявление
var getRandomAd = function () {
  // получаем ширину карты где будет метка.
  var mapWidth = document.querySelector('.map__pins').offsetWidth;
  // количество изображений, начиная с 1
  var imageCount = 8;
  // тип жилья
  var types = ['palace', 'flat', 'house', 'bungalo'];

  // получаем случайное число и добавляем к нему 0
  // формируем строку для аватара
  var imageNumber = window.getRandomInt(1, imageCount);
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

// генерируем массив объявлений
var getRandomAds = function (count) {
  var ads = [];
  for (var i = 0; i < count; i++) {
    ads.push(getRandomAd());
  }

  return ads;
};

// отрисовываем все объявления
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

    // добавляем элемент во фрагмент
    fragment.appendChild(adElement);
  }
  // отрисовываем всё
  pinList.appendChild(fragment);
};

renderAds(getRandomAds(AD_COUNT));
