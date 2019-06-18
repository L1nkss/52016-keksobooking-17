'use strict';

(function (primaryPin) {
  var mainMap = document.querySelector('.map');
  var mapPins = document.querySelector('.map__pins');
  var mainPin = primaryPin.mainPin;
  var offSet = {
    x: 0,
    y: 0
  };

  var changeMapStatus = function () {
    mainMap.classList.toggle('map--faded');
  };

  var initOffSetCoords = function (x, y) {
    offSet.x = x || 0;
    offSet.y = y || 0;
  };

  var onPinMouseMove = function (evt) {
    mainPin.style.left = evt.clientX - offSet.x + 'px';
    mainPin.style.top = evt.clientY - offSet.y + 'px';
  };

  window.map = {
    changeMapStatus: changeMapStatus,
    mapPins: mapPins,
    onPinMouseMove: onPinMouseMove,
    initOffSetCoords: initOffSetCoords
  };
}(window.mainPin));
