'use strict';

(function() {
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

  window.filter = {
    filter: filter
  }
  /*---------------------------------------------------------------------------------------------- */
})();
