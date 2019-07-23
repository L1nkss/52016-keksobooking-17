'use strict';

(function (utilities) {
  // диапазон цен стоимости жилья.
  var rangeOfPrices = {
    'any': {min: 0, max: Infinity},
    'middle': {min: 10000, max: 50000},
    'low': {min: 0, max: 10000},
    'high': {min: 50000, max: Infinity}
  };
  function Housing() {
    this.type = document.querySelector('#housing-type');
    this.price = document.querySelector('#housing-price');
    this.rooms = document.querySelector('#housing-rooms');
    this.guests = document.querySelector('#housing-guests');
    this.features = document.querySelector('#housing-features');
    this.defaultValues = {
      type: this.type.value,
      price: this.price.value,
      rooms: this.rooms.value,
      guests: this.guests.value
    };

    this.restoreDefaultSettings = this.restoreDefaultSettings.bind(this);
    this.features.addEventListener('keydown', this.onFeatureEnterClick);
  }

  // Восстановить значение по умолчанию у полей фильтрации
  Housing.prototype.restoreDefaultSettings = function () {
    // восстанавливаем поля по умолчанию
    this.restoreDefaultValues();

    // восстанавливаем значение по умолчаю для доп. функций.
    this.restoreFeatures();
  };

  Housing.prototype.restoreDefaultValues = function () {
    var self = this;
    // получаем ключи из объекта defaultValue и перебираем их в цикле
    Object.keys(this.defaultValues).forEach(function (key) {
      // у соответсвующего элемента фильтрации устанавливаем значение по умолчанию.
      self[key].value = self.defaultValues[key];
    });
  };

  Housing.prototype.restoreFeatures = function () {
    var checkedFeatures = this.getAllCheckedFeatures();

    checkedFeatures.forEach(function (feature) {
      feature.checked = false;
    });
  };

  Housing.prototype.onFeatureEnterClick = function (evt) {
    if (utilities.isEnterPress(evt.keyCode)) {
      evt.target.checked = !evt.target.checked;
    }
  };

  Housing.prototype.getAllCheckedFeatures = function () {
    return Array.prototype.slice.call(this.features.querySelectorAll('input:checked'));
  };

  Housing.prototype.getValue = function (key) {
    return this[key].value;
  };

  var filters = new Housing();

  var filterPrice = function (element) {
    var elementPrice = element.ad.offer.price;
    var range = rangeOfPrices[filters.getValue('price')];

    return elementPrice >= range.min && elementPrice < range.max;
  };

  var filterType = function (element) {
    var type = filters.getValue('type');
    var elementType = element.ad.offer.type;

    return type === 'any' ? element : elementType === type;
  };

  var filterRooms = function (element) {
    var rooms = filters.getValue('rooms');
    var elementRooms = element.ad.offer.rooms;

    return rooms === 'any' ? element : elementRooms.toString() === rooms;
  };

  var filterGuests = function (element) {
    var guests = filters.getValue('guests');
    var elementGuests = element.ad.offer.guests;

    return guests === 'any' ? element : elementGuests.toString() === guests;
  };

  // получение элемента по доп. функциям дома.
  var filterFeatures = function (element) {
    var featuresChecked = filters.getAllCheckedFeatures();
    var elementFeatures = element.ad.offer.features;
    var result = false;
    var features = featuresChecked.map(function (feature) {
      return feature.value;
    });
    // callback функция для функции получения всех features в фильтрации
    var getFeatures = function (feature) {
      return elementFeatures.indexOf(feature) !== -1;
    };

    if (features.length === 0) {
      result = true;
    }

    // если у всех выбранных функций есть каждый элемент у элемента, возвращаем true;
    if (features.every(getFeatures)) {
      result = true;
    }

    return result;
  };

  var filter = function (element) {
    return filterType(element) && filterPrice(element) && filterRooms(element) && filterGuests(element) && filterFeatures(element);
  };

  window.filter = {
    filter: filter,
    restoreDefaultSetting: filters.restoreDefaultSettings
  };
})(window.utilities);
