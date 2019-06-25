'use strict';

(function (randomAds) {
  var AD_COUNT = 8; // количество объявлений
  var PIN_WIDTH = 50; // ширина пина
  var PIN_HEIGHT = 70; // высота пина
  var mapMinY = 130;
  var mapMaxY = 630;
  var adTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var pinList = document.querySelector('.map__pins');
  //var ads = randomAds.getRandomAds(AD_COUNT);
  var prevPopup;

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

  var renderCard = function (ad) {
    if (prevPopup) {
      pinList.removeChild(prevPopup);
    } else {
      console.log('пусто');
    }
    var cardElement = cardTemplate.cloneNode(true);
    cardElement.querySelector('.popup__avatar').src = ad.author.avatar;
    pinList.appendChild(cardElement);
    var photos = cardElement.querySelector('.popup__photos');
    var img = cardElement.querySelector('.popup__photo').cloneNode(true);
    var features = cardElement.querySelector('.popup__features');
    var time = 'Заезд после' + ad.offer.checkin + ', выезд до' + ad.offer.checkout;
    var price = ad.offer.price + '&#x20bd;<span>/ночь</span>';
    prevPopup = cardElement;
    var typeOfHouse = {
      BUNGALO: 'Бунгало',
      FLAT: 'Квартира',
      HOUSE: 'Дом',
      PALACE: 'Дворец'
    };
    var rooms = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
    var renderImageGallery = function(image) {
      img.src = image;
      return img;
    };


    cardElement.querySelector('.popup__title').textContent = ad.offer.title;
    cardElement.querySelector('.popup__text--address').textContent = ad.offer.address;
    cardElement.querySelector('.popup__type').textContent = typeOfHouse[ad.offer.type.toUpperCase()];
    cardElement.querySelector('.popup__text--capacity').textContent = rooms;
    cardElement.querySelector('.popup__text--time').textContent = time;
    cardElement.querySelector('.popup__text--price').innerHTML = price;
    cardElement.querySelector('.popup__description').textContent = ad.offer.description;
    cardElement.querySelector('.popup__close').addEventListener('click', function () {
      pinList.removeChild(cardElement);
      prevPopup = '';
    })

    ad.offer.features.forEach ( function (el) {
      var li = document.createElement('li');
      var className = 'popup__feature popup__feature--' + el;
      li.classList = className;
      console.log(li);
      features.appendChild(li);
    })


    ad.offer.photos.forEach ( function (el) {
      photos.appendChild(renderImageGallery(el));
    });
  };

  var renderPin = function (ad) {
    var left = ad.location.x + PIN_WIDTH / 2;
    var top = ad.location.y + PIN_HEIGHT;
    var type = ad.offer.type;
    var avatar = ad.author.avatar;
    var adElement = adTemplate.cloneNode(true);

    var validCoords = checkCoords(left, top);
    adElement.style = 'left: ' + validCoords.left + 'px; top: ' + validCoords.top + 'px;';
    adElement.querySelector('img').src = avatar;
    adElement.querySelector('img').alt = type;

    adElement.addEventListener('click', function () {
      renderCard(ad);
    });
    return adElement;
  };

  var renderAds = function (ads) {
    var fragment = document.createDocumentFragment();
    ads.forEach(function (ad) {
      fragment.appendChild(renderPin(ad));
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
})(window.randomAds);
