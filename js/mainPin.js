'use strict';

(function () {
  var mainPin = document.querySelector('.map__pin--main');
  var primaryPin = { // главный пин
    isActive: false,
    activeHeight: mainPin.clientHeight + 22,
    disabledHeight: mainPin.clientHeight,
    width: mainPin.clientWidth
  };

  var getMainPinPosition = function () {
    var isPageActive = primaryPin.isActive;
    var leftPosition = Math.floor(mainPin.offsetLeft + primaryPin.width / 2);
    var topPosition = Math.floor(isPageActive ? mainPin.offsetTop + (primaryPin.activeHeight / 2) : mainPin.offsetTop + primaryPin.disabledHeight / 2);
    return {
      x: leftPosition,
      y: topPosition
    };
  };

  mainPin.addEventListener('click', function () {
    primaryPin.isActive = !primaryPin.isActive;
  });

  window.mainPin = {
    getMainPinPosition: getMainPinPosition,
    mainPinStatus: primaryPin.isActive,
    mainPin: mainPin
  };
}());
