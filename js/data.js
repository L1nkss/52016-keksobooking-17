'use strict';

(function (utilities) {
  var HouseTypes = {
    BUNGALO: 'Бунгало',
    FLAT: 'Квартира',
    HOUSE: 'Дом',
    PALACE: 'Дворец'
  };
  var MapRestriction = {
    TOP: 130,
    RIGHT: 1200,
    BOTTOM: 630,
    LEFT: 0
  };
  var PIN_WIDTH = 50; // ширина пина
  var PIN_HEIGHT = 70; // высота пина
  var pinList = document.querySelector('.map__pins');
  var adTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var cardTemplate = document.querySelector('#card').content.querySelector('.popup');
  // объект для хранения активного пина на странице(хранится DOM Элемент пина и карточки)
  var activeCard = {
    information: null,
    DomElement: null
  };
  var pins = [];
  var filteredPins = [];
  var test = [];


  /*                                       ТЕСТ ФИЛЬТРАЦИЯ                                         */
  var formFilter = document.querySelector('.map__filters');
  var housingType = document.querySelector('#housing-type');
  var housingPrice = document.querySelector('#housing-price');
  var housingRooms = document.querySelector('#housing-rooms');
  var housingGuests = document.querySelector('#housing-guests');
  var housingFeatures = document.querySelector('#housing-features');

  var filterPrice = function(element) {
    var price = housingPrice.value;
    // var elementPrice = element.ad.offer.price;
    if (price === 'any') {
      return element;
    }

    if (price === 'middle') {
      return element.ad.offer.price >= 10000 && element.ad.offer.price < 50000;
    }

    if (price === 'low') {
      return element.ad.offer.price < 10000;
    }

    if (price === 'high') {
      return element.ad.offer.price > 50000;
    }
  };

  var filterType = function(element) {
    var type = housingType.value;
    var elementType = element.ad.offer.type;

    if (type === 'any') {
      return element
    }

    if (type === 'palace') {
      return elementType === type;
    }

    if (type === 'flat') {
      return elementType === type;
    }

    if (type === 'house') {
      return elementType === type;
    }

    if (type === 'bungalo') {
      return elementType === type;
    }
  }

  var filterRooms = function(element) {
    var rooms = housingRooms.value;
    var elementType = element.ad.offer.rooms;


    if (rooms === 'any') {
      return element
    }

    if (rooms === '1') {
      return elementType === 1;
    }

    if (rooms === '2') {
      return elementType === 2;
    }

    if (rooms === '3') {
      return elementType === 3;
    }
  }

  var filterGuests = function(element) {
    var guests = housingGuests.value;
    var elementType = element.ad.offer.guests;

    if (guests === 'any') {
      return element;
    }

    if (guests === '1') {
      return elementType === 1
    }

    if (guests === '2') {
      return elementType === 2;
    }

    if (guests === '0') {
      return elementType === 0;
    }
  }

  var filterFeatures = function(element) {
    var featuresChecked = Array.prototype.slice.call(housingFeatures.querySelectorAll('input:checked'));
    var features = featuresChecked.map(function(feature) {
      return feature.value;
    })
    var elementFeatures = element.ad.offer.features;

    if (features.length === 0) {
      return element;
    }

    var testF = function(feature) {
      return elementFeatures.indexOf(feature) !== -1;
    }


    if (features.every(testF)) {
      return element;
    }
  };

  var filter = function(element) {
    return filterType(element) && filterPrice(element) && filterRooms(element) && filterGuests(element) && filterFeatures(element);
  }

  formFilter.addEventListener('change', function() {
    filteredPins = pins.filter(filter);
    console.log(filteredPins);
    // Тест
    removeAds();
    var fragment = document.createDocumentFragment();
    filteredPins.forEach(function(pin) {
      renderPin(pin);
      pin.element.addEventListener('click', pin.onPinClick);
      fragment.appendChild(pin.element);
    })
    pinList.appendChild(fragment);
  });
  /*---------------------------------------------------------------------------------------------- */

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
      imageGallery.appendChild(renderImage(image));
    });

    if (ad.offer.features.length === 0) {
      features.remove();
    }

    ad.offer.features.forEach(function (feature) {
      features.appendChild(renderFeaturesList(feature));
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

  /**
   * Проверяем позиции пина на карте. Если пин выходит за границы, то отрисовываем его на границы у которой он выходит
   */
  Pin.prototype.checkCoords = function () {
    if (this.position.left + this.width > MapRestriction.RIGHT) {
      this.position.left = MapRestriction.RIGHT - PIN_WIDTH / 2;
    } else if (this.position.left < MapRestriction.LEFT) {
      this.position.left = MapRestriction.LEFT;
    }

    if (this.position.top + this.height > MapRestriction.BOTTOM) {
      this.position.top = MapRestriction.BOTTOM - this.height;
    } else if (this.position.top < MapRestriction.TOP) {
      this.position.top = MapRestriction.TOP;
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
   * У другого пина убирает этот класс.
   * Если мы кликнули на тот же самый элемент, то не перересовываем карточку.
   * @param {DOM} clickedCard функция принимает DOM элемент pin
   * @param {DOM} informationCard карточка с подробной информацие
   * @return {boolean} возвращает true - если необходимо перерисовывать карточку и false - если нет
   */
  var checkActiveCard = function (clickedCard, informationCard) {
    var setNewActiveCard = function () {
      activeCard.DomElement = clickedCard;
      activeCard.information = informationCard;
      activeCard.DomElement.classList.add('map__pin--active');
    };

    if (!activeCard.DomElement) {
      setNewActiveCard();
      return true;
    }

    if (clickedCard !== activeCard.DomElement) {
      activeCard.DomElement.classList.remove('map__pin--active');
      activeCard.information.remove();
      setNewActiveCard();
      return true;
    }

    // Если активная карта пуста и активная карта не равна, той которую мы кликнули, возвращаем false
    return false;
  };

  // очищает переменную с активной картой. Убирает класс map__pin--active и закрывает карточку с информацией
  var clearActiveCard = function () {
    if (activeCard.DomElement) {
      activeCard.DomElement.classList.remove('map__pin--active');
      activeCard.DomElement = null;
      activeCard.information.remove();
      activeCard.information = null;
    }
  };

  var onPopupClick = function () {
    clearActiveCard();
  };

  var onPopupKeyDown = function (evt) {
    if (utilities.isEscPress(evt.keyCode)) {
      clearActiveCard();
      document.removeEventListener('keydown', onPopupKeyDown);
    }
  };


  /**
   * Функция renderAds генерирует пины на карту.
   * renderPin(pin) - создаёт пины на карте
   * pin.checkCoords() - проверяет координаты пинов. Если пин выходит за границу, перерисовывает в зону карты.
   * @param {array} ads массив данных, полученных с сервера
   */
  var renderAds = function (ads) {
    var fragment = document.createDocumentFragment();
    ads.forEach(function (ad) {
      var pin = new Pin(ad);
      renderPin(pin);
      pins.push(pin);
      pin.checkCoords();
      pin.element.addEventListener('click', pin.onPinClick);
      fragment.appendChild(pin.element);
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
    removeAds: removeAds,
    clearActiveCard: clearActiveCard
  };
})(window.utilities);
