'use strict';

(function (pageForm, pageMap, usersAd, mainPin) {
  var mapPins = pageMap.mapPins;
  var ads = usersAd;
  var appStatus = false;
  var pin = mainPin.pin;
  var changeFormStatus = pageForm.changeFormStatus;
  var mainMap = pageMap.mainMap;
  var fillAddress = pageForm.fillAddress;
  var renderAds = ads.renderAds;
  var activatePage = function () {

    if (!appStatus) {
      // меняет состояние карты
      mainMap.changeMapStatus();
      // меняем состояние форм
      changeFormStatus();
      // меняем адрес
      fillAddress();
      // меняем состояние страницы
      appStatus = true;
      // рендерим объявления
      renderAds();
    }
  };

  window.addEventListener('load', function () {
    fillAddress();
  });


  pin.addEventListener('mousedown', function (evt) {
    // активируем страницу при первом зажатии главного пина
    activatePage();
    document.body.addEventListener('mousemove', mapPins.onPinMouseMove);
    var x = evt.clientX - parseInt(evt.currentTarget.style.left, 10);
    var y = evt.clientY - parseInt(evt.currentTarget.style.top, 10);

    mapPins.initOffsetCoords(x, y);
  });

  pin.addEventListener('mousemove', function () {
    fillAddress();
  });

  document.body.addEventListener('mouseup', function (evt) {
    evt.preventDefault();
    document.body.removeEventListener('mousemove', mapPins.onPinMouseMove);
    mapPins.initOffsetCoords();
  });

})(window.form, window.map, window.data, window.mainPin);
