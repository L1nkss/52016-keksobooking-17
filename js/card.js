'use strict';

(function () {
  var HouseTypes = {
    BUNGALO: 'Бунгало',
    FLAT: 'Квартира',
    HOUSE: 'Дом',
    PALACE: 'Дворец'
  };
  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  // var successTemplate = document.querySelector('#success').content.querySelector('.success');
  var adTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var cardTemplate = document.querySelector('#card').content.querySelector('.popup');


  var renderImage = function (image) {
    var img = document.createElement('img');
    img.src = image;
    img.width = 45;
    img.height = 40;
    img.alt = 'Фотография жилья';
    img.classList = 'popup__photo';
    return img;
  };

  var renderFeaturesList = function (feature) {
    var li = document.createElement('li');
    li.classList = 'popup__feature popup__feature--' + feature;

    return li;
  };

  var errorMessage = function () {
    var element = errorTemplate.cloneNode(true);

    return element;
  };

  var pinInformation = function (ad, cardDelete) {
    var element = cardTemplate.cloneNode(true);
    var imageGallery = element.querySelector('.popup__photos');
    var features = element.querySelector('.popup__features');
    var price = ad.offer.price;
    var guestsRooms = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
    var priceText = price + '&#x20bd;<span>/ночь</span>';
    var time = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
    element.querySelector('.popup__avatar').src = ad.author.avatar;
    element.querySelector('.popup__title').textContent = ad.offer.title;
    element.querySelector('.popup__text--address').textContent = ad.offer.address;
    element.querySelector('.popup__text--price').innerHTML = priceText;
    element.querySelector('.popup__type').textContent = HouseTypes[ad.offer.type.toUpperCase()];
    element.querySelector('.popup__text--time').textContent = time;
    element.querySelector('.popup__text--capacity').textContent = guestsRooms;
    element.querySelector('.popup__description').textContent = ad.offer.description;

    ad.offer.photos.forEach(function (image) {
      imageGallery.appendChild(renderImage(image));
    });

    ad.offer.features.forEach(function (feature) {
      features.appendChild(renderFeaturesList(feature));
    });

    var onCardDelete = function () {
      cardDelete(element);
    };

    element.querySelector('.popup__close').addEventListener('click', onCardDelete);

    return element;
  };

  var pin = function (ad) {
    var element = adTemplate.cloneNode(true);
    element.style = 'left: ' + ad.validCoords.left + 'px; top: ' + ad.validCoords.top + 'px;';
    element.querySelector('img').src = ad.avatar;
    element.querySelector('img').alt = ad.type;
    return element;
  };


  window.card = {
    errorMessage: errorMessage,
    pin: pin,
    pinInformation: pinInformation
  };
})();
