'use strict';
var fragment = document.createDocumentFragment();
var pinList = document.querySelector('.map__pins');
var adTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var adCount = 8;

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

var renderAd = function (ad) {
  var x = ad.location.x;
  var y = ad.location.y;
  var type = ad.offer.type;
  var avatar = ad.author.avatar;
  var adElement = adTemplate.cloneNode(true);

  adElement.style = 'left: ' + x + 'px; top: ' + y + 'px;';
  adElement.querySelector('img').src = avatar;
  // пусть будет так
  adElement.querySelector('img').alt = type;

  return adElement;
};

// добавляем всё в fragment
for (var i = 0; i < adCount; i++) {
  fragment.appendChild(renderAd(getRandomAd()));
}

// отрисовываем всё
pinList.appendChild(fragment);


