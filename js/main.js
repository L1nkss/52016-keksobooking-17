'use strict';

(function (pageForm, pageMap, usersAd, primaryPin) {
  var mainPin = primaryPin.mainPin;
  var mapPins = pageMap.mapPins;
  var ads = usersAd;
  var appStatus = false;
  var pinMove = pageMap.onPinMouseMove;
  var initOffCords = pageMap.initOffSetCoords;
  var pricePerNightInput = pageForm.pricePerNightInput;
  var headerInput = pageForm.headerInput;

  var fillAddress = function () {
    var pinPosition = primaryPin.getMainPinPosition();
    pageForm.fillAddress(pinPosition.x, pinPosition.y);
  };

  window.addEventListener('load', function () {
    fillAddress();
  });

  mainPin.addEventListener('mousedown', function (evt) {
    mapPins.addEventListener('mousemove', pinMove);
    var x = evt.clientX - parseInt(evt.currentTarget.style.left, 10);
    var y = evt.clientY - parseInt(evt.currentTarget.style.top, 10);
    initOffCords(x, y);
  });

  mainPin.addEventListener('mousemove', function () {
    fillAddress();
  });

  mapPins.addEventListener('mouseup', function (evt) {
    evt.preventDefault();
    evt.currentTarget.removeEventListener('mousemove', pinMove);
    initOffCords();
  });

  mainPin.addEventListener('click', function () {
    // меняет состояние карты
    pageMap.changeMapStatus();
    // меняем состояние форм
    pageForm.changeFormStatus();
    // меняем адрес
    fillAddress();
    // меняем состояние страницы
    appStatus = !appStatus;

    if (appStatus) {
      ads.renderAds();
    } else {
      ads.removeAds();
      pricePerNightInput.restoreDefaultSetting();
      headerInput.restoreDefaultSetting();
    }
  });
}(window.form, window.map, window.data, window.mainPin));
