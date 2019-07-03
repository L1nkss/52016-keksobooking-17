'use strict';

(function () {
  var MapLimit = {
    TOP: 130,
    RIGHT: 1200,
    BOTTOM: 630,
    LEFT: 0
  };

  var isValidX = function (mouseX, width) {
    var left = mouseX - mapPins.offset.x >= MapLimit.LEFT;
    var right = mouseX - mapPins.offset.x <= MapLimit.RIGHT - width;
    return left && right;
  };

  var isValidY = function (mouseY) {
    var top = mouseY - mapPins.offset.y >= MapLimit.TOP;
    var bottom = mouseY - mapPins.offset.y <= MapLimit.BOTTOM;

    return top && bottom;
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

  MapPins.prototype.onPinMouseMove = function (evt, pinWidth) {
    /**
     * Проверям выходит ли пин за границы MapLimit
     */
    return isValidX(evt.clientX, pinWidth) && isValidY(evt.clientY);
  };

  var map = new Map(document.querySelector('.map'));
  var mapPins = new MapPins(document.querySelector('.map__pins'));

  window.map = {
    map: map,
    mapPins: mapPins,
    validCoods: {
      isValidX: isValidX,
      isValidY: isValidY
    }
  };
})();
