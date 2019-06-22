'use strict';

(function (mainPin) {
  var mainMap = document.querySelector('.map');
  var mapPins = document.querySelector('.map__pins');
  var offset = {
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

  var initOffsetCoords = function (x, y) {
    offset.x = x || 0;
    offset.y = y || 0;
  };

  var onPinMouseMove = function (evt) {
    mainPin.setPosition();
    if (evt.clientX - offset.x > mapLimit.left && evt.clientX - offset.x < mapLimit.right - mainPin.width) {
      mainPin.pin.style.left = evt.clientX - offset.x + 'px';
    }

    if (evt.clientY - offset.y > mapLimit.top && evt.clientY - offset.y < mapLimit.bottom) {
      mainPin.pin.style.top = evt.clientY - offset.y + 'px';
    }
  };

  window.map = {
    changeMapStatus: changeMapStatus,
    mapPins: mapPins,
    onPinMouseMove: onPinMouseMove,
    initOffsetCoords: initOffsetCoords
  };
})(window.mainPin);
