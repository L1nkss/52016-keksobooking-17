'use strict';

(function (mainPin) {
  var mainMap = document.querySelector('.map');
  var mapPins = document.querySelector('.map__pins');
  var offSet = {
    x: 0,
    y: 0
  };
  var mapLimit = {
    top: 130,
    right: mainMap.clientWidth,
    bottom: 630,
    left: 0
  };

  var changeMapStatus = function () {
    mainMap.classList.toggle('map--faded');
  };

  var initOffSetCoords = function (x, y) {
    offSet.x = x || 0;
    offSet.y = y || 0;
  };

  var onPinMouseMove = function (evt) {
    mainPin.setPosition();

    if (evt.clientX - offSet.x > mapLimit.left && evt.clientX - offSet.x < mapLimit.right) {
      mainPin.pin.style.left = evt.clientX - offSet.x + 'px';
    }

    if (evt.clientY - offSet.y > mapLimit.top && evt.clientY - offSet.y < mapLimit.bottom) {
      mainPin.pin.style.top = evt.clientY - offSet.y + 'px';
    }
  };

  window.map = {
    changeMapStatus: changeMapStatus,
    mapPins: mapPins,
    onPinMouseMove: onPinMouseMove,
    initOffSetCoords: initOffSetCoords
  };
}(window.mainPin));
