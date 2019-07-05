'use strict';

(function (utilities) {
  var HouseTypes = {
    BUNGALO: 'Бунгало',
    FLAT: 'Квартира',
    HOUSE: 'Дом',
    PALACE: 'Дворец'
  };
  var PIN_WIDTH = 50; // ширина пина
  var PIN_HEIGHT = 70; // высота пина
  var mapMinY = 130;
  var mapMaxY = 630;
  var pinList = document.querySelector('.map__pins');
  var adTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var cardTemplate = document.querySelector('#card').content.querySelector('.popup');
  // объект для хранения активного пина на странице(хранится DOM Элемент пина и карточки)
  var activeCard = {
    information: null,
    DomElement: null
  };
  var pins = [];


  // карточка с подробной информацией
  var renderPinInformation = function (ad) {
    var element = cardTemplate.cloneNode(true);
    var imageGallery = element.querySelector('.popup__photos');
    var features = element.querySelector('.popup__features');
    var price = ad.offer.price;
    var guestsRooms = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
    var priceText = price + ' ₽/ночь';
    var time = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
    var textContent = [
      {query: '.popup__avatar', value: ad.author.avatar},
      {query: '.popup__title', value: ad.offer.title},
      {query: '.popup__text--address', value: ad.offer.address},
      {query: '.popup__type', value: HouseTypes[ad.offer.type.toUpperCase()]},
      {query: '.popup__text--time', value: time},
      {query: '.popup__text--capacity', value: guestsRooms},
      {query: '.popup__description', value: ad.offer.description},
      {query: '.popup__text--price', value: priceText}
    ];

    element.querySelector('.popup__avatar').src = ad.author.avatar;
    textContent.forEach(function (el) {
      element.querySelector(el.query).textContent = el.value;
    });

    // Если нет изображений или дополнительных удобств, то удаляем разметку с карточки
    if (ad.offer.photos.length === 0) {
      imageGallery.remove();
    }

    ad.offer.photos.forEach(function (image) {
      imageGallery.appendChild(utilities.renderImage(image));
    });

    if (ad.offer.features.length === 0) {
      features.remove();
    }

    ad.offer.features.forEach(function (feature) {
      features.appendChild(utilities.renderFeaturesList(feature));
    });


    element.querySelector('.popup__close').addEventListener('click', onPopupClick);
    document.addEventListener('keydown', onPopupKeyDown);

    return element;
  };

  // создание пинов на карте
  var renderPin = function (pin) {
    var element = adTemplate.cloneNode(true);
    element.style = 'left: ' + pin.position.left + 'px; top: ' + pin.position.top + 'px;';
    element.querySelector('img').src = pin.ad.author.avatar;
    element.querySelector('img').alt = pin.ad.offer.type;
    pin.element = element;
  };

  function Pin(ad) {
    this.ad = ad;
    this.width = PIN_WIDTH;
    this.height = PIN_HEIGHT;
    this.element = null;
    this.position = {
      left: this.ad.location.x,
      top: this.ad.location.y
    };

    this.onPinClick = Pin.prototype.pinClick.bind(this);
  }

  Pin.prototype.checkCoords = function () {
    if (this.position.left + this.width > 1200) {
      this.position.left = 1200 - PIN_WIDTH / 2;
    } else if (this.position.left < 0) {
      this.position.left = 0;
    }

    if (this.position.top + this.height > mapMaxY) {
      this.position.top = mapMaxY - this.height;
    } else if (this.position.top < mapMinY) {
      this.position.top = mapMinY;
    }
    this.element.style = 'left: ' + this.position.left + 'px; top: ' + this.position.top + 'px;';
  };

  Pin.prototype.pinClick = function () {
    var pinInformation = renderPinInformation(this.ad);
    var flagCard = checkActiveCard(this.element, pinInformation);
    if (flagCard) {
      pinList.appendChild(pinInformation);
    }
  };

  /**
   * Функция checkActiveCard проверяет какой пин сейчас активен и добавляет класс map__pin--active
   * У другого пина убирает этот класс
   * @param {DOM} clickedCard функция принимает DOM элемент pin
   * @param {DOM} informationCard карточка с подробной информацие
   */
  var checkActiveCard = function (clickedCard, informationCard) {
    if (!activeCard.DomElement) {
      activeCard.DomElement = clickedCard;
      activeCard.information = informationCard;
      activeCard.DomElement.classList.add('map__pin--active');
      return true;
    }

    if (clickedCard !== activeCard.DomElement) {
      activeCard.DomElement.classList.remove('map__pin--active');
      activeCard.information.remove();
      activeCard.DomElement = clickedCard;
      activeCard.information = informationCard;
      activeCard.DomElement.classList.add('map__pin--active');
      return true;
    }

    if (clickedCard === activeCard.DomElement) {
      return false;
    }
  };

  // очищает переменную с активной картой. Убирает класс map__pin--active и закрывает карточку с информацией
  var clearActiveCard = function () {
    activeCard.DomElement.classList.remove('map__pin--active');
    activeCard.DomElement = null;
    activeCard.information.remove();
    activeCard.information = null;
  }

  var onPopupClick = function () {
    clearActiveCard();
  };

  var onPopupKeyDown = function (evt) {
    if (utilities.isEscPress(evt.keyCode)) {
      clearActiveCard();
      document.removeEventListener('keydown', onPopupKeyDown);
    }
  };


  // рендер объявления
  var renderAds = function (ads) {
    var fragment = document.createDocumentFragment();
    ads.forEach(function (ad) {
      //var pin = renderPin(ad);
      /* тест */
      var pin2 = new Pin(ad);
      renderPin(pin2);
      pins.push(pin2);
      pin2.checkCoords();
      pin2.element.addEventListener('click', pin2.onPinClick);
      /* ---------------------- */
      // var onPinClickShow = onPinClickCallback(ad, pin);
      // pin.addEventListener('click', onPinClickShow);
      // fragment.appendChild(pin);
      fragment.appendChild(pin2.element);
    });
    pinList.appendChild(fragment);
  };

  // удалить все объявления
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
})(window.utilities);
