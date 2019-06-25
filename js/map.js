'use strict';

(function (mainPin) {
  var MapLimit = {
    TOP: 130,
    RIGHT: 1200,
    BOTTOM: 630,
    LEFT: 0
  };

  var isValidX = function (mouseX) {
    if (mouseX - mapPins.offset.x >= MapLimit.LEFT && mouseX - mapPins.offset.x <= MapLimit.RIGHT - mainPin.width) {
      return true;
    } else {
      return false;
    }
  };

  var isValidY = function (mouseY) {
    if (mouseY - mapPins.offset.y > MapLimit.TOP && mouseY - mapPins.offset.y < MapLimit.BOTTOM) {
      return true;
    } else {
      return false;
    }
  };

  function Map(element) {
    this.map = element;
  }

  function MapPins(element) {
    Map.call(this, element);
    this.offset = {
      x: 0,
      y: 0
    };
  }

  Map.prototype.changeMapStatus = function () {
    this.map.classList.toggle('map--faded');
  };

  // наследуем MapPins от Map
  MapPins.prototype = Object.create(Map.prototype);
  MapPins.prototype.constructor = MapPins;

  MapPins.prototype.initOffsetCoords = function (x, y) {
    this.offset.x = x || 0;
    this.offset.y = y || 0;
  };

  MapPins.prototype.onPinMouseMove = function (evt) {
    /**
     * Проверям выходит ли пин за границы MapLimit
     */
    if (isValidX(evt.clientX) && isValidY(evt.clientY)) {
      mainPin.onMouseMove(evt.clientX - mapPins.offset.x, evt.clientY - mapPins.offset.y);
    }
  };

  var map = new Map(document.querySelector('.map'));
  var mapPins = new MapPins(document.querySelector('.map__pins'));

  window.map = {
    map: map,
    mapPins: mapPins,
  };
})(window.mainPin);
