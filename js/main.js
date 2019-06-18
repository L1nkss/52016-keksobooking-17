'use strict';

(function (pageForm, pageMap, usersAd, primaryPin) {
  var mainPin = primaryPin.mainPin;
  var mapPins = pageMap.mapPins;
  var ads = usersAd;
  var nameInput = pageForm.nameInput;
  var priceInput = pageForm.priceInput;
  var appStatus = false;
  var houseType = pageForm.houseType;
  var timein = pageForm.visitTimes.timeIn;
  var timeout = pageForm.visitTimes.timeOut;
  var pinMove = pageMap.onPinMouseMove;
  var initOffCords = pageMap.initOffSetCoords;
  var roomNumber = pageForm.roomNumber;
  var roomNumberChange = pageForm.roomNumberChange;

  var fillAddress = function () {
    var pinPosition = primaryPin.getMainPinPosition();
    pageForm.fillAddress(pinPosition.x, pinPosition.y);
  };

  window.addEventListener('load', function () {
    fillAddress();
  });

  nameInput.input.addEventListener('input', function (evt) {
    nameInput.inputValid(evt.target.value.length);
  });

  priceInput.input.addEventListener('input', function (evt) {
    priceInput.checkInputValid(evt.target.value);
  });

  houseType.addEventListener('change', function (evt) {
    pageForm.changeHouseType(evt.target.value, priceInput);
  });

  timein.addEventListener('change', function (evt) {
    pageForm.visitTimes.syncTime(evt.target, timeout);
  });

  timeout.addEventListener('change', function (evt) {
    pageForm.visitTimes.syncTime(evt.target, timein);
  });

  roomNumber.addEventListener('change', function (evt) {
    roomNumberChange(evt.target.value);
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
      priceInput.restoreDefaultSetting();
      nameInput.restoreDefaultSetting();
    }
  });
}(window.form, window.map, window.data, window.mainPin));
