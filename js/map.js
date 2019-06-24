'use strict';

(function (mainPin) {
  var pin = mainPin;
  var MapLimit = {
    TOP: 130,
    RIGHT: 1200,
    BOTTOM: 630,
    LEFT: 0
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
     * Проверям выходит ли пин за границы, которые описаны в объекте MapPins.MapLimit
     */
    if (evt.clientX - mapPins.offset.x > MapLimit.LEFT && evt.clientX - mapPins.offset.x < MapLimit.RIGHT - mainPin.width && evt.clientY - mapPins.offset.y > MapLimit.TOP && evt.clientY - mapPins.offset.y < MapLimit.BOTTOM) {
      pin.onMouseMove(evt.clientX - mapPins.offset.x, evt.clientY - mapPins.offset.y);
    }
  };

  var mainMap = new Map(document.querySelector('.map'));
  var mapPins = new MapPins(document.querySelector('.map__pins'));

  window.map = {
    mainMap: mainMap,
    mapPins: mapPins,
  };
})(window.mainPin);
