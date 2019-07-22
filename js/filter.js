'use strict';

(function (utilities) {
  var housingType = document.querySelector('#housing-type');
  var housingPrice = document.querySelector('#housing-price');
  var housingRooms = document.querySelector('#housing-rooms');
  var housingGuests = document.querySelector('#housing-guests');
  var housingFeatures = document.querySelector('#housing-features');

  // диапазон цен стоимости жилья.
  var rangeOfPrices = {
    'any': {min: 0, max: Infinity},
    'middle': {min: 10000, max: 50000},
    'low': {min: 0, max: 10000},
    'high': {min: 50000, max: Infinity}
  };

  var filterPrice = function (element) {
    var elementPrice = element.ad.offer.price;
    var range = rangeOfPrices[housingPrice.value];

    return elementPrice >= range.min && elementPrice < range.max;
  };

  var filterType = function (element) {
    var type = housingType.value;
    var elementType = element.ad.offer.type;

    return type === 'any' ? element : elementType === type;
  };

  var filterRooms = function (element) {
    var rooms = housingRooms.value;
    var elementRooms = element.ad.offer.rooms;

    return rooms === 'any' ? element : elementRooms.toString() === rooms;
  };

  var filterGuests = function (element) {
    var guests = housingGuests.value;
    var elementGuests = element.ad.offer.guests;

    return guests === 'any' ? element : elementGuests.toString() === guests;
  };

  // получение элемента по доп. функциям дома.
  var filterFeatures = function (element) {
    var featuresChecked = Array.prototype.slice.call(housingFeatures.querySelectorAll('input:checked'));
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

  var restoreDefaultSetting = function () {
    // получаем массив всех доп. функций, которые выбраны.
    // var features = Array.prototype.slice.call(housingFeatures.querySelectorAll('input:checked'));
    var features = housingFeatures.querySelectorAll('input:checked');

    housingType.value = 'any';
    housingPrice.value = 'any';
    housingRooms.value = 'any';
    housingGuests.value = 'any';

    // у всех выбранных функций убиваем checked.
    features.forEach(function (feature) {
      feature.checked = false;
    });
  };

  var filter = function (element) {
    return filterType(element) && filterPrice(element) && filterRooms(element) && filterGuests(element) && filterFeatures(element);
  };

  var onFeatureEnterClick = function (evt) {
    if (utilities.isEnterPress(evt.keyCode)) {
      evt.target.checked = !evt.target.checked;
    }
  };

  housingFeatures.addEventListener('keydown', onFeatureEnterClick);

  window.filter = {
    filter: filter,
    restoreDefaultSetting: restoreDefaultSetting
  };
})(window.utilities);
