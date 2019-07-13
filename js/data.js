'use strict';

(function (utilities, filter) {
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
  var PIN_COUNT = 5; // количество пинов на карте.
  var pinList = document.querySelector('.map__pins');
  var adTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var cardTemplate = document.querySelector('#card').content.querySelector('.popup');
  var formFilter = document.querySelector('.map__filters');
  // объект для хранения активного пина на странице(хранится DOM Элемент пина и карточки)
  var activeCard = {
    information: null,
    domElement: null
  };
  var pins = [];
  // отфильтрованные пины.
  var filteredPins = [];

  // функция для отображения пинов через 1с(устранение дребезга)
  var debounce = function (callback) {
    var lastTimeout = null;
    var time = 1000;

    return function () {
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }

      lastTimeout = window.setTimeout(callback, time);
    };
  };

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

  // создание первоночального пина в объекте PIN(как пин будет выглядить на карте)
  var renderPin = function (pin) {
    var element = adTemplate.cloneNode(true);
    element.style = 'left: ' + pin.position.left + 'px; top: ' + pin.position.top + 'px;';
    element.querySelector('img').src = pin.ad.author.avatar;
    element.querySelector('img').alt = pin.ad.offer.type;
    pin.element = element;
    pin.checkCoords();
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

  Pin.prototype.deleteElement = function () {
    this.element.remove();
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
      activeCard.domElement = clickedCard;
      activeCard.information = informationCard;
      activeCard.domElement.classList.add('map__pin--active');
    };

    if (!activeCard.domElement) {
      setNewActiveCard();
      return true;
    }

    if (clickedCard !== activeCard.domElement) {
      activeCard.domElement.classList.remove('map__pin--active');
      activeCard.information.remove();
      setNewActiveCard();
      return true;
    }

    // Если активная карта пуста и активная карта не равна, той которую мы кликнули, возвращаем false
    return false;
  };

  // очищает переменную с активной картой. Убирает класс map__pin--active и закрывает карточку с информацией
  var clearActiveCard = function () {
    if (activeCard.domElement) {
      activeCard.domElement.classList.remove('map__pin--active');
      activeCard.domElement = null;
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

  // добавить пины на карту
  var addPinsInMap = function () {
    filteredPins = pins.filter(filter).slice(0, PIN_COUNT);

    for (var i = 0; i < PIN_COUNT; i++) {
      // если в массиве отфильтрованных массив, есть элемент, добавляем на карту.
      if (filteredPins[i]) {
        addPinToMap(filteredPins[i]);
      }
    }
  };

  /**
   * Функция addPinToMap добавляем пин на карту.
   * @param {object} pin принимает объект pin
   */
  var addPinToMap = function (pin) {
    pin.element.addEventListener('click', pin.onPinClick);
    pinList.appendChild(pin.element);
  };


  /**
   * Если длина массива pins = 0, создаём новые пины(первое получение данных с сервера).
   * Если массив уже заполнен, просто генерим пины на карту.
   * @param {array} ads массив данных, полученных с сервера
   */
  var renderAds = function (ads) {

    if (pins.length === 0) {
      ads.forEach(function (ad) {
        var pin = new Pin(ad);
        renderPin(pin);
        pins.push(pin);
      });
    }

    addPinsInMap();
  };

  // удалить все объявления
  var removeAds = function () {

    filteredPins.forEach(function (pin) {
      pin.deleteElement();
    });
  };

  // перерисовка объявлений на карте.
  var redrawAds = function () {
    // получить все пины, которые находятся на карте.
    var arrayPins = Array.prototype.slice.call(document.querySelectorAll('.map__pin'));

    // проверям отфильтрованный массив и пины, которые есть на карте
    // Если Пина, нет на карте, но есть в отфильтрованном массиве, добавляем на карту
    // Если пин на карте и в отфильтрованном массиве, то удаляем его из всех пинов на карте(для будующего удаления с карты)
    filteredPins.forEach(function (pin) {
      var pinID = arrayPins.indexOf(pin.element);
      if (pinID === -1) {
        addPinToMap(pin);
        return;
      }
      arrayPins.splice(pinID, 1);
    });

    // удаляем все лишние пины с карты.
    arrayPins.forEach(function (el, index) {
      if (index !== 0) {
        el.remove();
      }
    });

    clearActiveCard();
  };

  var debounceAds = debounce(redrawAds);

  var onFilterChange = function () {
    filteredPins = pins.filter(filter).slice(0, PIN_COUNT);
    debounceAds();
  };

  // var testF2 = function (evt) {
  //   return function (element) {
  //     return filter.filter(element, evt);
  //   };
  // };

  // var onFilterChange = function (evt) {
  //   // var testF = testF2(evt);
  //   filteredPins = pins.filter(testF);
  //   debounceAds();
  // };

  formFilter.addEventListener('change', onFilterChange);

  window.data = {
    renderAds: renderAds,
    removeAds: removeAds,
    clearActiveCard: clearActiveCard
  };
})(window.utilities, window.filter);
