'use strict';

(function (pageForm, pageMap, usersAd, mainPin) {
  var mapPins = pageMap.mapPins;
  var ads = usersAd;
  var pinMove = pageMap.onPinMouseMove;
  var initOffCords = pageMap.initOffsetCoords;
  var appStatus = false;

  var activatePage = function () {

    if (!appStatus) {
      // меняет состояние карты
      pageMap.changeMapStatus();
      // меняем состояние форм
      pageForm.changeFormStatus();
      // меняем адрес
      pageForm.fillAddress();
      // меняем состояние страницы
      appStatus = true;
      // рендерим объявления
      ads.renderAds();
    }
  };

  window.addEventListener('load', function () {
    pageForm.fillAddress();
  });

  mainPin.pin.addEventListener('mousedown', function (evt) {
    // активируем страницу при первом зажатии главного пина
    activatePage();
    mapPins.addEventListener('mousemove', pinMove);
    var x = evt.clientX - parseInt(evt.currentTarget.style.left, 10);
    var y = evt.clientY - parseInt(evt.currentTarget.style.top, 10);
    initOffCords(x, y);
  });

  mainPin.pin.addEventListener('mousemove', function () {
    pageForm.fillAddress();
  });

  mapPins.addEventListener('mouseup', function (evt) {
    evt.preventDefault();
    evt.currentTarget.removeEventListener('mousemove', pinMove);
    initOffCords();
  });
})(window.form, window.map, window.data, window.mainPin);
