'use strict';

(function (utilities, filter, map) {
  // константы
  var HouseTypes = {
    BUNGALO: 'Бунгало',
    FLAT: 'Квартира',
    HOUSE: 'Дом',
    PALACE: 'Дворец'
  };

  var PIN_WIDTH = 50; // ширина пина
  var PIN_HEIGHT = 70; // высота пина
  var PIN_COUNT = 5; // количество пинов на карте.

  // DOM элементы
  var pinList = document.querySelector('.map__pins');
  var adTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var cardTemplate = document.querySelector('#card').content.querySelector('.popup');
  var formFilter = document.querySelector('.map__filters');

  // переменные
  // объект для хранения активного пина на странице(хранится DOM Элемент пина и карточки)
  var activeCard = {
    information: null,
    domElement: null
  };
  var pins = [];
  // отфильтрованные пины.
  var filteredPins = [];

  // объект в котором хранятся все активные пины на карте(которые отображаются для пользователя)
  var activePins = {
    pins: null,

    get: function () {
      return this.pins;
    },

    define: function () {
      this.pins = Array.prototype.slice.call(document.querySelectorAll('.pin'));
    },

    deleteAll: function () {
      this.pins.forEach(function (pin) {
        pin.remove();
      });
    },

    delete: function (id) {
      this.pins[id].remove();
    }
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

  // функция для отображения пинов через 1с(устранение дребезга)
  var debounce = function (callback, time) {
    var lastTimeout = null;
    time = time || time === 0 ? time : 1000;

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

  //  Функция конструктор для создания карточки с подробной информацией.
  var RenderPinCardInformation = function (ad) {
    this.element = cardTemplate.cloneNode(true);
    this.ad = ad;
    this.imageGallery = this.element.querySelector('.popup__photos');
    this.features = this.element.querySelector('.popup__features');
    this.element.querySelector('.popup__avatar').src = this.ad.author.avatar;
    this.time = 'Заезд после ' + this.ad.offer.checkin + ', выезд до ' + this.ad.offer.checkout;
    this.priceText = this.ad.offer.price + ' ₽/ночь';
    this.guestsRooms = this.ad.offer.rooms + ' комнаты для ' + this.ad.offer.guests + ' гостей';
    this.textContent = [
      {query: '.popup__avatar', value: this.ad.author.avatar},
      {query: '.popup__title', value: this.ad.offer.title},
      {query: '.popup__text--address', value: this.ad.offer.address},
      {query: '.popup__type', value: HouseTypes[this.ad.offer.type.toUpperCase()]},
      {query: '.popup__text--time', value: this.time},
      {query: '.popup__text--capacity', value: this.guestsRooms},
      {query: '.popup__description', value: this.ad.offer.description},
      {query: '.popup__text--price', value: this.priceText}
    ];
  };

  RenderPinCardInformation.prototype.fillTextContent = function () {
    var self = this;
    this.textContent.forEach(function (el) {
      self.element.querySelector(el.query).textContent = el.value;
    });
  };

  RenderPinCardInformation.prototype.onPopupClick = function () {
    clearActiveCard();
  };

  RenderPinCardInformation.prototype.onPopupKeyDown = function (evt) {
    if (utilities.isEscPress(evt.keyCode)) {
      clearActiveCard();
      document.removeEventListener('keydown', this.onPopupKeyDown);
    }
  };

  RenderPinCardInformation.prototype.renderGallery = function () {
    var imageGallery = this.element.querySelector('.popup__photos');
    // Если у объявления нет фотографий, то удаляем этот блок с карточки
    if (this.ad.offer.photos.length === 0) {
      imageGallery.remove();
      return;
    }

    // генерим блок с фотографиями
    this.ad.offer.photos.forEach(function (image) {
      imageGallery.appendChild(renderImage(image));
    });
  };

  RenderPinCardInformation.prototype.renderFeatures = function () {
    var features = this.element.querySelector('.popup__features');

    // Если у объявления нет доп. функций, то удаляем этот блок с карточки
    if (this.ad.offer.features.length === 0) {
      features.remove();
      return;
    }

    // генерим блок с доп. функциями
    this.ad.offer.features.forEach(function (feature) {
      features.appendChild(renderFeaturesList(feature));
    });
  };

  RenderPinCardInformation.prototype.renderElement = function () {
    // заполняем текстовые значение в элементе
    this.fillTextContent();
    // создаём галлерею изображений, если есть фотографии
    this.renderGallery();
    // создаём список доп. функций, если они есть
    this.renderFeatures();
    // вешаем обработчики закрытия элемента
    this.element.querySelector('.popup__close').addEventListener('click', this.onPopupClick);
    document.addEventListener('keydown', this.onPopupKeyDown);

    return this.element;
  };

  // создание первоночального пина в объекте PIN(как пин будет выглядить на карте)
  var renderPin = function (pin) {
    // Если у пина нет информации, то он не нужен
    if (!pin.ad.offer) {
      return null;
    }
    var element = adTemplate.cloneNode(true);
    element.style = 'left: ' + pin.position.left + 'px; top: ' + pin.position.top + 'px;';
    element.querySelector('img').src = pin.ad.author.avatar;
    element.querySelector('img').alt = pin.ad.offer.type;
    pin.element = element;
    pin.element.classList.add('pin');
    pin.checkCoords();

    return true;
  };

  // конструктор класса Pin (пин на карте)
  var Pin = function (ad) {
    this.ad = ad;
    this.width = PIN_WIDTH;
    this.height = PIN_HEIGHT;
    this.element = null;
    this.position = {
      left: this.ad.location.x,
      top: this.ad.location.y
    };
    this.cardInformation = null;

    this.onPinClick = Pin.prototype.pinClick.bind(this);
  };

  /**
   * Проверяем позиции пина на карте. Если пин выходит за границы, то отрисовываем его на границы у которой он выходит
   */
  Pin.prototype.checkCoords = function () {
    // получаем границы карты
    var mapLimits = map.getMapLimitCoords();

    if (this.position.left + this.width > mapLimits.RIGHT) {
      this.position.left = mapLimits.RIGHT - PIN_WIDTH / 2;
    } else if (this.position.left < mapLimits.LEFT) {
      this.position.left = mapLimits.LEFT;
    }

    if (this.position.top + this.height > mapLimits.BOTTOM) {
      this.position.top = mapLimits.BOTTOM - this.height;
    } else if (this.position.top < mapLimits.TOP) {
      this.position.top = mapLimits.TOP;
    }
    this.element.style = 'left: ' + this.position.left + 'px; top: ' + this.position.top + 'px;';
  };

  Pin.prototype.pinClick = function () {
    var pinInformationCard = new RenderPinCardInformation(this.ad).renderElement();

    // проверка активной карточки на карте.
    var flagCard = checkActiveCard(this.element, pinInformationCard);
    if (flagCard) {
      pinList.appendChild(pinInformationCard);
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

  // добавить пины на карту
  var addPinsOnMap = function () {
    var fragment = document.createDocumentFragment();

    filteredPins.forEach(function (pin) {
      pin.element.addEventListener('click', pin.onPinClick);
      fragment.appendChild(pin.element);
    });

    pinList.appendChild(fragment);
  };

  /**
   * Если длина массива pins = 0, создаём новые пины(первое получение данных с сервера).
   * Если массив уже заполнен, просто добавляем пины на карту.
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

    // получаем первые 5 значений пинов по фильтрам.
    filteredPins = pins.filter(filter.values).slice(0, PIN_COUNT);
    addPinsOnMap();
    // получить все пины, которые находятся на карте.
    activePins.define();
  };

  // удалить все объявления
  var removeAds = function () {

    filteredPins.forEach(function (pin) {
      pin.deleteElement();
    });
  };

  // Получить массив отфильтрованных элементов(fragment'ов)
  var getArrayOfElements = function () {
    return filteredPins.map(function (pin) {
      return pin.element;
    });
  };

  // перерисовка объявлений на карте.
  var redrawAds = function () {
    // получаем список отфильтрованных пинов в виде массива их элементов(фрагментов)
    var filteredPinList = getArrayOfElements();

    // если элемент из активных пинов не содержится в отфильтрованном массиве, удаляем его с карты
    activePins.pins.forEach(function (pin, index) {
      var pinID = filteredPinList.indexOf(pin);
      if (pinID === -1) {
        activePins.delete(index);
      }
    });

    // формируем новый отфильтрованный массив без элементов, которые уже на карте
    filteredPins = filteredPins.filter(function (pin) {
      var pinID = activePins.pins.indexOf(pin.element);

      return pinID === -1 ? true : false;
    });

    // Отрисовать все пины
    addPinsOnMap();

    // убираем открытую карточку
    clearActiveCard();

    // заполняем массив с активными карточками
    activePins.define();
  };

  var debounceAds = debounce(redrawAds, 1500);

  var onFilterChange = function () {
    filteredPins = pins.filter(filter.values).slice(0, PIN_COUNT);
    debounceAds();
  };

  formFilter.addEventListener('change', onFilterChange);

  window.data = {
    renderAds: renderAds,
    removeAds: removeAds,
    clearActiveCard: clearActiveCard,
    activePins: activePins
  };
})(window.utilities, window.filter, window.map);
