'use strict';

(function () {
  var housingType = document.querySelector('#housing-type');
  var housingPrice = document.querySelector('#housing-price');
  var housingRooms = document.querySelector('#housing-rooms');
  var housingGuests = document.querySelector('#housing-guests');
  var housingFeatures = document.querySelector('#housing-features');

  var filterPrice = function (element) {
    var price = housingPrice.value;
    var elementPrice = element.ad.offer.price;
    var result = false;

    if (price === 'middle') {
      result = elementPrice >= 10000 && elementPrice < 50000;
    }

    if (price === 'low') {
      result = elementPrice < 10000;
    }

    if (price === 'high') {
      result = elementPrice > 50000;
    }

    return price === 'any' ? true : result;
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
  /* ---------------------------- Тест ---------------------------------------- */

  // var filterTypes = {
  //   'housing-type': filterType,
  //   'housing-price': filterPrice,
  //   'housing-rooms': filterRooms,
  //   'housing-guests': filterGuests,
  //   'housing-features': filterFeatures
  // };

  // var filterF = function(ID, element) {
  //   // return filterTypes[ID](element);
  //   filterTypes[ID](element);
  // };

  /* -------------------------------------------------------------------------- */

  var filter = function (element) {
    return filterType(element) && filterPrice(element) && filterRooms(element) && filterGuests(element) && filterFeatures(element);
  };
  // var filter = function(element, evt) {
  //   // console.log(element);
  //   // console.log(evt.target);
  //   // console.log(evt.target.id);
  //   var ID = evt.target.id
  //   filterF(ID, element);
  //   return element.isFiltered ? element : null;
  //   // return filterF(ID, element);
  //   // return filterType(element) && filterPrice(element) && filterRooms(element) && filterGuests(element) && filterFeatures(element);
  // }

  window.filter = filter;
})();
